// app/api/product/popularity/[id].js
import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
	await connectDB();
	const { id } = params;

	const product = await Product.findById(id);
	if (!product)
		return NextResponse.json(
			{ success: false, message: "Product not found" },
			{ status: 404 }
		);

	product.popularity += 1;
	await product.save();

	return NextResponse.json({ success: true, popularity: product.popularity });
}
