import React from "react";
import { CORE_CONCEPTS } from "../data";

function ConceptItem({ image, title, description }) {
	return (
		<li className="core-concepts">
			<img src={image} />
			<h3>{title}</h3>
			<p>{description}</p>
		</li>
	);
}

function CoreConcept() {
	return (
		<section id="core-concepts">
			<h2>Time to get started!</h2>
			<ul>
				{CORE_CONCEPTS.map((item) => (
					<ConceptItem key={item.title} {...item} />
				))}
			</ul>
		</section>
	);
}

export default CoreConcept;
