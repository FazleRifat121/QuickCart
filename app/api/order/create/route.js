import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { err } from "inngest/types";
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
		//calculate price using items ammount
		const amount = await items.reduce(async (acc, item) => {
			const product = await Product.findById(item.product);
			return acc + product.offerPrice * item.quantity;
		}, 0);
		await inngest.send({
			name: "order/created",
			data: {
				userId,
				address,
				items,
				amount: amount + math.floor(amount * 0.02),
				date: date.now(),
			},
		});
		//clear user cart
		const user = await User.findById(userId);
		user.cart = {};
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
