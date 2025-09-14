// models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
	title: { type: String, required: true },
	link: { type: String, default: "/all-products" },
	imgUrl: { type: String, required: true },
	position: { type: Number, default: 0 }, // position/order of the banner
});

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
