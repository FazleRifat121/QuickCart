"use client";

import { useState } from "react";

const NewsLetter = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubscribe = async (e) => {
		e.preventDefault();

		if (!email) {
			setMessage("Email is required");
			return;
		}

		try {
			const res = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			setMessage(data.message || "Something went wrong");
			if (res.ok) setEmail("");
		} catch (err) {
			console.error(err);
			setMessage("Something went wrong, please try again");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
			<h1 className="md:text-4xl text-2xl font-medium">
				Subscribe now & get 20% off
			</h1>
			<p className="md:text-base text-gray-500/80 pb-8">
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry.
			</p>
			<form
				className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12"
				onSubmit={handleSubscribe}
			>
				<input
					className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
					type="email"
					placeholder="Enter your email id"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none"
				>
					Subscribe
				</button>
			</form>
			{message && (
				<p className="text-center mt-2 text-sm text-gray-700">{message}</p>
			)}
		</div>
	);
};

export default NewsLetter;
