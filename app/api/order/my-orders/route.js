// app/api/order/my-orders/route.js
import connectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
	await connectDB();

	try {
		const { userId } = getAuth(request);
		if (!userId)
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);

		let orders;
		try {
			// Fetch orders safely
			orders = await Order.find({ userId })
				.populate({
					path: "items.product",
					// Just in case a product reference is missing, don't crash
					match: { _id: { $exists: true } },
				})
				.sort({ date: -1 });
		} catch (populateErr) {
			console.error("Populate failed for orders:", populateErr);
			// fallback: return empty array if populate fails
			orders = [];
		}

		return NextResponse.json({ success: true, orders }, { status: 200 });
	} catch (err) {
		console.error("Order fetch error for user:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
