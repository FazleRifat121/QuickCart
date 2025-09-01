"use client";
import React, { useState, useEffect } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import { MdDashboard } from "react-icons/md";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
	const { isSeller, user, wishlist, cartItems, orders } = useAppContext();
	const router = useRouter();
	const { openSignIn } = useClerk();

	const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
	const cartCount = cartItems
		? Object.values(cartItems).reduce((sum, q) => sum + q, 0)
		: 0;

	// Use context orders for reactive count
	const [orderCount, setOrderCount] = useState(orders ? orders.length : 0);

	useEffect(() => {
		setOrderCount(orders ? orders.length : 0);
	}, [orders]);

	const [mounted, setMounted] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const handleSearchChange = async (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		if (!query) return setSearchResults([]);
		try {
			const { data } = await axios.get(
				`/api/product/search?query=${encodeURIComponent(query)}`
			);
			if (data.success) setSearchResults(data.products);
			else setSearchResults([]);
		} catch (err) {
			toast.error(err.message || "Search failed");
		}
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		router.push(`/all-products?search=${encodeURIComponent(searchQuery)}`);
		setSearchQuery("");
		setSearchResults([]);
		setShowMobileMenu(false);
	};

	return (
		<nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
			{/* Logo */}
			<div className="flex items-center justify-between w-full md:w-auto">
				<Image
					src={assets.logo}
					alt="logo"
					className="cursor-pointer w-28 md:w-32"
					onClick={() => router.push("/")}
				/>

				{/* Mobile buttons */}
				<div className="md:hidden flex items-center gap-3">
					<button onClick={() => setShowMobileMenu(true)}>
						<Image src={assets.search_icon} alt="menu" className="w-5 h-5" />
					</button>
					{user ? (
						<UserButton>
							<UserButton.MenuItems>
								<UserButton.Action
									label={`Cart (${cartCount})`}
									labelIcon={<CartIcon className="w-5 h-5" />}
									onClick={() => router.push("/cart")}
								/>
								<UserButton.Action
									label={`Orders (${orderCount})`}
									labelIcon={<BagIcon className="w-5 h-5" />}
									onClick={() => router.push("/my-orders")}
								/>
								<UserButton.Action
									label={`Wishlist (${wishlistCount})`}
									labelIcon={
										<Image
											src={assets.heart_icon}
											alt="wishlist"
											className="w-5 h-5"
										/>
									}
									onClick={() => router.push("/wishlist")}
								/>
								{isSeller && (
									<UserButton.Action
										label="Seller Dashboard"
										labelIcon={<MdDashboard size={24} />}
										onClick={() => router.push("/seller")}
									/>
								)}
							</UserButton.MenuItems>
						</UserButton>
					) : (
						<button
							onClick={openSignIn}
							className="flex items-center gap-2 hover:text-gray-900 transition"
						>
							<Image
								src={assets.user_icon}
								alt="user icon"
								className="w-5 h-5"
							/>
							Account
						</button>
					)}
				</div>
			</div>

			{/* Mobile Slider */}
			{showMobileMenu && (
				<div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 p-4 flex flex-col gap-4 animate-slide-in">
					<button
						onClick={() => setShowMobileMenu(false)}
						className="self-end text-xl font-bold"
					>
						✕
					</button>

					{/* Search */}
					<form onSubmit={handleSearchSubmit} className="relative w-full">
						<input
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search products..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{searchResults.length > 0 && (
							<div className="absolute top-12 left-0 bg-white border w-full max-h-64 overflow-y-auto rounded shadow z-50">
								{searchResults.map((product) => (
									<div
										key={product._id}
										className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
										onClick={() => {
											router.push(`/product/${product._id}`);
											setSearchQuery("");
											setSearchResults([]);
											setShowMobileMenu(false);
										}}
									>
										<Image
											src={product.image[0]}
											alt={product.name}
											width={40}
											height={40}
											className="object-cover rounded"
										/>
										<span>{product.name}</span>
									</div>
								))}
							</div>
						)}
					</form>

					{/* Links */}
					<Link href="/" className="hover:text-gray-900 transition">
						Home
					</Link>
					<Link href="/all-products" className="hover:text-gray-900 transition">
						Shop
					</Link>
					<Link href="/about" className="hover:text-gray-900 transition">
						About Us
					</Link>
					<Link href="/contact" className="hover:text-gray-900 transition">
						Contact
					</Link>
				</div>
			)}

			{/* Desktop links and search */}
			<div className="hidden md:flex flex-1 justify-center items-center gap-6">
				<Link href="/" className="hover:text-gray-900 transition">
					Home
				</Link>
				<Link href="/all-products" className="hover:text-gray-900 transition">
					Shop
				</Link>
				<Link href="/about" className="hover:text-gray-900 transition">
					About Us
				</Link>
				<Link href="/contact" className="hover:text-gray-900 transition">
					Contact
				</Link>

				<form
					onSubmit={handleSearchSubmit}
					className="relative ml-4 flex items-center"
				>
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search products..."
						className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{searchResults.length > 0 && (
						<div className="absolute top-10 bg-white border w-64 mt-1 max-h-64 overflow-y-auto rounded shadow z-50">
							{searchResults.map((product) => (
								<div
									key={product._id}
									className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
									onClick={() => {
										router.push(`/product/${product._id}`);
										setSearchQuery("");
										setSearchResults([]);
									}}
								>
									<Image
										src={product.image[0]}
										alt={product.name}
										width={40}
										height={40}
										className="object-cover rounded"
									/>
									<span>{product.name}</span>
								</div>
							))}
						</div>
					)}
				</form>
			</div>

			{/* Desktop user actions */}
			<div className="hidden md:flex items-center gap-4">
				{user ? (
					<UserButton>
						<UserButton.MenuItems>
							<UserButton.Action
								label={`Cart (${cartCount})`}
								labelIcon={<CartIcon className="w-5 h-5" />}
								onClick={() => router.push("/cart")}
							/>
							<UserButton.Action
								label={`Orders (${orderCount})`}
								labelIcon={<BagIcon className="w-5 h-5" />}
								onClick={() => router.push("/my-orders")}
							/>
							<UserButton.Action
								label={`Wishlist (${wishlistCount})`}
								labelIcon={
									<Image
										src={assets.heart_icon}
										alt="wishlist"
										className="w-5 h-5"
									/>
								}
								onClick={() => router.push("/wishlist")}
							/>
							{isSeller && (
								<UserButton.Action
									label="Seller Dashboard"
									labelIcon={<MdDashboard size={24} />}
									onClick={() => router.push("/seller")}
								/>
							)}
						</UserButton.MenuItems>
					</UserButton>
				) : (
					<button
						onClick={openSignIn}
						className="flex items-center gap-2 hover:text-gray-900 transition"
					>
						<Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
						Account
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
