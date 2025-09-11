import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(request) {
	await connectDB();

	try {
		const { userId, ban } = await request.json();

		if (!userId || typeof ban !== "boolean") {
			return NextResponse.json(
				{ success: false, message: "Invalid data" },
				{ status: 400 }
			);
		}

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		user.banned = ban;
		await user.save();

		return NextResponse.json({
			success: true,
			user,
			message: `User has been ${ban ? "banned" : "unbanned"}`,
		});
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
