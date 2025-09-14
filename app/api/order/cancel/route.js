import Order from "@/models/order";
import User from "@/models/User";
import { inngest } from "@/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
	try {
		const { userId } = getAuth(req);
		const { orderId, reason, isSellerCancel } = await req.json();

		if (!orderId) {
			return NextResponse.json(
				{ success: false, message: "Order ID required" },
				{ status: 400 }
			);
		}

		const order = await Order.findById(orderId);
		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		// Only allow user to cancel their order or seller to cancel
		if (!isSellerCancel && order.userId !== userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		order.status = "Canceled";
		order.cancelReason = reason || "Order canceled";
		order.cancelAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // auto-delete after 48h
		await order.save();

		// Handle refund for online payments
		let refundInfo = "";
		if (order.paymentMethod === "Online Paid") {
			// TODO: integrate real refund API here (Stripe, PayPal, etc.)
			// Example: const refundTransactionId = await refundPayment(order.transactionId, order.amount);
			const refundTransactionId = `REFUND-${Date.now()}`; // simulate
			refundInfo = `Refund Transaction ID: ${refundTransactionId}`;
		}

		// Notify user via email
		const user = await User.findById(order.userId);
		if (user?.email) {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			const itemsList = await Promise.all(
				order.items.map(async (i) => {
					const product = i.product; // assuming populated
					return `<li>${i.quantity} × ${product?.name || "Product"}</li>`;
				})
			);

			const mailOptions = {
				from: "QuickCart",
				to: user.email,
				subject: "Order Canceled",
				html: `
					<h2>Your order has been canceled</h2>
					<p><strong>Order ID:</strong> ${order._id}</p>
					<p><strong>Reason:</strong> ${order.cancelReason}</p>
					<p><strong>Items:</strong></p>
					<ul>${itemsList.join("")}</ul>
					<p><strong>Total Amount:</strong> $${order.amount}</p>
					${refundInfo ? `<p><strong>${refundInfo}</strong></p>` : ""}
				`,
			};

			await transporter.sendMail(mailOptions);
		}

		// Notify seller/admin via Inngest
		await inngest.send({
			name: "order/canceled",
			data: { orderId, userId, items: order.items, date: Date.now(), reason },
		});

		return NextResponse.json({ success: true, message: "Order canceled" });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
