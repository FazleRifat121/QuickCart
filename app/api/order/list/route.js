import connectDB from "@/config/db";
import Order from "@/models/order";
import Product from "@/models/product";
import Address from "@/models/address";
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
					model: Product,
				})
				.populate({
					path: "address",
					model: Address,
				})
				.sort({ date: -1 });
		} catch (populateErr) {
			console.error("Populate error:", populateErr);
			orders = [];
		}

		// Add visible orderNumber
		const ordersWithNumber = orders.map((order) => ({
			...order._doc,
			orderNumber:
				order.orderNumber || order._id.toString().slice(-6).toUpperCase(),
		}));

		return NextResponse.json(
			{ success: true, orders: ordersWithNumber },
			{ status: 200 }
		);
	} catch (err) {
		console.error("Order fetch error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
