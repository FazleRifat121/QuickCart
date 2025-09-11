// app/api/admin/users/route.js
import connectDB from "@/config/db";
import User from "@/models/User";
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY });

export async function GET(req) {
	try {
		await connectDB();
		const users = await User.find({});
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
		const { userId, role } = await req.json();

		if (!userId || !role)
			return new Response(
				JSON.stringify({ success: false, message: "Missing fields" }),
				{ status: 400 }
			);

		const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
		if (!user)
			return new Response(
				JSON.stringify({ success: false, message: "User not found" }),
				{ status: 404 }
			);

		await clerk.users.updateUser(userId, { publicMetadata: { role } });

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
