import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../css/FootballGamesModal.css"; // Create this CSS file for modal styling
import Wallets from "./Wallets.js";

Modal.setAppElement("#root"); // This line is necessary for accessibility reasons

const FootballGamesModal = ({ isOpen, closeModal, eventId, match }) => {
	const [homeOdds, setHomeOdds] = useState(0.0)
	const [awayOdds, setAwayOdds] = useState(0.0)
	const [drawOdds, setDrawOdds] = useState(0.0)

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
			console.log(data)
			if (data.response.length > 0){
				setHomeOdds(2 - (parseFloat(data.response[0].predictions.percent.home.replace("%", "")) / 100) + parseFloat(Math.random().toFixed(2)))
				setAwayOdds(2 - (parseFloat(data.response[0].predictions.percent.away.replace("%", "")) / 100) + parseFloat(Math.random().toFixed(2)))
				setDrawOdds(2 - (parseFloat(data.response[0].predictions.percent.draw.replace("%", "")) / 100) + parseFloat(Math.random().toFixed(2)))
			}

	}
	useEffect(() => {
		if (isOpen) {
		  getEvents()
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
			<button onClick={closeModal} className="close-button">
				&times;
			</button>
			<iframe
				src={`/widget.html?eventId=${eventId}`}
				width="100%"
				height="500px"
				title="Football Games Widget"
			></iframe>
			<p>Home Odds: {homeOdds}</p>
			<p>Away Odds: {awayOdds}</p>
			<p>Draw Odds: {drawOdds}</p>
			<Wallets match={match} />
		</Modal>
	);
};

export default FootballGamesModal;
