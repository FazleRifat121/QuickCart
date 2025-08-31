import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("query") || "";

		if (!query) {
			return NextResponse.json({ success: true, products: [] });
		}

		// Search by name, category, or brand (case-insensitive)
		const products = await Product.find({
			$or: [
				{ name: { $regex: query, $options: "i" } },
				{ category: { $regex: query, $options: "i" } },
				{ brand: { $regex: query, $options: "i" } },
				{ color: { $regex: query, $options: "i" } },
			],
		}).limit(10);

		return NextResponse.json({ success: true, products });
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
