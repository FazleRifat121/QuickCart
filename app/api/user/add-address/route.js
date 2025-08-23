import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { userId } = getAuth(request);

		const { address } = await request.json();

		const newAddress = await Address.create({ ...address, userId });

		return NextResponse.json(
			{
				success: true,
				message: "Address added successfully",
				address: newAddress,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to add address" },
			{ status: 500 }
		);
	}
}
