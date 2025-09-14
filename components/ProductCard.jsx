"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
	const { router, wishlist, toggleWishlist, currency, user } = useAppContext();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [fade, setFade] = useState(true);
	const intervalRef = useRef(null);

	const isWish =
		Array.isArray(wishlist) &&
		wishlist.some(
			(p) => p && (p._id ? p._id === product._id : p === product._id)
		);

	const handleWishlistClick = async (e) => {
		e.stopPropagation();
		if (!user) return toast.error("Login to add to wishlist");
		if (!product || !product._id) return;

		const exists = wishlist.includes(product._id);
		await toggleWishlist(product);
		toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
	};

	const startImageCycle = () => {
		if (product.image.length <= 1) return;
		intervalRef.current = setInterval(() => {
			setFade(false);
			setTimeout(() => {
				setCurrentImageIndex((prev) => (prev + 1) % product.image.length);
				setFade(true);
			}, 300);
		}, 2000);
	};

	const stopImageCycle = () => {
		clearInterval(intervalRef.current);
		setCurrentImageIndex(0); // reset to first image
	};

	return (
		<div
			onClick={() => router.push("/product/" + product._id)}
			className="flex flex-col items-start gap-2 max-w-[250px] w-full cursor-pointer group transition-transform duration-300 hover:scale-105"
			onMouseEnter={startImageCycle}
			onMouseLeave={stopImageCycle}
		>
			<div className="relative w-full h-72 rounded-xl overflow-hidden shadow-lg bg-gray-100 transition-shadow duration-300 group-hover:shadow-2xl ">
				<Image
					src={product.image[currentImageIndex]}
					alt={product.name}
					className={`object-cover w-full h-full transition-opacity duration-500 z-0 ${
						fade ? "opacity-100" : "opacity-0"
					}`}
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

			<div className="w-full flex flex-col gap-1 mt-2">
				<p className="md:text-lg font-semibold truncate">{product.name}</p>

				<div className="flex items-center gap-2 mt-2">
					<p className="text-base font-bold text-gray-800">
						{currency}
						{product.offerPrice}
					</p>
					{product.price > product.offerPrice && (
						<p className="text-xs line-through text-gray-400">
							{currency}
							{product.price}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
