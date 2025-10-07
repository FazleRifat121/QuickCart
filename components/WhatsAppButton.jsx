"use client";

import { useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";

export default function WhatsAppButton() {
	const [mounted, setMounted] = useState(false);
	const [show, setShow] = useState(false);

	useEffect(() => {
		setMounted(true); // mark as mounted
		const timer = setTimeout(() => setShow(true), 3000); // delay
		return () => clearTimeout(timer);
	}, []);

	if (!mounted) return null; // prevent SSR mismatch

	return (
		<span
			className={`fixed top-48 ${
				show ? "right-0" : "-right-[200px]"
			} bg-orange-600 hover:pr-8 text-white p-2 text-2xl cursor-pointer transition-all duration-300 rounded-l-md z-50`}
		>
			<Link
				href="https://wa.me/8801123456789"
				target="_blank"
				rel="noopener noreferrer"
			>
				<IoLogoWhatsapp className="text-3xl ml-1" />
			</Link>
		</span>
	);
}
