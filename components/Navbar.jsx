"use client";
import React, { useState } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import { MdDashboard } from "react-icons/md";
import { useRouter } from "next/navigation";

const Navbar = () => {
	const {
		user,
		isSeller,
		wishlist,
		cartItems,
		orders,
		router: appRouter,
	} = useAppContext();
	const router = useRouter();
	const { openSignIn } = useClerk();

	const wishlistCount = wishlist.length;
	const cartCount = Object.values(cartItems).reduce((sum, q) => sum + q, 0);
	const orderCount = orders.length;

	const [showSearch, setShowSearch] = useState(false);

	return (
		<nav className="flex justify-between px-6 md:px-16 py-3 border-b items-center">
			<Image
				className="w-28 cursor-pointer"
				src={assets.logo}
				alt="logo"
				onClick={() => router.push("/")}
			/>

			{/* Desktop counts */}
			<div className="hidden md:flex items-center gap-6">
				{user ? (
					<UserButton>
						<UserButton.MenuItems>
							<UserButton.Action
								label="Cart"
								labelIcon={
									<div className="relative">
										<CartIcon className="w-5 h-5" />
										{cartCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 rounded-full">
												{cartCount}
											</span>
										)}
									</div>
								}
								onClick={() => router.push("/cart")}
							/>
							<UserButton.Action
								label="My Orders"
								labelIcon={
									<div className="relative">
										<BagIcon className="w-5 h-5" />
										{orderCount > 0 && (
											<span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded-full">
												{orderCount}
											</span>
										)}
									</div>
								}
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
											<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
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
					<button onClick={openSignIn}>Sign In</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
