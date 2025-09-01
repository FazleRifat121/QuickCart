import connectDB from "@/config/db";
import Order from "@/models/order";
import Product from "@/models/product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
	await connectDB();

	try {
		const { userId } = getAuth(request);
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
			paymentMethod: normalizedMethod, // COD or Online Paid
			transactionId: normalizedMethod === "COD" ? null : transactionId || null,
			paymentOption: normalizedMethod === "COD" ? null : paymentOption || null, // bkash, nagad, stripe
		});

		// Clear user cart
		const user = await User.findById(userId);
		user.cartItems = [];
		await user.save();

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
