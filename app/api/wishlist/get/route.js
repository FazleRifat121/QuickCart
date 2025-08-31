import { getAuth } from "@clerk/nextjs/server";
import Wishlist from "@/models/wishlist";
import connectDB from "@/config/db";

export async function GET(req) {
	await connectDB();
	const { userId } = getAuth(req);

	if (!userId)
		return new Response(
			JSON.stringify({ success: false, message: "Unauthorized" }),
			{ status: 401 }
		);

	try {
		const wishlist = await Wishlist.findOne({ userId });
		return new Response(
			JSON.stringify({
				success: true,
				wishlist: wishlist ? wishlist.items : [],
			}),
			{ status: 200 }
		);
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, message: err.message }),
			{ status: 500 }
		);
	}
}
