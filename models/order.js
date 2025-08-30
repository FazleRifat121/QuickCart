import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.String, required: true, ref: "User" },
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

	// ✅ Add cancelAt field for TTL (auto-delete)
	cancelAt: { type: Date, default: null },
});

// ✅ TTL index: removes documents automatically when cancelAt is reached
orderSchema.index({ cancelAt: 1 }, { expireAfterSeconds: 0 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
