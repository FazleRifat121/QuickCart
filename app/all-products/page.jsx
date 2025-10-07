"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["Three Piece", "Lawn", "Salwar Kameez", "Kurti", "Silk"];
const sizes = ["S", "M", "L", "XL"];
const colors = [
	"Red",
	"Blue",
	"Green",
	"Black",
	"White",
	"Yellow",
	"Orange",
	"Purple",
	"Pink",
	"Brown",
	"Beige",
	"Grey",
	"Navy",
	"Maroon",
	"Teal",
	"Olive",
	"Cyan",
	"Multi",
];
const sortingOptions = [
	"Popularity",
	"New Arrivals",
	"Price: Low to High",
	"Price: High to Low",
];

const AllProducts = () => {
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [filters, setFilters] = useState({ size: "", color: "" });
	const [sortBy, setSortBy] = useState("Popularity");
	const [showFilters, setShowFilters] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	// Client-only check for screen width
	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleFilterChange = (filterName, value) => {
		setFilters((prev) => ({ ...prev, [filterName]: value }));
	};

	// Fetch products sorted by most ordered
	useEffect(() => {
		fetch("/api/product/popularity")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) setProducts(data.products);
			});
	}, []);

	// Filter & sort products
	const filteredProducts = products
		.filter((p) => !selectedCategory || p.category === selectedCategory)
		.filter((p) => !filters.size || p.sizes?.includes(filters.size))
		.filter((p) => !filters.color || p.color?.includes(filters.color))
		.sort((a, b) => {
			if (sortBy === "Price: Low to High") return a.offerPrice - b.offerPrice;
			if (sortBy === "Price: High to Low") return b.offerPrice - a.offerPrice;
			if (sortBy === "New Arrivals") return b.date - a.date;
			if (sortBy === "Popularity")
				return (b.orderCount || 0) - (a.orderCount || 0);
			return 0;
		});

	return (
		<>
			<Navbar />
			<div className="px-6 md:px-16 lg:px-32 mt-12">
				{!isDesktop && (
					<button
						onClick={() => setShowFilters(!showFilters)}
						className="px-4 py-2 bg-white text-gray-600 border rounded mb-4"
					>
						{showFilters ? "Hide Filters" : "Show Filters"}
					</button>
				)}

				<div className="flex flex-col md:flex-row gap-6">
					{(showFilters || isDesktop) && (
						<aside className="w-full md:w-64 flex-shrink-0 border p-4 rounded bg-gray-50">
							{/* Categories */}
							<div className="mb-6">
								<h3 className="font-semibold mb-2">Categories</h3>
								<div className="flex flex-wrap gap-2">
									{categories.map((cat) => (
										<button
											key={cat}
											className={`px-3 py-1 rounded-full text-sm ${
												selectedCategory === cat
													? "bg-orange-600 text-white"
													: "bg-gray-200 text-gray-700"
											}`}
											onClick={() =>
												setSelectedCategory(cat === selectedCategory ? "" : cat)
											}
										>
											{cat}
										</button>
									))}
								</div>
							</div>

							{/* Filters */}
							<div className="mb-6">
								<h3 className="font-semibold mb-2">Filters</h3>

								<div className="mb-4">
									<p className="text-sm font-medium">Size</p>
									<div className="flex flex-wrap gap-2 mt-1">
										{sizes.map((s) => (
											<button
												key={s}
												className={`px-2 py-1 border rounded-full text-sm ${
													filters.size === s
														? "bg-orange-600 text-white border-orange-600"
														: "bg-white"
												}`}
												onClick={() =>
													handleFilterChange(
														"size",
														s === filters.size ? "" : s
													)
												}
											>
												{s}
											</button>
										))}
									</div>
								</div>

								<div>
									<p className="text-sm font-medium">Color</p>
									<div className="flex flex-wrap gap-2 mt-1">
										{colors.map((c, idx) => (
											<button
												key={idx}
												className={`px-2 py-1 border rounded-full text-sm ${
													filters.color === c
														? "bg-orange-600 text-white border-orange-600"
														: "bg-white"
												}`}
												onClick={() =>
													handleFilterChange(
														"color",
														c === filters.color ? "" : c
													)
												}
											>
												{c}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Sorting */}
							<div>
								<h3 className="font-semibold mb-2">Sort By</h3>
								<select
									className="w-full border px-3 py-2 rounded"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
								>
									{sortingOptions.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>
						</aside>
					)}

					{/* Products Grid */}
					<div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{filteredProducts.length === 0 ? (
							<p className="col-span-full text-center mt-10">
								No products found
							</p>
						) : (
							filteredProducts.map((product, index) => (
								<ProductCard key={index} product={product} />
							))
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default AllProducts;
