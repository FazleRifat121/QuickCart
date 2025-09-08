import connectDB from "@/config/db";
import Order from "@/models/order";
import Product from "@/models/product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
	await connectDB();

	try {
		const { userId } = getAuth(request);
		const {
			address,
			items,
			paymentMethod,
			paymentOption,
			transactionId,
			discount,
		} = await request.json();

		if (!address || !items?.length) {
			return NextResponse.json(
				{ success: false, message: "Invalid data" },
				{ status: 400 }
			);
		}

		// Calculate total
		let amount = 0;
		for (const item of items) {
			const product = await Product.findById(item.product);
			if (!product) continue;
			amount += product.offerPrice * item.quantity;
		}

		const totalAmount =
			amount - (discount || 0) + Math.floor((amount - (discount || 0)) * 0.02);

		// Normalize method for DB
		const normalizedMethod = paymentMethod === "cod" ? "COD" : "Online Paid";

		// Save order in DB
		const order = await Order.create({
			userId,
			address,
			items,
			amount: totalAmount,
			date: Date.now(),
			paymentMethod: normalizedMethod, // COD or Online Paid
			transactionId: normalizedMethod === "COD" ? null : transactionId || null,
			paymentOption: normalizedMethod === "COD" ? null : paymentOption || null, // bkash, nagad, stripe
		});

		// Clear user cart
		const user = await User.findById(userId);
		user.cartItems = [];
		await user.save();

		// ========================
		// 📧 Send confirmation email
		// ========================
		if (user?.email) {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			// Build order items list with actual product names from DB
			const itemsList = await Promise.all(
				items.map(async (i) => {
					const product = await Product.findById(i.product); // fetch actual product
					return `<li>${i.quantity} × ${product?.name || "Product"}</li>`;
				})
			);

			const mailOptions = {
				from: "QuickCart",
				to: user.email,
				subject: "Order Confirmation",
				html: `
					<h2>Thank you for your order!</h2>
					<p>Your order has been placed successfully.</p>
					<p><strong>Order ID:</strong> ${order._id}</p>
					<p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
					${
						order.paymentMethod === "Online Paid" && order.transactionId
							? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>`
							: ""
					}
					<p><strong>Items:</strong></p>
					<ul>${itemsList.join("")}</ul>
					<p><strong>Total Amount:</strong> $${order.amount}</p>
				`,
			};

			await transporter.sendMail(mailOptions);
		}

		// Response
		return NextResponse.json(
			{ success: true, message: "Order Placed", order },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
