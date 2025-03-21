import React, { useEffect, useState } from "react";

function Cart() {
	const [products, setProduct] = useState([]);
	useEffect(() => {
		let res = localStorage.getItem("products");
		setProduct(JSON.parse(res));
	}, []);
	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4 text-center">Your Cart</h1>

			{products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 transition hover:shadow-xl">
							<img
								src={product.thumbnail}
								alt="Product image missing!"
								className="w-full h-40 object-cover rounded-md"
							/>
							<h2 className="text-lg font-semibold text-gray-800 mt-3">
								{product.title}
							</h2>
							<div className="mt-2 text-gray-600">
								<p>Quantity: {product.quantity}</p>
								<p>Price: ${product.price}</p>
								<p>Discount: {product.discountPercentage}%</p>
								<p>Final Price: ${product.discountedTotal}</p>
							</div>
							<p className="mt-3 font-bold text-gray-900">
								Total: ${product.total}
							</p>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500 mt-6">
					No products in the cart.
				</p>
			)}
		</div>
	);
}

export default Cart;
