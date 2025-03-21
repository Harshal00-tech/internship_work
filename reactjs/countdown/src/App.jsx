import Challenges from "./components/Challenges.jsx";
import Player from "./components/Player.jsx";

function App() {
	return (
		<>
			<Player />
			<div id="challenges">
				<Challenges title="Easy" targetTime={1} />
				<Challenges title="Not Easy" targetTime={5} />
				<Challenges title="Getting Tough" targetTime={10} />{" "}
				<Challenges title="Pros only" targetTime={15} />
			</div>
		</>
	);
}

export default App;
