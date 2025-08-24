import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Banner = () => {
	const { router } = useAppContext();
	return (
		<div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
			<Image
				className="max-w-full md:max-w-xl"
				src={assets.left}
				alt="jbl_soundbox_image"
			/>
			<div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
				<h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
					Elevate Your Wardrobe
				</h2>
				<p className="max-w-[343px] font-medium text-gray-800/60">
					From stylish Salwar Kameez to elegant Three Piece ensembles—everything
					you need to shine.
				</p>
				<button
					className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white"
					onClick={() => router.push("/all-products")}
				>
					Buy now
					<Image
						className="group-hover:translate-x-1 transition"
						src={assets.arrow_icon_white}
						alt="arrow_icon_white"
					/>
				</button>
			</div>
			<Image
				className=" md:block max-w-full"
				src={assets.right}
				alt="md_controller_image"
			/>
			{/* <Image
				className="md:hidden"
				src={assets.sm_controller_image}
				alt="sm_controller_image"
			/> */}
		</div>
	);
};

export default Banner;
