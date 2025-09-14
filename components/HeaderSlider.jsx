"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const HeaderSlider = ({ banners }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		if (!banners || banners.length === 0) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % banners.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [banners]);

	if (!banners || banners.length === 0) {
		return (
			<div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px] bg-gray-200 flex items-center justify-center rounded-lg">
				No banners
			</div>
		);
	}

	return (
		<div className="relative w-full  overflow-hidden ">
			{/* Slider Track */}
			<div
				className="flex transition-transform duration-700 ease-in-out"
				style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
			>
				{banners.map((banner, idx) => (
					<Link
						key={idx}
						href={
							banner?.link && banner?.link.trim() !== ""
								? banner.link
								: "/all-products"
						}
					>
						<div className="relative w-[100vw] flex-shrink-0 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[800px]">
							{banner?.imgUrl ? (
								<Image
									src={banner.imgUrl}
									alt={banner?.title || "banner"}
									fill
									className="object-cover"
									quality={100}
									priority
								/>
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center">
									No image
								</div>
							)}
						</div>
					</Link>
				))}
			</div>

			{/* Slide Dots */}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
				{banners.map((_, idx) => (
					<button
						key={idx}
						onClick={() => setCurrentSlide(idx)}
						className={`h-3 w-3 rounded-full transition-colors duration-300 ${
							currentSlide === idx ? "bg-orange-600" : "bg-gray-400"
						}`}
					/>
				))}
			</div>
		</div>
	);
};

export default HeaderSlider;
