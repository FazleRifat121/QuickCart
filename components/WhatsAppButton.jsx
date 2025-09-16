"use client";
import { useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";

export default function WhatsAppButton() {
	const [mounted, setMounted] = useState(false);
	const [show, setShow] = useState(false);

	// Only run on client
	useEffect(() => {
		setMounted(true); // mark as mounted
		const timer = setTimeout(() => setShow(true), 3000);
		return () => clearTimeout(timer);
	}, []);

	if (!mounted) return null; // render nothing on server

	return (
		<span
			className={`fixed top-48 ${
				show ? "right-0" : "-right-[200px]"
			} bg-orange-700 text-white rounded-s-full p-2 w-[60px] text-2xl cursor-pointer transition-all duration-300 z-50`}
		>
			<Link
				href="https://wa.me/8801327184165"
				target="_blank"
				rel="noopener noreferrer"
			>
				<IoLogoWhatsapp className="text-3xl ml-3" />
			</Link>
		</span>
	);
}
