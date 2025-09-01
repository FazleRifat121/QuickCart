import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: { type: String, required: true, ref: "User" },
	items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "Product",
			},
			quantity: { type: Number, required: true },
		},
	],
	amount: { type: Number, required: true },
	address: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Address",
	},
	paymentMethod: { type: String, enum: ["COD", "Online Paid"], default: "COD" },
	paymentOption: { type: String, default: null }, // bkash, nagad, stripe, etc.
	transactionId: { type: String, default: null },
	status: { type: String, default: "Order Placed" },
	date: { type: Number, required: true },
	cancelAt: { type: Date, default: null },
});

orderSchema.index({ cancelAt: 1 }, { expireAfterSeconds: 0 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
