import { NextResponse } from "next/server";
import Banner from "@/models/Banner";
import connectDB from "@/config/db";

export async function DELETE(req, { params }) {
	await connectDB();
	const { id } = params;
	await Banner.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}
