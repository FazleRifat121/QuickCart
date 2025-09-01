"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const Orders = () => {
	const { currency, user, getToken } = useAppContext();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchSellerOrders = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get("/api/order/seller-orders", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) {
				setOrders(data.orders);
				setLoading(false);
			} else toast.error(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const updateOrderStatus = async (orderId, status) => {
		try {
			const token = await getToken();
			const { data } = await axios.put(
				"/api/order/update-status",
				{ orderId, status },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (data.success) {
				toast.success("Order status updated!");
				fetchSellerOrders();
			} else toast.error(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (user) fetchSellerOrders();
	}, [user]);

	// Filtered orders based on search
	const filteredOrders = orders.filter((order) => {
		const search = searchTerm.toLowerCase();

		const productMatch = order.items.some((item) =>
			item.product.name.toLowerCase().includes(search)
		);

		const nameMatch = order.address.fullName.toLowerCase().includes(search);

		const phoneMatch = order.address.phoneNumber.toLowerCase().includes(search);

		const statusMatch = order.status.toLowerCase().includes(search);

		const methodMatch = order.paymentMethod
			? order.paymentMethod.toLowerCase().includes(search)
			: false;

		const transactionMatch = order.transactionId
			? order.transactionId.toLowerCase().includes(search)
			: false;

		const dateMatch = new Date(order.date)
			.toLocaleDateString()
			.toLowerCase()
			.includes(search);

		return (
			productMatch ||
			nameMatch ||
			phoneMatch ||
			statusMatch ||
			methodMatch ||
			transactionMatch ||
			dateMatch
		);
	});

	return (
		<div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
			{loading ? (
				<Loading />
			) : (
				<div className="md:p-10 p-4 space-y-5">
					<h2 className="text-lg font-medium">Orders</h2>

					{/* Search Box */}
					<input
						type="text"
						placeholder="Search by product, name, phone, status, date, method or transaction ID..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full max-w-md p-2 border rounded-md mb-4"
					/>

					<div className="max-w-4xl rounded-md">
						{filteredOrders.length > 0 ? (
							filteredOrders.map((order, index) => (
								<div
									key={index}
									className={`flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 
                  ${order.status === "Canceled" ? "bg-red-50" : ""}
                  ${order.status === "Delivered" ? "bg-green-100" : ""}`}
								>
									{/* Product Info */}
									<div className="flex-1 flex gap-5 max-w-80">
										<Image
											className="max-w-16 max-h-16 object-cover"
											src={assets.box_icon}
											alt="box_icon"
										/>
										<p className="flex flex-col gap-3">
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
											<span>Items : {order.items.length}</span>
										</p>
									</div>

									{/* Address */}
									<div>
										<p>
											<span className="font-medium">
												{order.address.fullName}
											</span>
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

									{/* Status + Payment */}
									<div className="flex flex-col justify-between w-48">
										<p className="flex flex-col">
											<span>
												Method:{" "}
												{order.paymentMethod
													? order.paymentMethod.toUpperCase()
													: "N/A"}
											</span>
											{order.transactionId && (
												<span className="break-all">
													Transaction ID: {order.transactionId}
												</span>
											)}
											<span>
												Date: {new Date(order.date).toLocaleDateString()}
											</span>
											<span>Status: {order.status}</span>
											{order.deliveredAt && (
												<span>
													Delivered On:{" "}
													{new Date(order.deliveredAt).toLocaleDateString()}
												</span>
											)}
										</p>
										{order.status !== "Canceled" && (
											<div>
												{order.status !== "Delivered" ? (
													<button
														onClick={() =>
															updateOrderStatus(order._id, "Delivered")
														}
														className="mt-2 px-3 py-1 text-white bg-green-600 rounded-md hover:bg-green-700"
													>
														Mark as Done
													</button>
												) : (
													<button
														onClick={() =>
															updateOrderStatus(order._id, "Order Placed")
														}
														className="mt-2 px-3 py-1 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
													>
														Undo Done
													</button>
												)}
											</div>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500">No matching orders found.</p>
						)}
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default Orders;
