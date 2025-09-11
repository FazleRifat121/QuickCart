"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PromoListPage = () => {
	const [promos, setPromos] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchPromos = async () => {
		try {
			const { data } = await axios.get("/api/promo");
			if (data.success) setPromos(data.promos);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this promo?")) return;
		try {
			const { data } = await axios.delete(`/api/promo/${id}`);
			if (data.success) {
				toast.success(data.message);
				setPromos((prev) => prev.filter((p) => p._id !== id));
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	useEffect(() => {
		fetchPromos();
	}, []);

	if (loading) return <p className="text-center mt-10">Loading promos...</p>;

	return (
		<div className="p-5">
			<h2 className="text-xl font-medium mb-4">Promo Codes</h2>
			{promos.length === 0 ? (
				<p>No promo codes found.</p>
			) : (
				<table className="w-full border-collapse text-left">
					<thead className="hidden sm:table-header-group">
						<tr className="bg-gray-100">
							<th className="border-b p-2">Code</th>
							<th className="border-b p-2">Discount %</th>
							<th className="border-b p-2">Created At</th>
							<th className="border-b p-2">Actions</th>
						</tr>
					</thead>
					<tbody className="flex flex-col sm:table-row-group">
						{promos.map((promo) => (
							<tr
								key={promo._id}
								className="border-b border-gray-200 sm:border-none flex flex-col sm:table-row mb-4 sm:mb-0"
							>
								<td className="p-2 sm:px-4 sm:py-2">
									<span className="font-semibold sm:hidden">Code: </span>
									{promo.code}
								</td>
								<td className="p-2 sm:px-4 sm:py-2">
									<span className="font-semibold sm:hidden">Discount: </span>
									{promo.discountPercent}%
								</td>
								<td className="p-2 sm:px-4 sm:py-2">
									<span className="font-semibold sm:hidden">Created At: </span>
									{new Date(promo.createdAt).toLocaleDateString()}
								</td>
								<td className="p-2 sm:px-4 sm:py-2">
									<button
										onClick={() => handleDelete(promo._id)}
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default PromoListPage;
