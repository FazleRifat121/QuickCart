"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import IntroAnimation from "@/components/IntroAnimation";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
	const [showContent, setShowContent] = useState(false);
	const [banners, setBanners] = useState([]);

	// Fetch banners from API
	useEffect(() => {
		const fetchBanners = async () => {
			try {
				const { data } = await axios.get("/api/banners");
				if (data.success && Array.isArray(data.banners)) {
					setBanners(data.banners);
				}
			} catch (err) {
				console.error("Failed to fetch banners:", err);
			}
		};
		fetchBanners();
	}, []);

	return (
		<>
			{!showContent && <IntroAnimation onFinish={() => setShowContent(true)} />}

			{showContent && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, ease: "easeOut" }}
				>
					<Navbar />
					<HeaderSlider banners={banners} />
					<div className="px-6 md:px-16 lg:px-32">
						{/* Pass banners here */}

						<HomeProducts />
						<FeaturedProduct />
						<Banner />
						<NewsLetter />
					</div>
					<Footer />
				</motion.div>
			)}
		</>
	);
};

export default Home;
