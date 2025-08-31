"use client";
import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";

const Wishlist = () => {
	const { router, products, wishlist = [], toggleWishlist } = useAppContext();

	// Safely map wishlist to product objects
	const wishlistProducts = Array.isArray(wishlist)
		? wishlist
				.map((idOrObj) => {
					if (!idOrObj) return null; // safety check
					return products.find((p) => p && p._id === (idOrObj._id || idOrObj));
				})
				.filter(Boolean) // remove undefined/null entries
		: [];

	// Remove product from wishlist
	const handleRemove = (product) => {
		if (!product) return;
		toggleWishlist(product);
		toast.success("Removed from wishlist");
	};

	return (
		<>
			<Navbar />
			<div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
				<div className="flex-1">
					<div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
						<p className="text-2xl md:text-3xl text-gray-500">
							Your <span className="font-medium text-orange-600">Wishlist</span>
						</p>
						<p className="text-lg md:text-xl text-gray-500/80">
							{wishlistProducts.length} Items
						</p>
					</div>

					{wishlistProducts.length === 0 ? (
						<p className="text-gray-500">Your wishlist is empty.</p>
					) : (
						<div className="overflow-x-auto w-full">
							<table className="min-w-full table-auto">
								<thead className="text-left">
									<tr>
										<th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
											Product Details
										</th>
										<th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
											Price
										</th>
										<th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{wishlistProducts.map((product, index) => (
										<tr key={`${product._id}-${index}`}>
											<td className="flex items-center gap-4 py-4 md:px-4 px-1">
												<div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
													<Image
														src={product.image[0]}
														alt={product.name}
														className="w-16 h-16 md:w-20 md:h-auto object-cover mix-blend-multiply"
														width={80}
														height={80}
													/>
												</div>
												<div className="text-sm">
													<button
														onClick={() =>
															router.push("/product/" + product._id)
														}
														className="text-gray-800 hover:underline"
													>
														{product.name}
													</button>
												</div>
											</td>

											<td className="py-4 md:px-4 px-1 text-gray-600">
												${product.offerPrice}
											</td>
											<td className="py-4 md:px-4 px-1">
												<button
													onClick={() => handleRemove(product)}
													className="text-xs text-red-500 hover:underline"
												>
													Remove
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					<button
						onClick={() => router.push("/all-products")}
						className="group flex items-center mt-6 gap-2 text-orange-600"
					>
						<Image
							className="group-hover:-translate-x-1 transition"
							src={assets.arrow_right_icon_colored}
							alt="arrow_right_icon_colored"
						/>
						Continue Shopping
					</button>
				</div>
			</div>
		</>
	);
};

export default Wishlist;
