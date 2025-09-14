// app/api/banners/reorder/route.js
import { NextResponse } from "next/server";
import Banner from "@/models/Banner";
import connectDB from "@/config/db";

export async function PUT(req) {
	try {
		await connectDB();

		const { banners } = await req.json(); // expects [{ _id, position }, ...]

		if (!Array.isArray(banners)) {
			return NextResponse.json(
				{ success: false, message: "Invalid payload" },
				{ status: 400 }
			);
		}

		// Update banners positions in parallel
		await Promise.all(
			banners.map((b) =>
				Banner.findByIdAndUpdate(b._id, { position: b.position })
			)
		);

		return NextResponse.json({
			success: true,
			message: "Banner order updated",
		});
	} catch (err) {
		console.error("PUT Banners Error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
