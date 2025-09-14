"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AddBanner = () => {
	const [file, setFile] = useState(null);
	const [link, setLink] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) return toast.error("Please select an image");

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			// Upload image to Cloudinary
			const { data: uploadData } = await axios.post(
				"/api/banners/upload-banner",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);

			if (!uploadData.success) throw new Error(uploadData.message);

			// Save banner in MongoDB
			const { data } = await axios.post("/api/banners", {
				imgUrl: uploadData.url,
				link,
			});

			if (data.success) {
				toast.success("Banner added successfully!");
				setFile(null);
				setLink("");
			} else {
				toast.error(data.message);
			}
		} catch (err) {
			console.error(err);
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-lg  p-6">
			<h1 className="text-2xl font-semibold mb-4">Add Banner</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<p className="text-base font-medium">
						Banner Image (width 1920px and height 800px){" "}
					</p>
					<label className="mt-2 block cursor-pointer">
						<input
							type="file"
							accept="image/*"
							onChange={(e) => setFile(e.target.files[0])}
							hidden
						/>
						{file ? (
							<img
								src={URL.createObjectURL(file)}
								alt="banner"
								className="w-full h-48 object-cover rounded"
							/>
						) : (
							<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
								Click to select image
							</div>
						)}
					</label>
				</div>

				<div>
					<p className="text-base font-medium">Link (Optional)</p>
					<input
						type="text"
						placeholder="/all-products"
						value={link}
						onChange={(e) => setLink(e.target.value)}
						className="w-full border rounded p-2 mt-2"
					/>
				</div>

				<button
					type="submit"
					className="px-4 py-2 bg-orange-600 text-white rounded"
					disabled={loading}
				>
					{loading ? "Uploading..." : "Add Banner"}
				</button>
			</form>
		</div>
	);
};

export default AddBanner;
