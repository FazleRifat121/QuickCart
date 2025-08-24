import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";

export async function DELETE(req) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return new Response(
				JSON.stringify({ success: false, message: "Unauthorized" }),
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { addressId } = body;

		if (!addressId) {
			return new Response(
				JSON.stringify({ success: false, message: "Address ID required" }),
				{ status: 400 }
			);
		}

		await connectDB();
		const deleted = await Address.deleteOne({ _id: addressId, userId });

		if (deleted.deletedCount === 0) {
			return new Response(
				JSON.stringify({ success: false, message: "Address not found" }),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Address removed successfully",
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
