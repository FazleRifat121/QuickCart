import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.String, required: true, ref: "User" }, // keep String if your User _id is string
	items: [
		{
			product: {
				type: String,
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
	status: { type: String, default: "Order Placed" },
	date: { type: Number, required: true },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
