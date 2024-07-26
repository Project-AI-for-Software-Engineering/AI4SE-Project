import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../css/FootballGamesModal.css"; // Import the CSS file for modal styling
import Wallets from "./Wallets.js";

// Set the app element for accessibility reasons
Modal.setAppElement("#root");

const FootballGamesModal = ({ isOpen, closeModal, eventId, match }) => {
	// State variables for home, away, and draw odds
	const [homeOdds, setHomeOdds] = useState(0.0);
	const [awayOdds, setAwayOdds] = useState(0.0);
	const [drawOdds, setDrawOdds] = useState(0.0);

	// Function to fetch event data and set odds
	const getEvents = async () => {
		const url =
			"https://v3.football.api-sports.io/predictions?fixture=" + eventId;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"x-rapidapi-host": "v3.football.api-sports.io",
				"x-rapidapi-key": "f30be605903f29a8bf5195620ba8f839",
			},
		});
		const data = await response.json();
		console.log(data);
		if (data.response.length > 0) {
			// Calculate and set odds based on API response
			setHomeOdds(
				2 -
					parseFloat(
						data.response[0].predictions.percent.home.replace("%", "")
					) /
						100 +
					parseFloat(Math.random().toFixed(2))
			);
			setAwayOdds(
				2 -
					parseFloat(
						data.response[0].predictions.percent.away.replace("%", "")
					) /
						100 +
					parseFloat(Math.random().toFixed(2))
			);
			setDrawOdds(
				2 -
					parseFloat(
						data.response[0].predictions.percent.draw.replace("%", "")
					) /
						100 +
					parseFloat(Math.random().toFixed(2))
			);
		}
	};

	// useEffect hook to fetch event data when modal is opened
	useEffect(() => {
		if (isOpen) {
			getEvents();
		}
	}, [isOpen, eventId]);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="Football Games Modal"
			className="modal"
			overlayClassName="overlay"
		>
			{/* Close button for the modal */}
			<button onClick={closeModal} className="close-button">
				&times;
			</button>
			{/* Iframe to display football games widget */}
			<iframe
				src={`/widget.html?eventId=${eventId}`}
				width="100%"
				height="500px"
				title="Football Games Widget"
			></iframe>
			{/* Displaying the odds */}
			<div className="odds-container">
				<p>Home Odds: {homeOdds}</p>
				<p>Away Odds: {awayOdds}</p>
				<p>Draw Odds: {drawOdds}</p>
			</div>
			{/* Wallets component */}
			<Wallets match={match} />
		</Modal>
	);
};

export default FootballGamesModal;
