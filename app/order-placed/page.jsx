"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderPlaced() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/my-orders"); // redirect after 5 sec
		}, 5000);
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-white px-4">
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1.2, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 20 }}
				className="flex flex-col justify-center items-center gap-6"
			>
				<div className="text-5xl md:text-6xl lg:text-7xl animate-bounce">
					✅
				</div>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="text-2xl md:text-3xl lg:text-4xl font-semibold text-green-600 text-center"
				>
					Order Placed Successfully
				</motion.div>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="text-gray-600 text-center md:text-lg lg:text-xl"
				>
					Redirecting to My Orders...
				</motion.p>
			</motion.div>

			{/* Confetti effect */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
				{[...Array(50)].map((_, i) => (
					<motion.div
						key={i}
						initial={{ y: -50, x: Math.random() * 1000, rotate: 0 }}
						animate={{ y: 800, rotate: 360 }}
						transition={{
							duration: 2 + Math.random() * 2,
							repeat: Infinity,
							repeatType: "loop",
							ease: "linear",
							delay: Math.random() * 2,
						}}
						className="absolute w-2 h-2 bg-yellow-400 rounded-full"
					/>
				))}
			</div>
		</div>
	);
}
