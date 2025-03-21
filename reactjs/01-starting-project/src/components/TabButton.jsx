import React from "react";

function TabButton({ children, onClick, setSelected }) {
	return (
		<button className={setSelected ? "active" : null} onClick={onClick}>
			{children}
		</button>
	);
}

export default TabButton;
