"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import react-leaflet map with ssr: false
const MapContainer = dynamic(
	() => import("react-leaflet").then((mod) => mod.MapContainer),
	{ ssr: false }
);
const TileLayer = dynamic(
	() => import("react-leaflet").then((mod) => mod.TileLayer),
	{ ssr: false }
);
const Marker = dynamic(
	() => import("react-leaflet").then((mod) => mod.Marker),
	{ ssr: false }
);
const useMapEvents = dynamic(
	() => import("react-leaflet").then((mod) => mod.useMapEvents),
	{ ssr: false }
);

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet marker icon
const markerIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	shadowSize: [41, 41],
});

const AddAddress = () => {
	const { getToken, router } = useAppContext();
	const mapRef = useRef(null);

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

	// Marker click event
	const LocationMarker = () => {
		useMapEvents({
			click(e) {
				setAddress((prev) => ({
					...prev,
					latitude: e.latlng.lat,
					longitude: e.latlng.lng,
				}));
			},
		});

		return address.latitude && address.longitude ? (
			<Marker
				position={[address.latitude, address.longitude]}
				icon={markerIcon}
			/>
		) : null;
	};

	// Locate me
	const handleLocateMe = () => {
		if (!navigator.geolocation) {
			toast.error("Geolocation is not supported by your browser");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setAddress((prev) => ({ ...prev, latitude, longitude }));
				if (mapRef.current) {
					mapRef.current.setView([latitude, longitude], 15);
				}
			},
			() => toast.error("Unable to retrieve your location")
		);
	};

	// Submit form
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
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
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
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
							type="text"
							placeholder="Full name"
							onChange={(e) =>
								setAddress({ ...address, fullName: e.target.value })
							}
							value={address.fullName}
						/>
						<input
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
							type="text"
							placeholder="Phone number"
							onChange={(e) =>
								setAddress({ ...address, phoneNumber: e.target.value })
							}
							value={address.phoneNumber}
						/>
						<input
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
							type="text"
							placeholder="Pin code"
							onChange={(e) =>
								setAddress({ ...address, pincode: e.target.value })
							}
							value={address.pincode}
						/>
						<textarea
							className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500 resize-none"
							rows={4}
							placeholder="Address (Area and Street)"
							onChange={(e) => setAddress({ ...address, area: e.target.value })}
							value={address.area}
						></textarea>
						<div className="flex space-x-3">
							<input
								className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
								type="text"
								placeholder="City/District/Town"
								onChange={(e) =>
									setAddress({ ...address, city: e.target.value })
								}
								value={address.city}
							/>
							<input
								className="px-2 py-2.5 border border-gray-500/30 rounded w-full text-gray-500 focus:border-orange-500"
								type="text"
								placeholder="State"
								onChange={(e) =>
									setAddress({ ...address, state: e.target.value })
								}
								value={address.state}
							/>
						</div>
					</div>

					{/* Selected Lat/Lng */}
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
				<div className="w-full md:w-1/2 h-[450px] md:h-[500px] relative">
					<button
						onClick={handleLocateMe}
						className="absolute top-3 right-3 z-[1000] bg-white shadow-md px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
					>
						📍 Locate Me
					</button>

					<MapContainer
						center={[23.8103, 90.4125]} // Dhaka default
						zoom={13}
						scrollWheelZoom={true}
						className="h-full w-full rounded-lg shadow-md"
						whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<LocationMarker />
					</MapContainer>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default AddAddress;
