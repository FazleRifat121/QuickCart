"use client";

import { useState } from "react";
import {
	CardElement,
	useElements,
	useStripe,
	Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = ({ amount, onSuccess }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setLoading(true);

		try {
			// create PaymentIntent
			const { data } = await axios.post("/api/payment/stripe-intent", {
				amount: Number(amount),
			});
			const clientSecret = data.clientSecret;

			// confirm payment
			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: { card: elements.getElement(CardElement) },
			});

			if (result.error) {
				alert("Payment failed: " + result.error.message);
			} else if (result.paymentIntent.status === "succeeded") {
				onSuccess(result.paymentIntent.id); // pass Stripe transactionId
			}
		} catch (err) {
			alert("Error: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
			<CardElement className="p-2 border" />
			<button
				type="submit"
				disabled={!stripe || loading}
				className="bg-green-500 text-white px-4 py-2 rounded"
			>
				{loading ? "Processing..." : `Pay $${amount}`}
			</button>
		</form>
	);
};

const StripePayment = ({ amount, onSuccess }) => (
	<Elements stripe={stripePromise}>
		<CheckoutForm amount={amount} onSuccess={onSuccess} />
	</Elements>
);

export default StripePayment;
