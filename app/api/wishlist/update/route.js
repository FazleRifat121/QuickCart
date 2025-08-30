import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { userId } = getAuth(req);
		const { productId } = await req.json(); // only the single productId

		await connectDB();

		const user = await User.findById(userId);
		if (!user)
			return NextResponse.json({ success: false, message: "User not found" });

		// Initialize wishlist if not array
		if (!Array.isArray(user.wishlist)) user.wishlist = [];

		// Check if product is already in wishlist
		const index = user.wishlist.indexOf(productId);
		if (index > -1) {
			// Remove from wishlist
			user.wishlist.splice(index, 1);
		} else {
			// Add to wishlist
			user.wishlist.push(productId);
		}

		await user.save();

		return NextResponse.json({ success: true, wishlist: user.wishlist });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
