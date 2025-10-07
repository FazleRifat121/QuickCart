"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
	const { router } = useAppContext();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch("/api/product/popularity")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					// take top 10 products
					setProducts(data.products.slice(0, 10));
				}
			});
	}, []);

	return (
		<div className="flex flex-col items-center pt-14">
			<p className="text-2xl font-medium text-left w-full">Popular products</p>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
				{products.map((product, index) => (
					<ProductCard key={index} product={product} />
				))}
			</div>
			<button
				onClick={() => router.push("/all-products")}
				className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
			>
				See more
			</button>
		</div>
	);
};

export default HomeProducts;
