import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import ResultModel from "./ResultModel";

function Challenges({ title, targetTime }) {
	const time = useRef(null);
	const dialog = useRef();
	const [remainTime, setRemainTime] = useState(targetTime * 1000);
	const [timeStart, setTimeStart] = useState(false);
	const [timeExpire, setTimeEnd] = useState(false);

	const handleStart = () => {
		if (remainTime > 0 && !timeStart) {
			setTimeStart(true);
			time.current = setInterval(() => {
				setRemainTime((prevTime) => {
					if (prevTime <= 1000) {
						clearInterval(time.current);
						setTimeEnd(true);
						setTimeStart(false);
						return 0;
					}
					return prevTime - 1000;
				});
			}, 1000);
		}
	};
	const handleClose = () => {
		dialog.current.close();
	};
	useEffect(() => {
		return () => clearInterval(time.current); // Cleanup on unmount
	}, []);

	return (
		<section className="challenge">
			<h2>{title}</h2>
			{timeExpire && (
				<ResultModel
					result="lost"
					targetTime={targetTime}
					onClick={handleClose}
					ref={dialog}
				/>
				// <p>time expired.</p>
			)}
			<p className="challenge-time">
				{targetTime} second{targetTime > 1 ? "s" : ""}
			</p>
			<p>
				<button onClick={handleStart}>
					{timeStart ? "Stop" : "Start"} Challenge
				</button>
			</p>
			<p className={timeStart ? "active" : null}>
				{timeStart && "time is running..."}
			</p>
		</section>
	);
}

export default Challenges;
