"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const word = "QUICKCART".split(""); // split into letters

const letterAnimation = {
	hidden: { opacity: 0, y: 50 },
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
	}),
};

const IntroAnimation = ({ onFinish }) => {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
			if (onFinish) onFinish();
		}, 3000); // total duration
		return () => clearTimeout(timer);
	}, [onFinish]);

	if (!show) return null;

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black"
			initial={{ y: 0 }}
			animate={{ y: "-100%" }}
			transition={{ duration: 1.2, ease: "easeInOut", delay: 2 }}
		>
			<div className="flex text-5xl md:text-9xl font-extrabold tracking-widest">
				{word.map((letter, i) => (
					<motion.span
						key={i}
						custom={i}
						variants={letterAnimation}
						initial="hidden"
						animate="visible"
						className={`inline-block ${
							i === 0 ? "text-orange-500" : "text-white"
						}`} // Q is orange
					>
						{letter}
					</motion.span>
				))}
			</div>
		</motion.div>
	);
};

export default IntroAnimation;
