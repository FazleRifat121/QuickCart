import connectDB from "@/config/db";
import Order from "@/models/order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
	await connectDB();

	try {
		const { userId } = getAuth(request);
		const orders = await Order.find({ userId })
			.populate("items.product")
			.populate("address")
			.sort({ date: -1 });

		return NextResponse.json({ success: true, orders }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
