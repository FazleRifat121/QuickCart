import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
	try {
		const data = await req.formData();
		const file = data.get("file");

		if (!file) {
			return NextResponse.json(
				{ success: false, message: "No file provided" },
				{ status: 400 }
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		const uploaded = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder: "banners" },
				(err, res) => {
					if (err) reject(err);
					else resolve(res);
				}
			);
			stream.end(buffer);
		});

		return NextResponse.json({ success: true, url: uploaded.secure_url });
	} catch (err) {
		console.error("Upload Banner Error:", err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
