import connectDB from "@/config/db";
import Order from "@/models/order";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
	await connectDB();

	try {
		// Fetch all products
		const products = await Product.find({}).lean();

		// Fetch all orders
		const orders = await Order.find({}).populate("items.product");

		// Count orders for each product
		const orderCountMap = {};
		orders.forEach((order) => {
			order.items.forEach((item) => {
				const prodId = item.product._id.toString();
				orderCountMap[prodId] =
					(orderCountMap[prodId] || 0) + (item.quantity || 1);
			});
		});

		// Add order count to products
		const productsWithCount = products.map((p) => ({
			...p,
			orderCount: orderCountMap[p._id.toString()] || 0,
		}));

		// Sort by order count descending
		productsWithCount.sort((a, b) => b.orderCount - a.orderCount);

		return NextResponse.json({ success: true, products: productsWithCount });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
