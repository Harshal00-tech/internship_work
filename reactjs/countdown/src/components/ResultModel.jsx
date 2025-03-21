import React from "react";

function ResultModel({ result, targetTime, onClick, ref }) {
	return (
		<dialog ref={ref} className="result-modal" onClick={onClick} open>
			<h1>You {result}</h1>
			<p>
				The target time was <strong>{targetTime} second.</strong>
			</p>
			<p>
				You stopped the timer with <strong>x second.</strong>
			</p>
			<button onClick={onClick}>Close</button>
		</dialog>
	);
}

export default ResultModel;
