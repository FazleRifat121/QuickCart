import connectDB from "@/config/db";
import Order from "@/models/order";

export async function POST(req) {
	try {
		await connectDB();
		const { orderId } = await req.json();

		// Update order status to Delivered
		const updated = await Order.findByIdAndUpdate(
			orderId,
			{ status: "Delivered" },
			{ new: true }
		);

		if (!updated) {
			return Response.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		return Response.json({ success: true, order: updated });
	} catch (err) {
		return Response.json(
			{ success: false, message: err.message },
			{ status: 500 }
		);
	}
}
