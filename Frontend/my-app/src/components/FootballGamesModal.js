import React, { useState } from "react";
import Modal from "react-modal";
import "../css/FootballGamesModal.css"; // Create this CSS file for modal styling

const FootballGamesModal = ({ eventId }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	return (
		<div>
			<button onClick={openModal}>Bet/Details</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Football Games Modal"
				className="modal"
				overlayClassName="overlay"
			>
				<button onClick={closeModal} className="close-button">
					&times;
				</button>
				<iframe
					src={`widget.html?eventId=33`}
					width="100%"
					height="500px"
					title="Football Games Widget"
				></iframe>
			</Modal>
		</div>
	);
};

export default FootballGamesModal;
