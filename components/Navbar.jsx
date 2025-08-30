"use client";
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
	const { isSeller, router, user, wishlist, cartItems, userData } =
		useAppContext();

	const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
	const cartCount = cartItems
		? Object.values(cartItems).reduce((sum, q) => sum + q, 0)
		: 0;
	const orderCount =
		userData && Array.isArray(userData.orders) ? userData.orders.length : 0;

	const { openSignIn } = useClerk();
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	// Live search API
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
		setShowSearch(false);
		setSearchResults([]);
		setSearchQuery("");
	};

	return (
		<nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
			{/* Logo + Mobile Icons */}
			<div className="flex items-center w-full md:w-auto justify-between">
				<Image
					className="cursor-pointer w-28 md:w-32"
					onClick={() => router.push("/")}
					src={assets.logo}
					alt="logo"
				/>

				{/* Mobile icons */}
				<div className="md:hidden flex items-center gap-3">
					<Image
						className="w-5 h-5 cursor-pointer"
						src={assets.search_icon}
						alt="search icon"
						onClick={() => setShowSearch(!showSearch)}
					/>
					{user ? (
						<UserButton>
							<UserButton.MenuItems>
								<UserButton.Action
									label="Home"
									labelIcon={<HomeIcon />}
									onClick={() => router.push("/")}
								/>
								<UserButton.Action
									label="Products"
									labelIcon={<BoxIcon />}
									onClick={() => router.push("/all-products")}
								/>
								<UserButton.Action
									label="Cart"
									labelIcon={<CartIcon />}
									onClick={() => router.push("/cart")}
								/>
								<UserButton.Action
									label="My Orders"
									labelIcon={<BagIcon />}
									onClick={() => router.push("/my-orders")}
								/>
								<UserButton.Action
									label="Wishlist"
									labelIcon={
										<div className="relative">
											<Image
												src={assets.heart_icon}
												alt="wishlist"
												className="w-5 h-5"
											/>
											{wishlistCount > 0 && (
												<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
													{wishlistCount}
												</span>
											)}
										</div>
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

			{/* Search bar */}
			{showSearch && (
				<form
					onSubmit={handleSearchSubmit}
					className="absolute top-full left-0 w-full md:static md:w-auto md:flex md:ml-6 z-50"
				>
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search products..."
						className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					{searchResults.length > 0 && (
						<div className="absolute bg-white border w-full md:w-64 mt-1 max-h-64 overflow-y-auto rounded shadow z-50">
							{searchResults.map((product) => (
								<div
									key={product._id}
									className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
									onClick={() => {
										router.push(`/product/${product._id}`);
										setShowSearch(false);
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
			)}

			{/* Desktop nav links */}
			<div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
				<Link href="/" className="hover:text-gray-900 transition">
					Home
				</Link>
				<Link href="/all-products" className="hover:text-gray-900 transition">
					Shop
				</Link>
				<Link href="/" className="hover:text-gray-900 transition">
					About Us
				</Link>
				<Link href="/" className="hover:text-gray-900 transition">
					Contact
				</Link>
				{isSeller && (
					<button
						onClick={() => router.push("/seller")}
						className="text-xs border px-4 py-1.5 rounded-full"
					>
						Seller Dashboard
					</button>
				)}
			</div>

			{/* Desktop user + counts */}
			<ul className="hidden md:flex items-center gap-4">
				<Image
					className="w-4 h-4 cursor-pointer"
					src={assets.search_icon}
					alt="search icon"
					onClick={() => setShowSearch(!showSearch)}
				/>
				{user ? (
					<UserButton>
						<UserButton.MenuItems>
							{/* Cart */}
							<UserButton.Action
								label="Cart"
								labelIcon={
									<div className="relative">
										<CartIcon className="w-5 h-5" />
										{cartCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-semibold rounded-full px-1.5">
												{cartCount}
											</span>
										)}
									</div>
								}
								onClick={() => router.push("/cart")}
							/>
							{/* Orders */}
							<UserButton.Action
								label="My Orders"
								labelIcon={
									<div className="relative">
										<BagIcon className="w-5 h-5" />
										{orderCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-semibold rounded-full px-1.5">
												{orderCount}
											</span>
										)}
									</div>
								}
								onClick={() => router.push("/my-orders")}
							/>
							{/* Wishlist */}
							<UserButton.Action
								label="Wishlist"
								labelIcon={
									<div className="relative">
										<Image
											src={assets.heart_icon}
											alt="wishlist"
											className="w-5 h-5"
										/>
										{wishlistCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
												{wishlistCount}
											</span>
										)}
									</div>
								}
								onClick={() => router.push("/wishlist")}
							/>
						</UserButton.MenuItems>
					</UserButton>
				) : (
					<button
						onClick={openSignIn}
						className="flex items-center gap-2 hover:text-gray-900 transition"
					>
						<Image src={assets.user_icon} alt="user icon" />
						Account
					</button>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;
