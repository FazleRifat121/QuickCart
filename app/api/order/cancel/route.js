// app/api/order/cancel/route.js
import connectDB from "@/config/db";
import Order from "@/models/order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
	try {
		await connectDB();

		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { orderId, reason } = await req.json();
		if (!orderId) {
			return NextResponse.json(
				{ success: false, message: "Order ID required" },
				{ status: 400 }
			);
		}

		const order = await Order.findById(orderId).populate("items.product");
		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		const isBuyer = order.userId === userId;
		const isSeller = true; // single seller owns all

		if (!isBuyer && !isSeller) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized - not buyer or seller" },
				{ status: 403 }
			);
		}

		order.status = "Canceled";
		order.cancelReason =
			reason || (isBuyer ? "Canceled by buyer" : "Canceled by seller");
		order.cancelAt = new Date();
		await order.save();

		// Notify buyer
		const buyer = await User.findById(order.userId);
		if (buyer?.email) {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			const itemsList = order.items
				.map((i) => `<li>${i.quantity} × ${i.product?.name || "Product"}</li>`)
				.join("");

			const mailOptions = {
				from: "QuickCart <no-reply@quickcart.com>",
				to: buyer.email,
				subject: "Update on Your Order",
				html: `
						<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
							<h2 style="color: #ff6700; text-align: center;">Hello ${
								buyer.firstName || "Customer"
							},</h2>
							<p>We wanted to let you know that your order has been <strong>canceled</strong>. Please find the details below:</p>
							
							<p><strong>Order ID:</strong> ${order._id}</p>
							<p><strong>Reason for Cancellation:</strong> ${order.cancelReason}</p>
				
							<h3 style="margin-top: 20px; color: #555;">Items in Your Order:</h3>
							<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
								<thead>
									<tr>
										<th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
										<th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
									</tr>
								</thead>
								<tbody>
									${order.items
										.map(
											(item) => `
										<tr>
											<td style="border-bottom: 1px solid #eee; padding: 8px;">${item.product.name}</td>
											<td style="border-bottom: 1px solid #eee; padding: 8px; text-align: center;">${item.quantity}</td>
										</tr>
									`
										)
										.join("")}
								</tbody>
							</table>
				
							<p><strong>Total Amount:</strong> $${order.amount}</p>
				
							<p style="margin-top: 20px;">We apologize for any inconvenience this may have caused. If you have any questions or need assistance, please contact our support team—we’re happy to help!</p>
				
							<p style="text-align: center; margin-top: 30px; font-weight: bold; color: #ff6700;">Thank you for choosing QuickCart!</p>
							<p style="text-align: center; color: #888;">The QuickCart Team</p>
						</div>
					`,
			};

			await transporter.sendMail(mailOptions);
		}

		return NextResponse.json({
			success: true,
			message: "Order canceled successfully",
			order,
		});
	} catch (err) {
		console.error("❌ Cancel Order Error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
