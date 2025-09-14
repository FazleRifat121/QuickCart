import { NextResponse } from "next/server";
import Banner from "@/models/Banner";
import connectDB from "@/config/db";

export async function GET() {
	try {
		await connectDB();
		const banners = await Banner.find().sort({ position: 1 }); // <-- sort by position
		return NextResponse.json({ success: true, banners });
	} catch (err) {
		console.error("GET Banners Error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	try {
		await connectDB();
		const body = await req.json();
		const { imgUrl, link, title } = body;

		if (!imgUrl) {
			return NextResponse.json(
				{ success: false, message: "Image URL is required" },
				{ status: 400 }
			);
		}

		const banner = await Banner.create({
			imgUrl,
			link: link || "/all-products",
			title: title || "Banner",
			position: 0,
		});

		return NextResponse.json({ success: true, banner }, { status: 201 });
	} catch (err) {
		console.error("POST Banners Error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(req) {
	try {
		await connectDB();
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Banner ID required" },
				{ status: 400 }
			);
		}

		await Banner.findByIdAndDelete(id);
		return NextResponse.json({ success: true, message: "Banner deleted" });
	} catch (err) {
		console.error("DELETE Banners Error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
