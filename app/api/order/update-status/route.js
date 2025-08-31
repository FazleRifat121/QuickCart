import connectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDB();

		const { orderId, status } = await req.json();
		if (!orderId || !status) {
			return NextResponse.json(
				{ success: false, message: "Missing fields" },
				{ status: 400 }
			);
		}

		const order = await Order.findById(orderId).populate("address");
		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		order.status = status;

		// ✅ track delivery date
		if (status === "Delivered") {
			order.deliveredAt = new Date();
		} else {
			order.deliveredAt = null;
		}

		await order.save();

		return NextResponse.json({
			success: true,
			message: "Order status updated",
			order,
		});
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
