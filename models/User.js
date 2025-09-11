import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	_id: { type: String, required: true }, // Clerk user ID
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	imageUrl: { type: String, required: true },
	cartItems: { type: Object, default: {} },
	role: { type: String, enum: ["normal", "seller"], default: "normal" }, // allow both roles
	wishlist: { type: Array, default: [] },
	banned: { type: Boolean, default: false }, // NEW field
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
