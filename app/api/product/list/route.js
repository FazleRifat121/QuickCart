import connectDB from "@/config/db";
import Product from "@/models/product";
import User from "@/models/User"; // Add this
import { getAuth } from "@clerk/nextjs/server"; // Add this
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		await connectDB();

		// Get user ID
		const { userId } = getAuth(request);

		// Check if banned
		if (userId) {
			const user = await User.findById(userId);
			if (user?.banned) {
				return NextResponse.json(
					{ success: false, message: "You are banned" },
					{ status: 403 }
				);
			}
		}

		const products = await Product.find({});
		return NextResponse.json({ success: true, products }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
