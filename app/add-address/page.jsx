"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

// Dynamic import for client-only map
const AddressMap = dynamic(() => import("./AddressMap"), { ssr: false });

const AddAddress = () => {
	const { getToken, router } = useAppContext();
	const [address, setAddress] = useState({
		fullName: "",
		phoneNumber: "",
		pincode: "",
		area: "",
		city: "",
		state: "",
		latitude: null,
		longitude: null,
	});

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			const token = await getToken();
			const { data } = await axios.post(
				"/api/user/add-address",
				{ address },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (data.success) {
				toast.success(data.message);
				router.push("/cart");
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<>
			<Navbar />
			<div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between gap-10">
				{/* Address Form */}
				<form onSubmit={onSubmitHandler} className="w-full md:w-1/2">
					<p className="text-2xl md:text-3xl text-gray-500">
						Add Shipping{" "}
						<span className="font-semibold text-orange-600">Address</span>
					</p>
					<div className="space-y-3 max-w-sm mt-10">
						<input
							type="text"
							placeholder="Full name"
							value={address.fullName}
							onChange={(e) =>
								setAddress({ ...address, fullName: e.target.value })
							}
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
						/>
						<input
							type="text"
							placeholder="Phone number"
							value={address.phoneNumber}
							onChange={(e) =>
								setAddress({ ...address, phoneNumber: e.target.value })
							}
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
						/>
						<input
							type="text"
							placeholder="Pin code"
							value={address.pincode}
							onChange={(e) =>
								setAddress({ ...address, pincode: e.target.value })
							}
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
						/>
						<textarea
							placeholder="Address (Area and Street)"
							value={address.area}
							onChange={(e) => setAddress({ ...address, area: e.target.value })}
							rows={4}
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500 resize-none"
						/>
						<div className="flex space-x-3">
							<input
								type="text"
								placeholder="City/District/Town"
								value={address.city}
								onChange={(e) =>
									setAddress({ ...address, city: e.target.value })
								}
								className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
							/>
							<input
								type="text"
								placeholder="State"
								value={address.state}
								onChange={(e) =>
									setAddress({ ...address, state: e.target.value })
								}
								className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
							/>
						</div>
					</div>

					{address.latitude && address.longitude && (
						<p className="mt-4 text-sm text-gray-600">
							📍 Selected Location: {address.latitude}, {address.longitude}
						</p>
					)}

					<button
						type="submit"
						className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
					>
						Save address
					</button>
				</form>

				{/* Map */}
				<AddressMap address={address} setAddress={setAddress} />
			</div>
			<Footer />
		</>
	);
};

export default AddAddress;
