import React from "react";
import Modal from "react-modal";
import "../css/FootballGamesModal.css"; // Create this CSS file for modal styling

Modal.setAppElement("#root"); // This line is necessary for accessibility reasons

const FootballGamesModal = ({ isOpen, closeModal, eventId }) => {
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
				src={`widget.html?eventId=${eventId}`}
				width="100%"
				height="500px"
				title="Football Games Widget"
			></iframe>
		</Modal>
	);
};

export default FootballGamesModal;
