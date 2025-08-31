"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
	const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";
	const router = useRouter();
	const { user } = useUser();
	const { getToken } = useAuth();

	const [products, setProducts] = useState([]);
	const [userData, setUserData] = useState(null);
	const [isSeller, setIsSeller] = useState(false);
	const [cartItems, setCartItems] = useState({});
	const [wishlist, setWishlist] = useState([]);

	const [orders, setOrders] = useState([]);

	// -------- PRODUCTS --------
	const fetchProductData = async () => {
		try {
			const { data } = await axios.get("/api/product/list");
			if (data.success) setProducts(data.products);
		} catch (err) {
			toast.error(err.message || "Failed to fetch products");
		}
	};

	// -------- USER DATA --------
	const fetchUserData = async () => {
		try {
			if (user?.publicMetadata?.role === "seller") setIsSeller(true);

			const token = await getToken();
			const { data } = await axios.get("/api/user/data", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setUserData(data.user);
				setCartItems(data.user.cartItems || {});
				setWishlist(data.user.wishlist || []);
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	// -------- ORDERS --------
	const fetchOrders = async () => {
		if (!user) return;
		try {
			const token = await getToken();
			const { data } = await axios.get("/api/order/list", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				// ✅ Map backend order.items to frontend-friendly format
				const mappedOrders = data.orders.map((order) => ({
					_id: order._id,
					amount: order.amount,
					status: order.status,
					items: order.items.map((item) => ({
						productId: item.product?._id || "",
						name: item.product?.name || "Unknown Product",
						quantity: item.quantity,
					})),
				}));
				setOrders(mappedOrders.reverse());
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	// -------- CART --------
	const addToCart = async (itemId) => {
		const updatedCart = { ...cartItems };
		updatedCart[itemId] = updatedCart[itemId] ? updatedCart[itemId] + 1 : 1;
		setCartItems(updatedCart);

		if (user) {
			try {
				const token = await getToken();
				await axios.post(
					"/api/cart/update",
					{ cartData: updatedCart },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				toast.success("Item added to cart");
			} catch (err) {
				toast.error(err.message || "Failed to update cart");
			}
		}
	};

	const getCartCount = () =>
		Object.values(cartItems).reduce((sum, q) => sum + q, 0);

	const getCartAmount = () =>
		Math.floor(
			Object.entries(cartItems).reduce((total, [id, qty]) => {
				const p = products.find((prod) => prod._id === id);
				return p ? total + p.offerPrice * qty : total;
			}, 0) * 100
		) / 100;

	// -------- WISHLIST --------
	const toggleWishlist = async (product) => {
		if (!product || !product._id) return; // ✅ ignore invalid entries

		const exists = wishlist.some((p) => p && p._id === product._id);
		const updated = exists
			? wishlist.filter((p) => p && p._id !== product._id)
			: [...wishlist.filter(Boolean), product]; // remove nulls

		setWishlist(updated);

		if (user) {
			try {
				const token = await getToken();
				await axios.post(
					"/api/wishlist/update",
					{ wishlist: updated.map((p) => p._id) },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
			} catch (err) {
				console.log("Wishlist DB update error:", err.message);
			}
		} else {
			localStorage.setItem("wishlist", JSON.stringify(updated));
		}
	};
	// -------- Local Wishlist --------
	useEffect(() => {
		const loadWishlist = async () => {
			if (user) {
				await fetchUserData();
				try {
					const token = await getToken();
					const res = await fetch("/api/wishlist/get", {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await res.json();
					if (data.success)
						setWishlist(Array.isArray(data.wishlist) ? data.wishlist : []);
				} catch (err) {
					console.log("Wishlist fetch error:", err.message);
				}
			} else {
				const stored = localStorage.getItem("wishlist");
				setWishlist(stored ? JSON.parse(stored) : []);
			}
		};
		loadWishlist();
	}, [user]);

	// -------- CART QUANTITY UPDATE --------
	const updateCartQuantity = async (itemId, quantity) => {
		const updatedCart = { ...cartItems };
		if (quantity <= 0) delete updatedCart[itemId];
		else updatedCart[itemId] = quantity;
		setCartItems(updatedCart);

		if (user) {
			try {
				const token = await getToken();
				await axios.post(
					"/api/cart/update",
					{ cartData: updatedCart },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				toast.success("Cart updated");
			} catch (err) {
				toast.error(err.message || "Failed to update cart");
			}
		}
	};

	// -------- EFFECTS --------
	useEffect(() => {
		fetchProductData();
	}, []);

	useEffect(() => {
		if (user) {
			fetchUserData();
			fetchOrders();
		}
	}, [user]);

	const value = {
		user,
		getToken,
		currency,
		router,
		isSeller,
		setIsSeller,
		userData,
		products,
		cartItems,
		wishlist,
		orders,
		updateCartQuantity,
		setCartItems,
		addToCart,
		getCartCount,
		getCartAmount,
		toggleWishlist,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
