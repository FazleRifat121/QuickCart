"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";

const SellerOrders = () => {
	const { getToken, currency, isSeller } = useAppContext();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch orders for seller
	const fetchSellerOrders = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get("/api/order/seller-orders", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) setOrders(data.orders);
			else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	// Update order status
	const handleStatusUpdate = async (orderId, newStatus) => {
		try {
			const token = await getToken();
			const { data } = await axios.put(
				"/api/order/update-status",
				{ orderId, status: newStatus },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success(`Order marked as ${newStatus}`);
				setOrders((prev) =>
					prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
				);
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	// Cancel order (buyer or seller)
	const cancelOrder = async (orderId) => {
		const reason = prompt("Enter cancellation reason:");
		if (!reason) return;

		try {
			const token = await getToken();
			const { data } = await axios.post(
				"/api/order/cancel",
				{ orderId, reason },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success("Order canceled successfully");
				setOrders((prev) =>
					prev.map((o) =>
						o._id === orderId ? { ...o, status: "Canceled" } : o
					)
				);
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	useEffect(() => {
		if (isSeller) fetchSellerOrders();
	}, [isSeller]);

	// Filter orders by search term
	const filteredOrders = orders.filter((order) => {
		const search = searchTerm.toLowerCase();
		const productMatch = order.items.some((item) =>
			item.product.name.toLowerCase().includes(search)
		);
		const emailMatch = order.userEmail?.toLowerCase().includes(search);
		const nameMatch = order.address.fullName.toLowerCase().includes(search);
		const phoneMatch = order.address.phoneNumber.toLowerCase().includes(search);
		const statusMatch = order.status.toLowerCase().includes(search);
		const methodMatch = order.paymentMethod?.toLowerCase().includes(search);
		const transactionMatch = order.transactionId
			?.toLowerCase()
			.includes(search);
		const dateMatch = new Date(order.date)
			.toLocaleDateString()
			.toLowerCase()
			.includes(search);

		return (
			productMatch ||
			emailMatch ||
			nameMatch ||
			phoneMatch ||
			statusMatch ||
			methodMatch ||
			transactionMatch ||
			dateMatch
		);
	});

	return (
		<div className="min-h-screen flex flex-col justify-between">
			<div className="p-6 md:p-10 space-y-4">
				<h2 className="text-xl font-bold">Seller Orders</h2>

				<input
					type="text"
					placeholder="Search by product, email, name, phone, status, date..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-md p-2 border rounded-md mb-4"
				/>

				{loading ? (
					<p>Loading orders...</p>
				) : filteredOrders.length === 0 ? (
					<p>No matching orders found.</p>
				) : (
					filteredOrders.map((order) => (
						<div
							key={order._id}
							className={`flex flex-col md:flex-row gap-5 p-5 border-t border-gray-300
                ${order.status === "Canceled" ? "bg-red-50" : ""}
                ${order.status === "Delivered" ? "bg-green-100" : ""}`}
						>
							{/* Products */}
							<div className="flex-1 flex gap-5 max-w-80">
								<Image src={assets.box_icon} alt="box" width={50} height={50} />
								<p className="flex flex-col gap-2">
									<span className="font-medium">
										{order.items.map((item, idx) => (
											<Link
												key={idx}
												href={`/product/${item.product._id}`}
												className="text-blue-600 hover:underline mr-2"
											>
												{item.product.name} x {item.quantity}
											</Link>
										))}
									</span>
									<span>Items: {order.items.length}</span>
								</p>
							</div>

							{/* Buyer Info */}
							<div>
								<p>
									<span className="font-medium">{order.address.fullName}</span>
									<br />
									<span>{order.userEmail}</span>
									<br />
									<span>{order.address.area}</span>
									<br />
									<span>{`${order.address.city}, ${order.address.state}`}</span>
									<br />
									<span>{order.address.phoneNumber}</span>
								</p>
							</div>

							{/* Amount */}
							<p className="font-medium my-auto">
								{currency}
								{order.amount}
							</p>

							{/* Actions */}
							<div className="flex flex-col justify-between w-48">
								<p className="flex flex-col">
									<span>
										Method: {order.paymentMethod?.toUpperCase() || "N/A"}
									</span>
									{order.transactionId && (
										<span className="break-all">
											Transaction ID: {order.transactionId}
										</span>
									)}
									<span>Date: {new Date(order.date).toLocaleDateString()}</span>
									<span>Status: {order.status}</span>
								</p>

								<div className="flex flex-wrap gap-2 mt-2">
									{order.status !== "Delivered" &&
										order.status !== "Canceled" && (
											<>
												<button
													onClick={() =>
														handleStatusUpdate(order._id, "Delivered")
													}
													className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
												>
													Mark as Delivered
												</button>
												<button
													onClick={() => cancelOrder(order._id)}
													className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
												>
													Cancel Order
												</button>
											</>
										)}
									{order.status === "Delivered" && (
										<button
											onClick={() => handleStatusUpdate(order._id, "Pending")}
											className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
										>
											Undo Delivery
										</button>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			<Footer />
		</div>
	);
};

export default SellerOrders;
