import connectDB from "@/config/db"; // correct path
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
	try {
		await connectDB();
		const { userId, ban } = await req.json();

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "Missing userId" },
				{ status: 400 }
			);
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ banned: ban },
			{ new: true }
		);

		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, user });
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
