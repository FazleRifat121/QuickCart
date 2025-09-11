"use client";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePayment from "./StripePayment";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const OrderSummary = () => {
	const {
		currency,
		router,
		getCartCount,
		getCartAmount,
		getToken,
		cartItems,
		user,
		setCartItems,
	} = useAppContext();

	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [userAddresses, setUserAddresses] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState("cod");
	const [onlineOption, setOnlineOption] = useState("");
	const [promoCode, setPromoCode] = useState("");
	const [discount, setDiscount] = useState(0);

	const subtotal = getCartAmount();
	const tax = Math.floor((subtotal - discount) * 0.02);
	const total = subtotal - discount + tax;

	useEffect(() => {
		if (user) fetchUserAddresses();
	}, [user]);

	const fetchUserAddresses = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get("/api/user/get-address", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) {
				setUserAddresses(data.addresses);
				if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// ✅ Promo code logic
	const applyPromo = async () => {
		if (!promoCode) {
			setDiscount(0);
			toast.error("Enter promo code");
			return;
		}

		try {
			const { data } = await axios.post("/api/promo/apply", {
				code: promoCode,
			});
			if (data.success) {
				const discountAmount = Math.floor(
					(subtotal * data.discountPercent) / 100
				);
				setDiscount(discountAmount);
				toast.success(`Promo applied! You saved ${currency}${discountAmount}`);
			} else {
				setDiscount(0);
				toast.error(data.message);
			}
		} catch (err) {
			setDiscount(0);
			toast.error(err.message);
		}
	};

	const handleRemoveAddress = async (e, addressId) => {
		e.stopPropagation();
		try {
			const token = await getToken();
			const { data } = await axios.delete("/api/user/remove-address", {
				headers: { Authorization: `Bearer ${token}` },
				data: { addressId },
			});
			if (data.success) {
				toast.success(data.message);
				setUserAddresses((prev) => prev.filter((a) => a._id !== addressId));
				if (selectedAddress?._id === addressId) setSelectedAddress(null);
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	const createOrder = async (transactionId = null) => {
		if (!selectedAddress) return toast.error("Select address");

		const cartItemsArray = Object.keys(cartItems)
			.map((key) => ({ product: key, quantity: cartItems[key] }))
			.filter((item) => item.quantity > 0);

		if (cartItemsArray.length === 0) return toast.error("Cart empty");

		try {
			const token = await getToken();
			const payload = {
				address: selectedAddress._id,
				items: cartItemsArray,
				paymentMethod,
				paymentOption: paymentMethod === "cod" ? null : onlineOption,
				transactionId: paymentMethod === "cod" ? null : transactionId || null,
				discount,
			};

			const { data } = await axios.post("/api/order/create", payload, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setCartItems({});
				router.push("/order-placed");
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className="w-full md:w-96 bg-gray-50 p-4 md:p-5 rounded-lg shadow-sm">
			<h2 className="text-xl md:text-2xl font-medium text-gray-700">
				Order Summary
			</h2>
			<hr className="border-gray-300 my-5" />

			<div className="space-y-6">
				{/* Address Selection */}
				<div>
					<label className="text-base font-medium uppercase text-gray-600 block mb-2">
						Select Address
					</label>
					<div className="relative w-full text-sm border rounded-md">
						<button
							className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 flex justify-between items-center"
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<span>
								{selectedAddress
									? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
									: "Select Address"}
							</span>
							<svg
								className={`w-5 h-5 transition-transform duration-200 ${
									isDropdownOpen ? "rotate-180" : "rotate-0"
								}`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="#6B7280"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
						{isDropdownOpen && (
							<ul className="absolute w-full max-h-60 overflow-y-auto bg-white border shadow-md mt-1 z-10 py-1.5 rounded-md">
								{userAddresses.map((address) => (
									<li
										key={address._id}
										className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
										onClick={() => {
											setSelectedAddress(address);
											setIsDropdownOpen(false);
										}}
									>
										<span className="text-sm">
											{address.fullName}, {address.area}, {address.city}
										</span>
										<button
											className="text-red-500 hover:text-red-700 ml-2 text-sm"
											onClick={(e) => handleRemoveAddress(e, address._id)}
										>
											Remove
										</button>
									</li>
								))}
								<li
									onClick={() => router.push("/add-address")}
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center text-sm"
								>
									+ Add New Address
								</li>
							</ul>
						)}
					</div>
				</div>

				{/* Payment Method */}
				<div>
					<label className="text-base font-medium uppercase text-gray-600 block mb-2">
						Payment Method
					</label>
					<div className="flex flex-col gap-3">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="payment"
								value="cod"
								checked={paymentMethod === "cod"}
								onChange={() => setPaymentMethod("cod")}
							/>
							Cash on Delivery
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="payment"
								value="online"
								checked={paymentMethod === "online"}
								onChange={() => setPaymentMethod("online")}
							/>
							Online Payment
						</label>
					</div>

					{paymentMethod === "online" && (
						<div className="mt-2 ml-4 flex flex-col gap-2 text-gray-700 text-sm">
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="onlineOption"
									value="stripe"
									checked={onlineOption === "stripe"}
									onChange={() => setOnlineOption("stripe")}
								/>
								Visa / MasterCard
							</label>

							{onlineOption === "stripe" && (
								<Elements stripe={stripePromise}>
									<StripePayment
										amount={total}
										onSuccess={(transactionId) => createOrder(transactionId)}
									/>
								</Elements>
							)}
						</div>
					)}
				</div>

				{/* Promo Code */}
				<div>
					<label className="text-base font-medium uppercase text-gray-600 block mb-2">
						Promo Code
					</label>
					<div className="flex flex-col gap-3">
						<input
							type="text"
							placeholder="Enter promo code"
							value={promoCode}
							onChange={(e) => setPromoCode(e.target.value)}
							className="flex-grow w-full outline-none p-2.5 text-gray-600 border rounded-md text-sm md:text-base"
						/>
						<button
							onClick={applyPromo}
							className="bg-orange-600 text-white px-6 py-2 hover:bg-orange-700 rounded-md"
						>
							Apply
						</button>
					</div>
				</div>

				<hr className="border-gray-300 my-5" />

				{/* Order Totals */}
				<div className="space-y-4">
					<div className="flex justify-between text-base font-medium">
						<p className="uppercase text-gray-600">Items {getCartCount()}</p>
						<p className="text-gray-800">
							{currency}
							{subtotal}
						</p>
					</div>
					<div className="flex justify-between">
						<p className="text-gray-600">Discount</p>
						<p className="font-medium text-green-600">
							-{currency}
							{discount}
						</p>
					</div>
					<div className="flex justify-between">
						<p className="text-gray-600">Tax (2%)</p>
						<p className="font-medium text-gray-800">
							{currency}
							{tax}
						</p>
					</div>
					<div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
						<p>Total</p>
						<p>
							{currency}
							{total}
						</p>
					</div>
				</div>
			</div>

			{/* Place order */}
			{paymentMethod !== "online" && (
				<button
					onClick={() => createOrder()}
					className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 rounded-md"
				>
					Place Order
				</button>
			)}
		</div>
	);
};

export default OrderSummary;
