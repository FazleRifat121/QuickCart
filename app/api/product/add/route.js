import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);

		if (!isSeller) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		const name = formData.get("name");
		const description = formData.get("description");
		const category = formData.get("category");
		const price = formData.get("price");
		const offerPrice = formData.get("offerPrice");
		const brand = formData.get("brand");
		const color = formData.get("color");
		const files = formData.getAll("image");
		const videoFile = formData.get("video"); // ✅ new video file

		if (!files || files.length === 0) {
			return NextResponse.json(
				{ success: false, message: "No images provided" },
				{ status: 400 }
			);
		}

		// ✅ Upload images
		const imageResults = await Promise.all(
			files.map(async (file) => {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				return new Promise((resolve, reject) => {
					const stream = cloudinary.uploader.upload_stream(
						{ resource_type: "image" },
						(error, result) => {
							if (error) reject(error);
							else resolve(result);
						}
					);
					stream.end(buffer);
				});
			})
		);

		const image = imageResults.map((res) => res.secure_url);

		// ✅ Upload video (same logic as images)
		let video = null;
		if (videoFile && typeof videoFile !== "string") {
			const arrayBuffer = await videoFile.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			video = await new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ resource_type: "video" },
					(error, result) => {
						if (error) reject(error);
						else resolve(result.secure_url);
					}
				);
				stream.end(buffer);
			});
		}

		await connectDB();

		const newProduct = await Product.create({
			userId,
			name,
			description,
			category,
			price: Number(price),
			offerPrice: Number(offerPrice),
			brand,
			color,
			image,
			video, // ✅ stored same as image
			date: Date.now(),
		});

		return NextResponse.json(
			{ success: true, message: "Product created successfully", newProduct },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
