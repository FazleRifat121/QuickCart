import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
	code: { type: String, required: true, unique: true },
	discountPercent: { type: Number, required: true },
	expiresAt: { type: Date, default: null }, // optional
});

const Promo = mongoose.models.Promo || mongoose.model("Promo", promoSchema);
export default Promo;
