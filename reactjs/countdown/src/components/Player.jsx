import { useState } from "react";
import { useRef } from "react";

export default function Player() {
	const name = useRef();
	const [currentName, setName] = useState();

	return (
		<section id="player">
			<h2>Welcome {currentName ?? "unknown entity."}</h2>
			<p>
				<input ref={name} type="text" />
				<button onClick={() => setName(name.current.value)}>
					Set Name
				</button>
			</p>
		</section>
	);
}
