import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/models/address";
import Order from "@/models/order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const { userId } = getAuth(request);

		// Check if user is seller
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		await connectDB();

		// Fetch all orders with product and address
		const orders = await Order.find({})
			.populate("items.product")
			.populate("address")
			.sort({ date: -1 });

		// Attach buyer's email
		const ordersWithEmail = await Promise.all(
			orders.map(async (order) => {
				const buyer = await User.findById(order.userId);
				return {
					...order.toObject(),
					userEmail: buyer?.email || "Unknown",
				};
			})
		);

		return NextResponse.json(
			{ success: true, orders: ordersWithEmail },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
