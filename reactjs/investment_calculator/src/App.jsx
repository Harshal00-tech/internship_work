import UserInput from "./util/UserInput";
import Result from "./util/Result";
import { calculateInvestmentResults } from "./util/investment";
import { useState } from "react";

function App() {
	const [calculatedData, setCalculatedData] = useState();
	const handleChange = (data) => {
		setCalculatedData(calculateInvestmentResults(data));
	};

	return (
		<>
			<UserInput handleChange={handleChange} />
			<Result data={calculatedData} />
		</>
	);
}

export default App;
