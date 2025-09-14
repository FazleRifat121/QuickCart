"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const sizeOptions = ["S", "M", "L", "XL"];

const AddProduct = () => {
	const { getToken } = useAppContext();
	const [files, setFiles] = useState([]);
	const [videos, setVideos] = useState([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("Three Piece");
	const [price, setPrice] = useState("");
	const [offerPrice, setOfferPrice] = useState("");
	const [brand, setBrand] = useState("");
	const [color, setColor] = useState("");
	const [sizes, setSizes] = useState([]);

	const handleSizeChange = (size) => {
		if (sizes.includes(size)) setSizes(sizes.filter((s) => s !== size));
		else setSizes([...sizes, size]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("category", category);
		formData.append("price", price);
		formData.append("offerPrice", offerPrice);
		formData.append("brand", brand);
		formData.append("color", color);
		formData.append("sizes", JSON.stringify(sizes)); // ✅ send sizes

		// Images
		for (let i = 0; i < files.length; i++) formData.append("image", files[i]);
		// Videos
		for (let i = 0; i < videos.length; i++) formData.append("video", videos[i]);

		try {
			const token = await getToken();
			const { data } = await axios.post("/api/product/add", formData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) {
				toast.success(data.message);
				// Reset form
				setFiles([]);
				setVideos([]);
				setName("");
				setDescription("");
				setCategory("Three Piece");
				setPrice("");
				setOfferPrice("");
				setBrand("");
				setColor("");
				setSizes([]);
			} else toast.error(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="flex-1 min-h-screen flex flex-col justify-between">
			<form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg ">
				{/* Product Images */}
				<div>
					<p className="text-base font-medium">Product Images</p>
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
									accept="image/*"
									id={`image${index}`}
									hidden
								/>
								<Image
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

				{/* Product Video */}
				<div>
					<p className="text-base font-medium">Product Video</p>
					<div className="flex items-center gap-3 mt-2">
						<label htmlFor="video">
							<input
								onChange={(e) =>
									e.target.files[0] && setVideos([e.target.files[0]])
								}
								type="file"
								accept="video/*"
								id="video"
								hidden
							/>
							{videos[0] ? (
								<video
									className="w-24 h-24 object-cover rounded cursor-pointer"
									src={URL.createObjectURL(videos[0])}
									controls
								/>
							) : (
								<Image
									className="max-w-24 cursor-pointer"
									src={assets.upload_area}
									alt=""
									width={100}
									height={100}
								/>
							)}
						</label>
					</div>
				</div>

				{/* Name & Description */}
				<div className="flex flex-col gap-1 max-w-md">
					<label className="text-base font-medium">Product Name</label>
					<input
						type="text"
						placeholder="Type here"
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className="flex flex-col gap-1 max-w-md">
					<label className="text-base font-medium">Product Description</label>
					<textarea
						rows={4}
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
						placeholder="Type here"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

				{/* Category, Price, Offer Price, Brand, Color */}
				<div className="flex items-center gap-5 flex-wrap">
					{/* Category */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium">Category</label>
						<select
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							<option value="Three Piece">Three Piece</option>
							<option value="Lawn">Lawn</option>
							<option value="Salwar Kameez">Salwar Kameez</option>
							<option value="Kurti">Kurti</option>
							<option value="Silk">Silk</option>
						</select>
					</div>

					{/* Price */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium">Product Price</label>
						<input
							type="number"
							placeholder="0"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</div>

					{/* Offer Price */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium">Offer Price</label>
						<input
							type="number"
							placeholder="0"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							value={offerPrice}
							onChange={(e) => setOfferPrice(e.target.value)}
							required
						/>
					</div>

					{/* Brand */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium">Brand</label>
						<input
							type="text"
							placeholder="Type here"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							value={brand}
							onChange={(e) => setBrand(e.target.value)}
						/>
					</div>

					{/* Color */}
					<div className="flex flex-col gap-1 w-32">
						<label className="text-base font-medium">Color</label>
						<input
							type="text"
							placeholder="Type here"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40  capitalize"
							value={color}
							onChange={(e) => setColor(e.target.value)}
						/>
					</div>
				</div>

				{/* ✅ Sizes */}
				<div>
					<p className="font-medium mb-1">Sizes</p>
					<div className="flex gap-2 flex-wrap">
						{sizeOptions.map((s) => (
							<label key={s} className="flex items-center gap-1">
								<input
									type="checkbox"
									checked={sizes.includes(s)}
									onChange={() => handleSizeChange(s)}
								/>
								{s}
							</label>
						))}
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
