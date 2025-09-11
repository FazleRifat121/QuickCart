import connectDB from "@/config/db";
import Promo from "@/models/promo";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
	await connectDB();
	const { id } = params;

	try {
		const promo = await Promo.findByIdAndDelete(id);
		if (!promo) {
			return NextResponse.json(
				{ success: false, message: "Promo not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			message: "Promo deleted successfully",
		});
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
