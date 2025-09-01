import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
	try {
		const { amount } = await req.json();

		// amount should be in cents for Stripe
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100,
			currency: "usd",
			payment_method_types: ["card"],
		});

		return new Response(
			JSON.stringify({ clientSecret: paymentIntent.client_secret }),
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
		});
	}
}
