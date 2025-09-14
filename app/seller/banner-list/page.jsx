"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BannerListPage = () => {
	const [banners, setBanners] = useState([]);
	const [loading, setLoading] = useState(false);

	// Fetch banners
	useEffect(() => {
		const fetchBanners = async () => {
			setLoading(true);
			try {
				const { data } = await axios.get("/api/banners");
				if (data.success && Array.isArray(data.banners)) {
					// Sort by position if available
					const sorted = data.banners.sort(
						(a, b) => (a.position || 0) - (b.position || 0)
					);
					setBanners(sorted);
				} else {
					setBanners([]);
				}
			} catch (err) {
				console.error(err);
				toast.error("Failed to load banners");
			} finally {
				setLoading(false);
			}
		};
		fetchBanners();
	}, []);

	// Delete banner
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this banner?")) return;
		try {
			const { data } = await axios.delete(`/api/banners?id=${id}`);
			if (data.success) {
				toast.success("Banner deleted");
				setBanners((prev) => prev.filter((b) => b._id !== id));
			} else {
				toast.error(data.message);
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete banner");
		}
	};

	// Move banner up
	const moveUp = (index) => {
		if (index === 0) return;
		const newBanners = [...banners];
		[newBanners[index - 1], newBanners[index]] = [
			newBanners[index],
			newBanners[index - 1],
		];
		setBanners(newBanners);
		savePositions(newBanners);
	};

	// Move banner down
	const moveDown = (index) => {
		if (index === banners.length - 1) return;
		const newBanners = [...banners];
		[newBanners[index + 1], newBanners[index]] = [
			newBanners[index],
			newBanners[index + 1],
		];
		setBanners(newBanners);
		savePositions(newBanners);
	};

	// Save positions to server
	const savePositions = async (bannerArray) => {
		try {
			const updated = bannerArray.map((b, i) => ({ _id: b._id, position: i }));
			const { data } = await axios.put("/api/banners/reorder", {
				banners: updated,
			});
			if (!data.success) toast.error("Failed to save order");
		} catch (err) {
			console.error(err);
			toast.error("Failed to save order");
		}
	};

	if (loading) return <p>Loading banners...</p>;
	if (!banners.length) return <p>No banners found.</p>;

	return (
		<div className="max-w-4xl p-6">
			<h1 className="text-2xl font-semibold mb-4">Banner List</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{banners.map((banner, index) => (
					<div
						key={banner._id}
						className="border p-4 rounded flex flex-col gap-2"
					>
						<img
							src={banner.imgUrl}
							alt="banner"
							className="w-full h-48 object-cover rounded"
						/>
						<p>Link: {banner.link || "/all-products"}</p>
						<div className="flex gap-2">
							<button
								onClick={() => moveUp(index)}
								disabled={index === 0}
								className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
							>
								Up
							</button>
							<button
								onClick={() => moveDown(index)}
								disabled={index === banners.length - 1}
								className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
							>
								Down
							</button>
							<button
								onClick={() => handleDelete(banner._id)}
								className="px-3 py-1 bg-red-600 text-white rounded"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default BannerListPage;
