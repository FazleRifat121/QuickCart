import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import GoToTopButton from "@/components/GoToTopButton";
import WhatsAppButton from "@/components/WhatsAppButton"; // Create a client component for WhatsApp

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
	title: "QuickCart - Fazle",
	description: "E-Commerce with Next.js",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${outfit.className} antialiased text-gray-700`}>
					<Toaster />
					<AppContextProvider>
						{children}
						<GoToTopButton />
						<WhatsAppButton /> {/* Only this is client-side */}
					</AppContextProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
