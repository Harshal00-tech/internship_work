import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function UserInput({ handleChange }) {
	const [data, setData] = useState({
		initialInvestment: 10000,
		annualInvestment: 1200,
		expectedReturn: 6,
		duration: 10,
	});
	useEffect(() => {
		handleChange(data);
	}, [data]);

	return (
		<div id="user-input">
			<div className="input-group">
				<p>
					<label>Initial Investment</label>
					<input
						type="number"
						defaultValue={data.initialInvestment}
						onChange={(e) =>
							setData((data) => {
								const updatedData = { ...data };
								updatedData.initialInvestment = Number(
									e.target.value
								);
								return updatedData;
							})
						}
					/>
				</p>
				<p>
					<label>Anual Investment</label>
					<input
						type="number"
						defaultValue={data.annualInvestment}
						onChange={(e) =>
							setData((data) => {
								const updatedData = { ...data };
								updatedData.annualInvestment = Number(
									e.target.value
								);
								return updatedData;
							})
						}
					/>
				</p>
			</div>
			<div className="input-group">
				<p>
					<label>Expected Return</label>
					<input
						type="number"
						defaultValue={data.expectedReturn}
						onChange={(e) =>
							setData((data) => {
								const updatedData = { ...data };
								updatedData.expectedReturn = Number(
									e.target.value
								);
								return updatedData;
							})
						}
					/>
				</p>
				<p>
					<label>Duration</label>
					<input
						type="number"
						defaultValue={data.duration}
						onChange={(e) =>
							setData((data) => {
								const updatedData = { ...data };
								updatedData.duration = Number(e.target.value);
								return updatedData;
							})
						}
					/>
				</p>
			</div>
		</div>
	);
}

export default UserInput;
