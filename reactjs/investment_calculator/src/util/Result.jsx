import React from "react";

function Result({ data }) {
	console.log(data);
	if (data == undefined) {
		return <p>Not any data available.</p>;
	}
	return (
		<table id="result">
			<thead>
				<tr className="center">
					<th>Year</th>
					<th>investment Value</th>
					<th>Total intrest</th>
					<th>Invested Table</th>
				</tr>
			</thead>

			<tbody>
				{data.map((item) => (
					<tr
						key={`${item.year} + ${item.valueEndOfYear}`}
						className="center
        ">
						<td>{item.year}</td>
						<td>{item.interest}</td>
						<td>{item.valueEndOfYear}</td>
						<td>{item.annualInvestment}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default Result;
