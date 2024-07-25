import React, { useEffect, useState } from "react";
import "../css/ListEvents.css";
import FootballGamesModal from "./FootballGamesModal";

function ListEvents() {
	const cantEventsPag = 10;
	const sports = ["football", "basketball"];
	const [sport, setSport] = useState(sports[0]);
	const [date, setDate] = useState(getCurrentDate());
	const validSport = ["football"].includes(sport);
	const [events, setEvents] = useState([]);
	const [pag, setPag] = useState(0);
	const [maxPag, setMaxPag] = useState(0);
	const [originalEvents, setOriginalEvents] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedEventId, setSelectedEventId] = useState(null);
	const [pred, setPred] = useState("");

	const handleSportChange = (e) => {
		setSport(e);
		getEvents();
	};

	const order_events = (order) => {
		setPag(0);
		let sortedEvents = [...events];

		if (order === "1") {
			sortedEvents.sort((a, b) => a.fixture.popularity - b.fixture.popularity);
		} else if (order === "2") {
			sortedEvents.sort((a, b) => b.fixture.popularity - a.fixture.popularity);
		} else {
			sortedEvents = [...originalEvents];
		}

		setEvents(sortedEvents);
	};

	function addPag() {
		setPag((pag + 1) % maxPag);
	}

	function subPag() {
		if (pag === 0) {
			return;
		}
		setPag((pag - 1) % maxPag);
	}

	function isDateAfterOrEqualToday(dateString) {
		const today = new Date();
		const inputDate = new Date(
			dateString.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
		);
		today.setHours(0, 0, 0, 0);
		inputDate.setHours(0, 0, 0, 0);
		if (inputDate === today) {
			return false;
		}

		return inputDate.setDate(inputDate.getDate() + 1) < today;
	}

	function obtenerPopularidad(cadena, minVal = 1, maxVal = 100) {
		function hashString(str) {
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				const char = str.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash |= 0; // Convert to 32bit integer
			}
			return hash;
		}

		const hash = hashString(cadena);
		const range = maxVal - minVal + 1;
		return minVal + (Math.abs(hash) % range);
	}

	const handleDateChange = (e) => {
		setDate(e);
		getEvents();
	};

	const callLLM = async (team1_id, team2_id, league) => {
		console.log(team1_id, team2_id, league);
		const url = "http://127.0.0.1:8000/api/v1/match-analysis/";
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ team1_id, team2_id, league }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setPred(data.analysis);
			console.log("pred: " + data.analysis);
		} catch (error) {
			console.error("Failed to fetch data:", error);
			setPred("Failed to fetch prediction data.");
		}
	};

	function getCurrentDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	}

	const getEvents = async () => {
		setPag(0);
		if (validSport) {
			const url =
				"https://v3." + sport + ".api-sports.io/fixtures?date=" + date;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"x-rapidapi-host": "v3.football.api-sports.io",
					"x-rapidapi-key": "f14603dd89062225cd14d52269234f84",
				},
			});
			const data = await response.json();

			for (let i = 0; i < data.response.length; i++) {
				data.response[i].fixture.popularity = obtenerPopularidad(
					data.response[i].teams.home.name + data.response[i].teams.away.name
				);
			}

			setEvents(data["response"]);
			setOriginalEvents(data["response"].slice());
			setMaxPag(Math.ceil(data.response.length / cantEventsPag));
		} else {
			setEvents([]);
			setOriginalEvents([]);
			setMaxPag(0);
		}
	};

	useEffect(() => {
		getEvents();
	}, []);

	const openModal = (eventId) => {
		setSelectedEventId(eventId);
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
		setSelectedEventId(null);
	};

	return (
		<div>
			<div className="div-page">
				<p className="p-events">
					Current Page: {pag + 1}/{maxPag}
				</p>
				<button className="button-events" onClick={subPag}>
					Previous Page
				</button>
				<button className="button-events" onClick={addPag}>
					Next Page
				</button>
			</div>
			<div className="div-events">
				<div className="sub-div-events">
					<p className="p-events">Sport:</p>
					<select
						className="form-sport-events"
						value={sport}
						onChange={(e) => handleSportChange(e.target.value)}
					>
						<option value="" disabled></option>
						{sports.map((s) => (
							<option key={s} value={s}>
								{s.toUpperCase()}
							</option>
						))}
					</select>
				</div>

				<div className="sub-div-events">
					<p className="p-events">Date:</p>
					<input
						className="input-to-events"
						placeholder="Date"
						type="date"
						onChange={(event) => handleDateChange(event.target.value)}
						value={date}
					></input>
				</div>
			</div>
			<div className="div-page">
				<p className="p-events">Order by:</p>
				<select onChange={(e) => order_events(e.target.value)}>
					<option key="Original Order" value="3">
						Original Order
					</option>
					<option key="Ascending" value="1">
						Ascending
					</option>
					<option key="Descending" value="2">
						Descending
					</option>
				</select>
			</div>

			<div className="div-prediccion">
				<p className="p-events">Prediction: </p>
				<div className="fixed-text">{pred}</div>
			</div>

			<table className="table-events">
				<thead className="thead-events">
					<tr className="tr-events">
						<th className="th-events">Date</th>
						<th className="th-events">State</th>
						<th className="th-events">Logos</th>
						<th className="th-events">Teams</th>
						<th className="th-events">Score</th>
						<th className="th-events">League Logo</th>
						<th className="th-events">League</th>
						<th className="th-events">Popularity</th>
						<th className="th-events">Bet/Details</th>
						<th className="th-events">Prediction</th>
					</tr>
				</thead>
				<tbody className="tbody-events">
					{events
						.slice(pag * cantEventsPag, pag * cantEventsPag + cantEventsPag)
						.map((e) => (
							<tr key={e.fixture.id}>
								<td className="td-events">
									{e["fixture"]["date"].split("T")[0]}
								</td>
								<td className="td-events">{e["fixture"]["status"]["short"]}</td>
								<td className="td-events">
									<img
										loading="lazy"
										src={e["teams"]["home"]["logo"]}
										className="img-events"
										alt="logo"
									></img>
									<img
										loading="lazy"
										src={e["teams"]["away"]["logo"]}
										className="img-events"
										alt="logo"
									></img>
								</td>
								<td className="td-events">
									<p
										style={{
											fontWeight: e["teams"]["home"]["winner"]
												? "bold"
												: "normal",
										}}
									>
										{e["teams"]["home"]["name"]}
									</p>
									<p
										style={{
											fontWeight: e["teams"]["away"]["winner"]
												? "bold"
												: "normal",
										}}
									>
										{e["teams"]["away"]["name"]}
									</p>
								</td>
								<td className="td-events">
									<p className="sub-p-events">{e["goals"]["home"]}</p>
									<p className="sub-p-events">{e["goals"]["away"]}</p>
								</td>
								<td className="td-events">
									<img
										loading="lazy"
										src={e["league"]["logo"]}
										className="img-events"
										alt="logo"
									></img>
								</td>
								<td className="td-events">
									<p className="sub-p-events">{e["league"]["name"]}</p>
								</td>
								<td className="td-events">
									<p className="sub-p-events">{e["fixture"]["popularity"]}</p>
								</td>
								<td className="td-events">
									<button
										className="button-events"
										disabled={isDateAfterOrEqualToday(
											e["fixture"]["date"].split("T")[0]
										)}
										onClick={() => openModal(e.fixture.id)}
									>
										Bet/Details
									</button>
								</td>
								<td className="td-events">
									<input
										onClick={() =>
											callLLM(
												e["teams"]["home"]["id"],
												e["teams"]["away"]["id"],
												e["league"]["id"]
											)
										}
										className="tip-events"
										type="image"
										alt="img"
										src="https://icons.veryicon.com/png/o/miscellaneous/monochromatic-linear-icon-for-the-project-of/tips-22.png"
									></input>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<div className="div-page">
				<p className="p-events">
					Current Page: {pag + 1}/{maxPag}
				</p>
				<button className="button-events" onClick={subPag}>
					Previous Page
				</button>
				<button className="button-events" onClick={addPag}>
					Next Page
				</button>
			</div>
			<FootballGamesModal
				isOpen={modalIsOpen}
				closeModal={closeModal}
				eventId={selectedEventId}
			/>
		</div>
	);
}

export default ListEvents;
