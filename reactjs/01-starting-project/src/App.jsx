import { CORE_CONCEPTS, EXAMPLES } from "./data";
import TabButton from "./components/TabButton";
import { useState } from "react";
import Example from "./components/Example";
import Header from "./components/Header";
import CoreConcept from "./components/CoreConcept";

function App() {
	return (
		<div>
			<Header />
			<main>
				<CoreConcept />
				<Example />
			</main>
		</div>
	);
}

export default App;
