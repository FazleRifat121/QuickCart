import { getAuth } from "@clerk/nextjs/server";
import Wishlist from "@/models/wishlist";
import connectDB from "@/config/db";

export async function POST(req) {
	await connectDB();
	const { userId } = getAuth(req);
	if (!userId)
		return new Response(
			JSON.stringify({ success: false, message: "Unauthorized" }),
			{ status: 401 }
		);

	try {
		const body = await req.json();
		const { wishlist } = body;

		const updated = await Wishlist.findOneAndUpdate(
			{ userId },
			{ items: wishlist },
			{ upsert: true, new: true }
		);

		return new Response(
			JSON.stringify({ success: true, wishlist: updated.items }),
			{ status: 200 }
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, message: err.message }),
			{ status: 500 }
		);
	}
}
