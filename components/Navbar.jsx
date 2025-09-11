"use client";
import React, { useState, useEffect, useRef } from "react";
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

	const [orderCount, setOrderCount] = useState(orders ? orders.length : 0);
	const [mounted, setMounted] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const mobileSearchRef = useRef(null);

	// mark as mounted
	useEffect(() => {
		setMounted(true);
	}, []);

	// update order count if orders change
	useEffect(() => {
		setOrderCount(orders ? orders.length : 0);
	}, [orders]);

	// close search if clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				mobileSearchRef.current &&
				!mobileSearchRef.current.contains(e.target)
			) {
				setShowMobileSearch(false);
				setSearchQuery("");
				setSearchResults([]);
			}
		};
		if (showMobileSearch) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showMobileSearch]);

	// search as you type
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
		if (!searchQuery) return;
		router.push(`/all-products?search=${encodeURIComponent(searchQuery)}`);
		setSearchQuery("");
		setSearchResults([]);
		setShowMobileMenu(false);
		setShowMobileSearch(false);
	};

	// render placeholder while mounting
	if (!mounted) {
		return <nav className="h-16 border-b border-gray-300"></nav>;
	}

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
				<div className="md:hidden flex items-center gap-3 relative">
					{/* Search button */}
					<button onClick={() => setShowMobileSearch((prev) => !prev)}>
						<Image src={assets.search_icon} alt="search" className="w-5 h-5" />
					</button>

					{/* User button (mobile only) */}
					{user ? (
						<UserButton
							appearance={{
								elements: {
									userButtonPopoverCard: "ml-4 mt-2",
								},
							}}
						>
							<UserButton.MenuItems className="absolute top-full right-0 mt-2 w-64 flex flex-col gap-2 bg-white shadow-lg rounded z-50">
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

					{/* Hamburger button */}
					<button
						onClick={() => setShowMobileMenu((prev) => !prev)}
						className="flex flex-col justify-between w-6 h-5 ml-2"
					>
						<span className="block h-0.5 w-full bg-gray-700"></span>
						<span className="block h-0.5 w-full bg-gray-700"></span>
						<span className="block h-0.5 w-full bg-gray-700"></span>
					</button>

					{/* Slide-out menu */}
					<div
						className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
							showMobileMenu ? "translate-x-0" : "translate-x-full"
						}`}
					>
						<button
							className="self-end mb-4 text-xl font-bold"
							onClick={() => setShowMobileMenu(false)}
						>
							✕
						</button>
						<Link
							href="/"
							onClick={() => setShowMobileMenu(false)}
							className="hover:text-gray-900 text-lg"
						>
							Home
						</Link>
						<Link
							href="/all-products"
							onClick={() => setShowMobileMenu(false)}
							className="hover:text-gray-900 text-lg"
						>
							Shop
						</Link>
						<Link
							href="/about"
							onClick={() => setShowMobileMenu(false)}
							className="hover:text-gray-900 text-lg"
						>
							About Us
						</Link>
						<Link
							href="/contact"
							onClick={() => setShowMobileMenu(false)}
							className="hover:text-gray-900 text-lg"
						>
							Contact
						</Link>
					</div>

					{/* Mobile search bar */}
					{showMobileSearch && (
						<div
							ref={mobileSearchRef}
							className="absolute top-12 -left-64 w-screen px-4 py-5 flex flex-col gap-2 z-50"
						>
							<input
								type="text"
								value={searchQuery}
								onChange={handleSearchChange}
								placeholder="Search products..."
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>

							{searchResults.length > 0 && (
								<div className="bg-white border rounded-md shadow max-h-64 overflow-y-auto">
									{searchResults.map((product) => (
										<div
											key={product._id}
											className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
											onClick={() => {
												router.push(`/product/${product._id}`);
												setSearchQuery("");
												setSearchResults([]);
												setShowMobileSearch(false);
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
						</div>
					)}
				</div>
			</div>

			{/* Desktop links + search */}
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
