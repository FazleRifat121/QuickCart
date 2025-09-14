import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	userId: { type: String, required: true, ref: "User" },
	name: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: String, required: true },
	price: { type: Number },
	offerPrice: { type: Number, required: true },
	image: { type: [String], required: true }, // ✅ array of strings
	video: { type: String },
	brand: { type: String },
	color: { type: String },
	sizes: { type: [String], default: [] }, // ✅ array of strings
	orders: { type: Number, default: 0 },
	date: { type: Number, required: true },
});

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
