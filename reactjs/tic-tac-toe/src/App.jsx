import Player from "../components/Player";
import GameBoard from "../components/GameBoard";
import { useState } from "react";

let players = [
	{
		id: 1,
		name: "Player 1",
		symbol: "O",
	},
	{
		id: 2,
		name: "Player 2",
		symbol: "X",
	},
];

function App() {
	const [activeSymbol, setActiveSymbol] = useState("O");
	const [winner, setWinner] = useState(null);
	const handleSelect = () => {
		setActiveSymbol((activeSymbol) => (activeSymbol == "O" ? "X" : "O"));
	};
	const handleWinner = (winner) => {
		setWinner(winner);
	};
	return (
		<main>
			<div id="game-container">
				<ol id="players" className="highlight-player">
					{players.map((player) => (
						<Player
							key={player.id}
							{...player}
							activeSymbol={activeSymbol}
						/>
					))}
				</ol>
				<GameBoard
					handleSelect={handleSelect}
					activeSymbol={activeSymbol}
					handleWinner={handleWinner}
				/>
			</div>

			<p>{winner}</p>
		</main>
	);
}

export default App;
