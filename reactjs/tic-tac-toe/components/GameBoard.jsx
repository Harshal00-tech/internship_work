import React, { useEffect, useState } from "react";

const Board = [
	[null, null, null],
	[null, null, null],
	[null, null, null],
];

function GameBoard({ handleSelect, activeSymbol, handleWinner }) {
	const [board, setBoard] = useState(Board);
	const [winner, setWinner] = useState(null);
	const handleClick = (i, j) => {
		if (board[i][j]) return board;
		setBoard((prevBoard) => {
			const updatedBoard = prevBoard.map((row, rowIndex) =>
				rowIndex === i ? [...row] : row
			);
			updatedBoard[i][j] = activeSymbol;

			// checkGameOver(updatedBoard, activeSymbol);
			return updatedBoard;
		});
		handleSelect();
	};

	// const checkGameOver = (board, activeSymbol) => {
	//     console.log(board, activeSymbol);
	useEffect(() => {
		const winningCombinations = [
			// Rows
			[
				[0, 0],
				[0, 1],
				[0, 2],
			],
			[
				[1, 0],
				[1, 1],
				[1, 2],
			],
			[
				[2, 0],
				[2, 1],
				[2, 2],
			],
			// Columns
			[
				[0, 0],
				[1, 0],
				[2, 0],
			],
			[
				[0, 1],
				[1, 1],
				[2, 1],
			],
			[
				[0, 2],
				[1, 2],
				[2, 2],
			],
			// Diagonals
			[
				[0, 0],
				[1, 1],
				[2, 2],
			],
			[
				[0, 2],
				[1, 1],
				[2, 0],
			],
		];

		for (const combo of winningCombinations) {
			const [a, b, c] = combo;
			if (
				board[a[0]][a[1]] &&
				board[a[0]][a[1]] === board[b[0]][b[1]] &&
				board[a[0]][a[1]] === board[c[0]][c[1]]
			) {
				setWinner(board[a[0]][a[1]]);
				setBoard(Board); // Assuming this is needed
				console.log("Game winner:", board[a[0]][a[1]]);
				return;
			}
		}
	}, [activeSymbol, winner]);

	// };

	return (
		<ol id="game-board">
			{board.map((row, rowIndex) => (
				<li key={rowIndex}>
					<ol>
						{row.map((symbol, index) => (
							<button
								onClick={() => {
									handleClick(rowIndex, index);
									handleWinner(winner);
								}}
								key={index}>
								{symbol}
							</button>
						))}
					</ol>
				</li>
			))}
		</ol>
	);
}

export default GameBoard;
