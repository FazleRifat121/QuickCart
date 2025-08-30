"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
	const { router, wishlist, toggleWishlist, currency, user } = useAppContext();

	// Compute if the product is in wishlist
	const isWish =
		Array.isArray(wishlist) &&
		wishlist.some(
			(p) => p && (p._id ? p._id === product._id : p === product._id)
		);
	const handleWishlistClick = (e) => {
		e.stopPropagation();

		if (!user) return toast.error("Login to add to wishlist");
		if (!product || !product._id) return; // ✅ safety check

		toggleWishlist(product);

		// Show toast based on new state
		if (!isWish) toast.success("Added to wishlist");
		else toast.success("Removed from wishlist");
	};

	return (
		<div
			onClick={() => router.push("/product/" + product._id)}
			className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
		>
			<div className="relative w-full h-52 rounded-lg overflow-hidden bg-gray-100 group">
				<Image
					src={product.image[0]}
					alt={product.name}
					className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
					width={800}
					height={800}
				/>
				<button
					onClick={handleWishlistClick}
					className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors duration-300 ${
						isWish ? "bg-red-500" : "bg-white"
					}`}
				>
					<Image src={assets.heart_icon} alt="heart" className="h-3 w-3" />
				</button>
			</div>

			<p className="md:text-base font-medium pt-2 w-full truncate">
				{product.name}
			</p>
			<p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
				{product.description}
			</p>
			<p className="text-base font-medium">
				{currency}
				{product.offerPrice}
			</p>
		</div>
	);
};

export default ProductCard;
