import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { userId } = getAuth(request);
		const { cartData } = await request.json();

		await connectDB();

		const user = await User.findById(userId);
		if (!user)
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);

		user.cartItems = cartData;
		await user.save();

		return NextResponse.json({ success: true, message: "Cart updated" });
	} catch (error) {
		console.error("Cart update error:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	try {
		const { userId } = getAuth(request);
		await connectDB();
		const user = await User.findById(userId);
		const { cartItems } = user || {};
		return NextResponse.json({ success: true, cartItems: cartItems || {} });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
