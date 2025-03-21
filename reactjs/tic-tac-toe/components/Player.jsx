import React, { useState } from "react";

function Player({ name, symbol, activeSymbol }) {
	const [isEdit, setIsEdit] = useState(false);
	const [playerName, setPlayerName] = useState(name);
	const handleEdit = (event) => {
		setPlayerName(event.target.value);
	};

	return (
		<li className={activeSymbol == symbol ? "active" : "player"}>
			{isEdit ? (
				<input
					type="text"
					onChange={handleEdit}
					defaultValue={playerName}
				/>
			) : (
				<span className="player-name">{playerName}</span>
			)}
			<span className="player-symbol">{symbol}</span>
			<button
				onClick={() => setIsEdit((isEdit) => !isEdit)}
				type="button">
				{isEdit ? "SAVE" : "EDIT"}
			</button>
		</li>
	);
}

export default Player;
