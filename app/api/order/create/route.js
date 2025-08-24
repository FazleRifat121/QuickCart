import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { userId } = getAuth(request);
		const { address, items } = await request.json();

		if (!address || items.length === 0) {
			return NextResponse.json(
				{ success: false, message: "Invalid  data" },
				{ status: 400 }
			);
		}

		// ✅ calculate price properly
		const amount = await items.reduce(async (accP, item) => {
			const acc = await accP;
			const product = await Product.findById(item.product);
			return acc + product.offerPrice * item.quantity;
		}, 0);

		// ✅ send order event with slash
		await inngest.send({
			name: "order/created",
			data: {
				userId,
				address,
				items,
				amount: amount + Math.floor(amount * 0.02),
				date: Date.now(),
			},
		});

		// clear user cart
		const user = await User.findById(userId);
		user.cartItems = [];
		await user.save();

		return NextResponse.json(
			{ success: true, message: "Order Placed" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
