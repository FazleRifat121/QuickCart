import connectDB from "@/config/db";
import Promo from "@/models/promo";
import { NextResponse } from "next/server";

export async function GET() {
	await connectDB();
	const promos = await Promo.find({ active: true });
	return NextResponse.json({ success: true, promos });
}

export async function POST(req) {
	await connectDB();
	const { code, discountPercent } = await req.json();
	if (!code || !discountPercent) {
		return NextResponse.json(
			{ success: false, message: "All fields required" },
			{ status: 400 }
		);
	}

	try {
		const promo = await Promo.create({
			code: code.toUpperCase(),
			discountPercent,
		});
		return NextResponse.json({ success: true, promo });
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
