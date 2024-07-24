import React, { useEffect } from "react";
import "../css/ModalDetailEvent.css";

const Modal = ({ show, onClose, fixtureId }) => {
	useEffect(() => {
		if (show) {
			const widgetContainer = document.getElementById("wg-api-football-game");
			if (widgetContainer) {
				widgetContainer.setAttribute("data-id", fixtureId);
			}

			const script = document.createElement("script");
			script.src = "https://widgets.api-sports.io/2.0.3/widgets.js";
			script.type = "module";
			script.async = true;
			script.onload = () => {
				const event = new CustomEvent("reinitializeWidget");
				document.dispatchEvent(event);
			};
			document.body.appendChild(script);

			return () => {
				document.body.removeChild(script);
				if (widgetContainer) {
					widgetContainer.innerHTML = "";
				}
			};
		}
	}, [show, fixtureId]);

	if (!show) {
		return null;
	}

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<button className="modal-close" onClick={onClose}>
					Close
				</button>
				<div
					id="wg-api-football-game"
					data-host="v3.football.api-sports.io"
					data-key="f30be605903f29a8bf5195620ba8f839"
					data-id="718243"
					data-theme=""
					data-refresh="15"
					data-show-errors="false"
					data-show-logos="true"
				></div>
			</div>
		</div>
	);
};

export default Modal;
