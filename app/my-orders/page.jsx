"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
	const { orders, currency, getToken, setOrders } = useAppContext();

	const handleCancelOrder = async (orderId) => {
		if (!confirm("Are you sure you want to cancel this order?")) return;

		try {
			const token = await getToken();
			const { data } = await axios.post(
				"/api/order/cancel",
				{ orderId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success("Order canceled successfully");
				setOrders((prev) =>
					prev.map((o) =>
						o._id === orderId ? { ...o, status: "Canceled" } : o
					)
				);
			} else {
				toast.error(data.message || "Failed to cancel order");
			}
		} catch (err) {
			toast.error(err.message || "Something went wrong");
		}
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen px-6 md:px-16 py-6">
				<h2 className="text-lg font-medium mb-4">My Orders</h2>

				{orders.length === 0 ? (
					<p>No orders yet.</p>
				) : (
					orders.map((order) => {
						const orderDate = order.date
							? new Date(order.date).toLocaleDateString()
							: new Date().toLocaleDateString();

						return (
							<div
								key={order._id}
								className="flex flex-col md:flex-row gap-4 border p-4 mb-4"
							>
								<Image src={assets.box_icon} alt="box" width={50} height={50} />
								<div className="flex-1">
									<p>Items: {order.items.length}</p>
									<p>
										Amount: {currency}
										{order.amount}
									</p>
									<p>Status: {order.status}</p>

									{/* Method and Transaction ID */}
									<p>
										Method:{" "}
										{order.paymentMethod && order.paymentMethod.toUpperCase()}
									</p>
									{order.transactionId && (
										<p className="break-all">
											Transaction ID: {order.transactionId}
										</p>
									)}

									<p>Date: {orderDate}</p>

									<div className="mt-2">
										{order.items.map((item, idx) => (
											<p key={idx} className="text-sm">
												<Link
													href={`/product/${
														item.productId || item.product?._id
													}`}
													className="text-blue-600 hover:underline"
												>
													{item.name || item.product?.name || "Product"} x{" "}
													{item.quantity}
												</Link>
											</p>
										))}
									</div>

									{order.status !== "Canceled" &&
										order.status !== "Delivered" && (
											<button
												onClick={() => handleCancelOrder(order._id)}
												className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
											>
												Cancel Order
											</button>
										)}
								</div>
							</div>
						);
					})
				)}
			</div>
			<Footer />
		</>
	);
};

export default MyOrders;
