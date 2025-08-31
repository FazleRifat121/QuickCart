import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, unique: true },
		items: { type: [String], default: [] }, // store product _id's
	},
	{ timestamps: true }
);

const Wishlist =
	mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
