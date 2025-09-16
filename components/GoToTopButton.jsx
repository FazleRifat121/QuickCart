"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function GoToTopButton() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const handleScroll = () => setShow(window.scrollY > 300);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (!show) return null;

	return (
		<button
			onClick={scrollToTop}
			className="fixed bottom-6 right-3 md:right-12 p-3 bg-white text-gray-700 border rounded-full shadow-lg hover:bg-gray-300 hover:text-white transition transform animate-bounce z-50"
			aria-label="Go to top"
		>
			<FaArrowUp size={20} />
		</button>
	);
}
