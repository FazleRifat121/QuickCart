import { inngest } from "@/config/inngest";
import Order from "@/models/order";
import connectDB from "@/config/db";

export const orderCreated = inngest.createFunction(
	{ name: "Order Created Handler" },
	{ event: "order/created" },
	async ({ event }) => {
		await connectDB();

		const {
			userId,
			address,
			items,
			discount,
			date,
			paymentMethod,
			paymentOption,
			transactionId,
		} = event.data;

		const amount = items.reduce(
			(acc, item) => acc + item.product.offerPrice * item.quantity,
			0
		);

		const totalAmount =
			amount - (discount || 0) + Math.floor((amount - (discount || 0)) * 0.02);

		const normalizedMethod = paymentMethod === "cod" ? "COD" : "Online Paid";

		await Order.create({
			userId,
			address,
			items,
			amount: totalAmount,
			date,
			paymentMethod: normalizedMethod,
			transactionId: normalizedMethod === "COD" ? null : transactionId || null,
			paymentOption: normalizedMethod === "COD" ? null : paymentOption || null,
		});
	}
);
