import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	userId: { type: String, required: true, ref: "User" },
	name: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: String, required: true },
	price: { type: Number },
	offerPrice: { type: Number, required: true },
	image: { type: Array, required: true },
	video: { type: String }, // ✅ new optional video field
	brand: { type: String }, // optional
	color: { type: String }, // optional
	date: { type: Number, required: true },
});

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
