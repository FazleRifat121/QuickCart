import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/product"; // Your Product model

export async function GET(request) {
	try {
		const { userId } = getAuth(request);
		await connectDB();

		const user = await User.findById(userId).populate("wishlist");
		if (!user)
			return NextResponse.json({ success: false, message: "User not found" });

		return NextResponse.json({ success: true, wishlist: user.wishlist });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
