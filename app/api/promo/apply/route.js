import Promo from "@/models/promo"; // your Promo model
import connectDB from "@/config/db";

export async function POST(req) {
	await connectDB();

	try {
		const { code } = await req.json();

		if (!code) {
			return new Response(
				JSON.stringify({ success: false, message: "Promo code required" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const promo = await Promo.findOne({ code: code.toUpperCase() }); // store codes uppercase

		if (!promo) {
			return new Response(
				JSON.stringify({ success: false, message: "Invalid promo code" }),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new Response(
			JSON.stringify({ success: true, discountPercent: promo.discountPercent }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (err) {
		console.error("Promo apply error:", err);
		return new Response(
			JSON.stringify({ success: false, message: "Server error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
