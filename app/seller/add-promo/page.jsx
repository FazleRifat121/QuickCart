"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddPromoPage = () => {
	const [code, setCode] = useState("");
	const [discount, setDiscount] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!code || !discount) return toast.error("All fields are required");

		try {
			const { data } = await axios.post("/api/promo", {
				code,
				discountPercent: Number(discount),
			});
			if (data.success) {
				toast.success("Promo code added successfully!");
				setCode("");
				setDiscount("");
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className="  p-5  shadow-md">
			<h2 className="text-xl font-medium mb-4">Add New Promo Code</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="Promo Code"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					className="border p-2 rounded-md"
					required
				/>
				<input
					type="number"
					placeholder="Discount %"
					value={discount}
					onChange={(e) => setDiscount(e.target.value)}
					className="border p-2 rounded-md"
					required
				/>
				<button
					type="submit"
					className="bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
				>
					Add Promo
				</button>
			</form>
		</div>
	);
};

export default AddPromoPage;
