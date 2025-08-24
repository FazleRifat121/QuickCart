import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const { userId } = getAuth(request);
		const { address, items } = await request.json();

		if (!address || !items || items.length === 0) {
			return NextResponse.json(
				{ success: false, message: "Invalid order data" },
				{ status: 400 }
			);
		}

		// ✅ calculate price properly
		let amount = 0;
		for (const item of items) {
			const product = await Product.findById(item.product);
			if (!product) {
				return NextResponse.json(
					{ success: false, message: "Product not found" },
					{ status: 404 }
				);
			}
			amount += product.offerPrice * item.quantity;
		}
		amount += Math.floor(amount * 0.02); // add 2% fee

		// ✅ send order event with slash
		await inngest.send({
			name: "order/created",
			data: {
				userId,
				address,
				items,
				amount,
				date: Date.now(),
			},
		});

		// clear user cart
		const user = await User.findById(userId);
		if (user) {
			user.cart = {};
			await user.save();
		}

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
