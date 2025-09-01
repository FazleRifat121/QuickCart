"use client";
import { assets } from "@/assets/assets";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Product = () => {
	const { id } = useParams();
	const { products, router, addToCart, user } = useAppContext(); // added user

	const [mainImage, setMainImage] = useState(null);
	const [fade, setFade] = useState(true);
	const [productData, setProductData] = useState(null);

	const fetchProductData = async () => {
		const product = products.find((product) => product._id === id);
		setProductData(product);
	};

	const handleThumbnailClick = (image) => {
		// Fade out, change image, then fade in
		setFade(false);
		setTimeout(() => {
			setMainImage(image);
			setFade(true);
		}, 200);
	};

	useEffect(() => {
		fetchProductData();
	}, [id, products.length]);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please log in to add items to your cart!");
			return;
		}
		addToCart(productData._id);
	};

	const handleBuyNow = () => {
		if (!user) {
			toast.error("Please log in to buy this product!");
			return;
		}
		addToCart(productData._id);
		router.push("/cart");
	};

	return productData ? (
		<>
			<Navbar />
			<div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
					<div className="px-5 lg:px-16 xl:px-20">
						<div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
							<Image
								key={mainImage || productData.image[0]}
								src={mainImage || productData.image[0]}
								alt="alt"
								className={`w-full h-auto object-cover mix-blend-multiply transition-opacity duration-500 ease-in-out ${
									fade ? "opacity-100" : "opacity-0"
								}`}
								width={1280}
								height={720}
							/>
						</div>

						<div className="grid grid-cols-4 gap-4">
							{productData.image.map((image, index) => (
								<div
									key={index}
									onClick={() => handleThumbnailClick(image)}
									className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
								>
									<Image
										src={image}
										alt="alt"
										className="w-full h-auto object-cover mix-blend-multiply"
										width={1280}
										height={720}
									/>
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col">
						<h1 className="text-3xl font-medium text-gray-800/90 mb-4">
							{productData.name}
						</h1>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-0.5">
								<Image
									className="h-4 w-4"
									src={assets.star_icon}
									alt="star_icon"
								/>
								<Image
									className="h-4 w-4"
									src={assets.star_icon}
									alt="star_icon"
								/>
								<Image
									className="h-4 w-4"
									src={assets.star_icon}
									alt="star_icon"
								/>
								<Image
									className="h-4 w-4"
									src={assets.star_icon}
									alt="star_icon"
								/>
								<Image
									className="h-4 w-4"
									src={assets.star_dull_icon}
									alt="star_dull_icon"
								/>
							</div>
							<p>(4.5)</p>
						</div>
						<p className="text-gray-600 mt-3">{productData.description}</p>
						<p className="text-3xl font-medium mt-6">
							${productData.offerPrice}
							<span className="text-base font-normal text-gray-800/60 line-through ml-2">
								${productData.price}
							</span>
						</p>
						<hr className="bg-gray-600 my-6" />
						<div className="overflow-x-auto">
							<table className="table-auto border-collapse w-full max-w-72">
								<tbody>
									{productData.brand && (
										<tr>
											<td className="text-gray-600 font-medium">Brand</td>
											<td className="text-gray-800/50">{productData.brand}</td>
										</tr>
									)}
									{productData.color && (
										<tr>
											<td className="text-gray-600 font-medium">Color</td>
											<td className="text-gray-800/50">{productData.color}</td>
										</tr>
									)}
									<tr>
										<td className="text-gray-600 font-medium">Category</td>
										<td className="text-gray-800/50">{productData.category}</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className="flex items-center mt-10 gap-4">
							<button
								onClick={handleAddToCart}
								className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
							>
								Add to Cart
							</button>
							<button
								onClick={handleBuyNow}
								className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
							>
								Buy now
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="flex flex-col items-center mb-4 mt-16">
						<p className="text-3xl font-medium">
							Featured{" "}
							<span className="font-medium text-orange-600">Products</span>
						</p>
						<div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
						{products.slice(0, 5).map((product, index) => (
							<ProductCard key={index} product={product} />
						))}
					</div>
					<button
						onClick={() => router.push("/all-products")}
						className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
					>
						See more
					</button>
				</div>
			</div>
			<Footer />
		</>
	) : (
		<Loading />
	);
};

export default Product;
