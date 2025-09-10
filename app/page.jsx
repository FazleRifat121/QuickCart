"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
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
					<div className="px-6 md:px-16 lg:px-32">
						<HeaderSlider />
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
