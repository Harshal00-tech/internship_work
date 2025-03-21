import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="bg-white-300 text-black py-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center px-4">
				<h1 className="text-2xl font-bold">🛍️ Shopping Cart</h1>
				<nav>
					<ul className="flex space-x-6">
						<li>
							<Link to="/" className="hover:underline">
								Home
							</Link>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Products
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Cart
							</a>
						</li>
						<li>
							<a href="#" className="hover:underline">
								Contact
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
