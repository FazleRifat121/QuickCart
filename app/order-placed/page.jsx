"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderPlaced() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/my-orders"); // redirect after 5 sec
		}, 5000);
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="h-screen flex flex-col justify-center items-center gap-5">
			<div className="text-3xl font-semibold text-green-600">
				✅ Order Placed Successfully
			</div>
			<p className="text-gray-600">Redirecting to My Orders...</p>
		</div>
	);
}
