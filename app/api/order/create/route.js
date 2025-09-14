import connectDB from "@/config/db";
import Order from "@/models/order";
import Product from "@/models/product";
import User from "@/models/User";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
	await connectDB();

	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// 🔴 Ban check
		const user = await User.findById(userId);
		if (user?.banned) {
			return NextResponse.json(
				{ success: false, message: "You are banned and cannot place orders" },
				{ status: 403 }
			);
		}

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
			paymentMethod: normalizedMethod,
			transactionId: normalizedMethod === "COD" ? null : transactionId || null,
			paymentOption: normalizedMethod === "COD" ? null : paymentOption || null,
		});

		// Clear user cart
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
					const product = await Product.findById(i.product);
					return `<li>${i.quantity} × ${product?.name || "Product"}</li>`;
				})
			);

			const mailOptions = {
				from: "QuickCart <no-reply@quickcart.com>",
				to: user.email,
				subject: "Your QuickCart Order Confirmation",
				html: `
					<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
						
						<h2 style="color: #ff6700; text-align: center;">Thank You for Your Order!</h2>
						
						<p>Hi ${user.firstName || "Customer"},</p>
						<p>We’re excited to let you know that your order has been placed successfully. Here are the details of your order:</p>
						
						<p><strong>Order ID:</strong> ${order._id}</p>
						<p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
						${
							order.paymentMethod === "Online Paid" && order.transactionId
								? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>`
								: ""
						}
			
						<h3 style="margin-top: 20px; color: #555;">Items in Your Order:</h3>
						<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
							<thead>
								<tr>
									<th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
									<th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
								</tr>
							</thead>
							<tbody>
								${itemsList
									.map(
										(item) => `
										<tr>
											<td style="border-bottom: 1px solid #eee; padding: 8px;">${item.productName}</td>
											<td style="border-bottom: 1px solid #eee; padding: 8px; text-align: center;">${item.quantity}</td>
										</tr>
									`
									)
									.join("")}
							</tbody>
						</table>
			
						<p><strong>Total Amount:</strong> $${order.amount}</p>
			
						<p>We’ll notify you once your items are shipped. If you have any questions, feel free to reply to this email or contact our support team. We’re here to help!</p>
			
						<p style="text-align: center; margin-top: 30px; font-weight: bold; color: #ff6700;">Thank you for choosing QuickCart!</p>
						<p style="text-align: center; color: #888;">The QuickCart Team</p>
					</div>
				`,
			};

			await transporter.sendMail(mailOptions);
		}

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
