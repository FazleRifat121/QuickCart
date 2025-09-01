"use client";

import StripePayment from "@/components/StripePayment";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
	const router = useRouter();
	const totalAmount = 50; // 👉 replace with cart total later

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="max-w-md w-full p-6 bg-white rounded shadow">
				<h1 className="text-xl font-bold mb-4">Checkout</h1>
				<StripePayment
					amount={totalAmount}
					onSuccess={() => router.push("/order-placed")}
				/>
			</div>
		</div>
	);
}
