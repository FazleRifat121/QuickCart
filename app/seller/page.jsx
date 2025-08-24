"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const AddProduct = () => {
	const { getToken } = useAppContext();
	const [files, setFiles] = useState([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("Three Piece");
	const [price, setPrice] = useState("");
	const [offerPrice, setOfferPrice] = useState("");
	const [brand, setBrand] = useState("");
	const [color, setColor] = useState(""); // ✅ New state for color

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("category", category);
		formData.append("price", price);
		formData.append("offerPrice", offerPrice);
		formData.append("brand", brand);
		formData.append("color", color); // ✅ Append color
		for (let i = 0; i < files.length; i++) {
			formData.append("image", files[i]);
		}

		try {
			const token = await getToken();
			const { data } = await axios.post("/api/product/add", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (data.success) {
				toast.success(data.message);
				setFiles([]);
				setName("");
				setDescription("");
				setCategory("Three Piece");
				setPrice("");
				setOfferPrice("");
				setBrand("");
				setColor(""); // ✅ Reset color
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="flex-1 min-h-screen flex flex-col justify-between">
			<form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
				{/* Product Images */}
				<div>
					<p className="text-base font-medium">Product Image</p>
					<div className="flex flex-wrap items-center gap-3 mt-2">
						{[...Array(4)].map((_, index) => (
							<label key={index} htmlFor={`image${index}`}>
								<input
									onChange={(e) => {
										const updatedFiles = [...files];
										updatedFiles[index] = e.target.files[0];
										setFiles(updatedFiles);
									}}
									type="file"
									id={`image${index}`}
									hidden
								/>
								<Image
									key={index}
									className="max-w-24 cursor-pointer"
									src={
										files[index]
											? URL.createObjectURL(files[index])
											: assets.upload_area
									}
									alt=""
									width={100}
									height={100}
								/>
							</label>
						))}
					</div>
				</div>

				{/* Name & Description */}
				<div className="flex flex-col gap-1 max-w-md">
					<label className="text-base font-medium" htmlFor="product-name">
						Product Name
					</label>
					<input
						id="product-name"
						type="text"
						placeholder="Type here"
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
						onChange={(e) => setName(e.target.value)}
						value={name}
						required
					/>
				</div>

				<div className="flex flex-col gap-1 max-w-md">
					<label
						className="text-base font-medium"
						htmlFor="product-description"
					>
						Product Description
					</label>
					<textarea
						id="product-description"
						rows={4}
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
						placeholder="Type here"
						onChange={(e) => setDescription(e.target.value)}
						value={description}
						required
					/>
				</div>

				{/* Category, Price, Offer Price, Brand, Color */}
				<div className="flex items-center gap-5 flex-wrap">
					{/* Category */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium" htmlFor="category">
							Category
						</label>
						<select
							id="category"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							onChange={(e) => setCategory(e.target.value)}
							defaultValue={category}
						>
							<option value="Three Piece">Three Piece</option>
							<option value="Earphone">Earphone</option>
							<option value="Salwar Kameez">Salwar Kameez</option>
							<option value="Watch">Watch</option>
							<option value="Smartphone">Smartphone</option>
							<option value="Laptop">Laptop</option>
							<option value="Camera">Camera</option>
							<option value="Accessories">Accessories</option>
						</select>
					</div>

					{/* Price */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium" htmlFor="product-price">
							Product Price
						</label>
						<input
							id="product-price"
							type="number"
							placeholder="0"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							onChange={(e) => setPrice(e.target.value)}
							value={price}
							required
						/>
					</div>

					{/* Offer Price */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium" htmlFor="offer-price">
							Offer Price
						</label>
						<input
							id="offer-price"
							type="number"
							placeholder="0"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							onChange={(e) => setOfferPrice(e.target.value)}
							value={offerPrice}
							required
						/>
					</div>

					{/* Brand */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium" htmlFor="brand">
							Brand
						</label>
						<input
							id="brand"
							type="text"
							placeholder="Type here"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							onChange={(e) => setBrand(e.target.value)}
							value={brand}
						/>
					</div>

					{/* Color */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium" htmlFor="color">
							Color
						</label>
						<input
							id="color"
							type="text"
							placeholder="Type here"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							onChange={(e) => setColor(e.target.value)}
							value={color}
						/>
					</div>
				</div>

				<button
					type="submit"
					className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
				>
					ADD
				</button>
			</form>
		</div>
	);
};

export default AddProduct;
