import connectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
	await connectDB();

	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		let orders;
		try {
			orders = await Order.find({ userId })
				.populate({
					path: "items.product",
					match: { _id: { $exists: true } },
				})
				.populate({
					path: "address",
					match: { _id: { $exists: true } },
				})
				.sort({ date: -1 });
		} catch (populateErr) {
			console.error("Populate error:", populateErr);
			orders = [];
		}

		return NextResponse.json({ success: true, orders }, { status: 200 });
	} catch (err) {
		console.error("Order fetch error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
