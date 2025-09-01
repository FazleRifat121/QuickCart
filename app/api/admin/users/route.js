import connectDB from "@/config/db";
import User from "@/models/User";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
	try {
		await connectDB();
		const users = await User.find({}, "-cartItems");
		return new Response(JSON.stringify({ success: true, users }), {
			status: 200,
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, message: err.message }),
			{ status: 500 }
		);
	}
}

export async function PATCH(req) {
	try {
		await connectDB();
		const { userId, publicRole } = await req.json();

		// Update MongoDB
		const user = await User.findByIdAndUpdate(
			userId,
			{ publicRole },
			{ new: true }
		);

		// Update Clerk public metadata
		await clerkClient.users.updateUser(userId, {
			publicMetadata: { publicRole },
		});

		return new Response(JSON.stringify({ success: true, user }), {
			status: 200,
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, message: err.message }),
			{ status: 500 }
		);
	}
}
