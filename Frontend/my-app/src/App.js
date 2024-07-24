import React from "react";
import FootballGamesModal from "./components/FootballGamesModal";

const App = () => {
	const eventId = "12345"; // Replace with your actual event ID

	return (
		<div className="App">
			<h1>Football Games Widget</h1>
			<FootballGamesModal eventId={eventId} />
		</div>
	);
};

export default App;
