"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
	const { router, getToken, user } = useAppContext();

	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	const fetchSellerProduct = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get("/api/product/seller-list", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (data.success) {
				setProducts(data.products);
				setFilteredProducts(data.products);
				setLoading(false);
			} else {
				toast.error(data.message || "Failed to fetch products");
			}
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (productId) => {
		if (!confirm("Are you sure you want to delete this product?")) return;

		try {
			const token = await getToken();
			const { data } = await axios.delete(`/api/product/delete/${productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				toast.success(data.message);
				const updated = products.filter((p) => p._id !== productId);
				setProducts(updated);
				setFilteredProducts(
					updated.filter((p) =>
						p.name.toLowerCase().includes(search.toLowerCase())
					)
				);
			} else {
				toast.error(data.message || "Failed to delete product");
			}
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	useEffect(() => {
		if (user) fetchSellerProduct();
	}, [user]);

	useEffect(() => {
		const filtered = products.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase())
		);
		setFilteredProducts(filtered);
	}, [search, products]);

	return (
		<div className="flex-1 min-h-screen flex flex-col justify-between">
			{loading ? (
				<Loading />
			) : (
				<div className="w-full md:p-10 p-4">
					<h2 className="pb-4 text-lg font-medium">All Product</h2>

					{/* Search Bar */}
					<div className="mb-4">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search products..."
							className="w-full max-w-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>

					<div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
						<table className="table-fixed w-full overflow-hidden">
							<thead className="text-gray-900 text-sm text-left">
								<tr>
									<th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
										Product
									</th>
									<th className="px-4 py-3 font-medium truncate max-sm:hidden">
										Category
									</th>
									<th className="px-4 py-3 font-medium truncate max-sm:hidden">
										Price
									</th>
									<th className="px-4 py-3 font-medium truncate max-sm:hidden">
										Action
									</th>
									<th className="px-4 py-3 font-medium truncate">Action</th>
								</tr>
							</thead>
							<tbody className="text-sm text-gray-500">
								{filteredProducts.map((product, index) => (
									<tr
										key={index}
										className="border-t border-gray-500/20 cursor-pointer"
										onClick={() => {
											if (window.innerWidth < 768) {
												router.push(`/product/${product._id}`);
											}
										}}
									>
										<td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
											<div className="bg-gray-500/10 rounded p-2">
												<Image
													src={product.image[0]}
													alt="product Image"
													className="w-16"
													width={1280}
													height={720}
												/>
											</div>
											<span className="truncate w-full">{product.name}</span>
										</td>
										<td className="px-4 py-3 max-sm:hidden">
											{product.category}
										</td>
										<td className="px-4 py-3 max-sm:hidden">
											${product.offerPrice}
										</td>
										<td className="px-4 py-3 max-sm:hidden">
											<button
												onClick={(e) => {
													e.stopPropagation(); // prevent the row click
													router.push(`/product/${product._id}`);
												}}
												className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
											>
												<span className="hidden md:block">Visit</span>
												<Image
													className="h-3.5"
													src={assets.redirect_icon}
													alt="redirect_icon"
												/>
											</button>
										</td>
										<td className="px-4 py-3">
											<button
												onClick={(e) => {
													e.stopPropagation(); // prevent the row click
													handleDelete(product._id);
												}}
												className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 rounded-md text-white text-xl"
											>
												<RiDeleteBin6Fill />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default ProductList;
