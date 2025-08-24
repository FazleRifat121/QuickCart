import connectDB from "@/config/db";
import Product from "@/models/product";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req) {
	try {
		const { userId } = getAuth(req);
		const isSeller = await authSeller(userId);

		if (!isSeller) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		await connectDB();

		// Get product ID from URL
		const urlParts = req.url.split("/");
		const productId = urlParts[urlParts.length - 1];

		const product = await Product.findById(productId);

		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}

		if (product.userId !== userId) {
			return NextResponse.json(
				{ success: false, message: "You cannot delete this product" },
				{ status: 403 }
			);
		}

		await product.deleteOne();

		return NextResponse.json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
