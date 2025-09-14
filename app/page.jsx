"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
	const [showQAnim, setShowQAnim] = useState(false);
	const [banners, setBanners] = useState([]);

	// Fetch banners
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

	// When intro finishes
	const handleIntroFinish = () => {
		setShowContent(true);
		setShowQAnim(true);

		// Circle duration 3.5s + tail duration 1s = 4.5s
		setTimeout(() => setShowQAnim(false), 4500);
	};

	return (
		<>
			{/* Intro animation */}
			{!showContent && <IntroAnimation onFinish={handleIntroFinish} />}

			{showContent && (
				<>
					<Navbar />

					<div className="relative z-0">
						{/* Header slider */}
						<HeaderSlider banners={banners} />

						{/* Full-page Animated Circular Q */}
						<AnimatePresence>
							{showQAnim && (
								<motion.div
									className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									<svg
										width="100vw"
										height="100vh"
										viewBox="0 0 1000 1000"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										{/* Circular Q Path */}
										<motion.circle
											cx="500"
											cy="500"
											r="300"
											stroke="rgba(255,103,0,0.8)"
											strokeWidth="25"
											strokeLinecap="round"
											fill="transparent"
											initial={{ pathLength: 0 }}
											animate={{ pathLength: 1 }}
											transition={{ duration: 3.5, ease: "easeInOut" }}
										/>

										{/* Tail of Q */}
										<motion.line
											x1="650"
											y1="650"
											x2="750"
											y2="750"
											stroke="rgba(255,103,0,0.8)"
											strokeWidth="25"
											strokeLinecap="round"
											initial={{ pathLength: 0 }}
											animate={{ pathLength: 1 }}
											transition={{
												duration: 1,
												ease: "easeInOut",
												delay: 3.5,
											}}
										/>
									</svg>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<div className="px-6 md:px-16 lg:px-32 relative z-0">
						<HomeProducts />
						<FeaturedProduct />
						<Banner />
						<NewsLetter />
					</div>

					<Footer />
				</>
			)}
		</>
	);
};

export default Home;
