import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [carts, setCarts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCarts = async () => {
			try {
				setLoading(true);
				const response = await fetch("https://dummyjson.com/carts");
				if (!response.ok) throw new Error("Failed to fetch carts");

				const data = await response.json();
				setCarts(data.carts);
			} catch (err) {
				setError(err.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};
		fetchCarts();
	}, []);

	const handleClick = (products) => {
		localStorage.setItem("products", JSON.stringify(products));
		navigate("/cart");
	};
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg font-semibold text-gray-700 animate-pulse">
					Loading...
				</p>
			</div>
		);
	}
	if (error) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg font-semibold text-red-600">{error}</p>
			</div>
		);
	}

	return (
		<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{carts.map((cart) => (
				<div
					className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300"
					key={cart.id}>
					<h2 className="text-lg font-bold text-gray-800 mb-2">
						User ID: {cart.userId}
					</h2>

					<div className="mt-4 flex justify-between items-center">
						<span className="text-md font-bold text-gray-900">
							Total: ${cart.discountedTotal}
						</span>
						<button
							className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black transition duration-300"
							onClick={() => handleClick(cart.products)}
							aria-label="View Cart">
							VIEW CART
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
