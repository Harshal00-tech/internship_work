import React, { useState } from "react";
import { EXAMPLES } from "../data";
import TabButton from "./TabButton";

function Example() {
	const [example, setExample] = useState();

	const handleClick = (title) => {
		console.log(title);
		setExample(EXAMPLES[title.toLowerCase()]);
	};
	return (
		<section id="examples">
			<menu>
				<TabButton
					setSelected={example && example.title == "Components"}
					onClick={() => handleClick("Components")}>
					Components
				</TabButton>
				<TabButton
					setSelected={example && example.title == "JSX"}
					onClick={() => handleClick("JSX")}>
					JSX
				</TabButton>{" "}
				<TabButton
					setSelected={example && example.title == "Props"}
					onClick={() => handleClick("Props")}>
					Props
				</TabButton>{" "}
				<TabButton
					setSelected={example && example.title == "State"}
					onClick={() => handleClick("State")}>
					State
				</TabButton>
			</menu>
			{example ? (
				<div className="flex flex-col" id="tab-content">
					<h3>{example.title}</h3>
					<p>{example.description}</p>
					<pre>
						<code>{example.code}</code>
					</pre>
				</div>
			) : (
				<center id="tab-content">
					Please click on tab to see Examples.
				</center>
			)}
		</section>
	);
}

export default Example;
