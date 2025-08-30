"use client";
import React, { useState } from "react";
import { assets, BagIcon, CartIcon, HomeIcon, BoxIcon } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
	const { user, wishlist, cartItems, router, userData, isSeller } =
		useAppContext();
	const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
	const cartCount = cartItems
		? Object.values(cartItems).reduce((sum, q) => sum + q, 0)
		: 0;
	const orderCount =
		userData && Array.isArray(userData.orders) ? userData.orders.length : 0;

	const { openSignIn } = useClerk();
	const [showSearch, setShowSearch] = useState(false);

	return (
		<nav className="flex items-center justify-between px-6 md:px-16 py-3 border-b">
			<Image
				className="cursor-pointer w-28 md:w-32"
				src={assets.logo}
				alt="logo"
				onClick={() => router.push("/")}
			/>

			<div className="hidden md:flex items-center gap-4">
				{user ? (
					<UserButton>
						<UserButton.MenuItems>
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
									labelIcon={<BoxIcon />}
									onClick={() => router.push("/seller")}
								/>
							)}
						</UserButton.MenuItems>
					</UserButton>
				) : (
					<button onClick={openSignIn}>Login</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
