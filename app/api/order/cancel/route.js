// api/order/cancel.js
import Order from "@/models/order";
import { inngest } from "@/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { userId } = getAuth(req);
		const { orderId } = await req.json();

		if (!orderId) {
			return NextResponse.json(
				{ success: false, message: "Order ID required" },
				{ status: 400 }
			);
		}

		const order = await Order.findById(orderId);
		if (!order || order.userId !== userId) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		// Mark order as canceled
		order.status = "Canceled";

		// ✅ Set cancelAt for auto-delete after 48 hours
		order.cancelAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

		await order.save();

		// Notify seller/admin via Inngest
		await inngest.send({
			name: "order/canceled",
			data: { orderId, userId, items: order.items, date: Date.now() },
		});

		return NextResponse.json({ success: true, message: "Order canceled" });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
