import React, { useEffect, useState } from "react";
import "../css/ListEvents.css";
import FootballGamesModal from "./FootballGamesModal";
import api from './api';
function Bets() {
	const cantEventsPag = 10;
	const sports = ["football", "basketball"];
	const [sport, setSport] = useState(sports[0]);
	const [date, setDate] = useState(getCurrentDate());
	const validSport = ["football"].includes(sport);
	const [bets, setBets] = useState(["No bets"]);
	const [pag, setPag] = useState(0);
	const [maxPag, setMaxPag] = useState(0);
	const [originalEvents, setOriginalEvents] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedEventId, setSelectedEventId] = useState(null);
	const [pred, setPred] = useState("");
	const [matchInfo, setMatchInfo]= useState([]);
    const [balance,  setBalance]= useState(0);

	const handleSportChange = (e) => {
		setSport(e);
		//getEvents();
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

    const getBalance = async () => {
        if (!1) {
          console.error('El ID del usuario no puede estar vacío');
          return;
        }
        try {
          const response = await api.get(`/wallets/${1}/balance/`);
          console.log(response.data);
          console.log("Nuevo balance");
          console.log(response.data.balance);
          setBalance(response.data.balance)
        } catch (error) {
          console.error('Error en el status de la billetera:', error);
        }
      };

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
		//getEvents();
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

	const getBets = async () => {
	
        try {
            const response = await api.get(`/wallets/${1}/history/`);
            console.log("-----MY BETS ------")
            console.log(response.data.bets);
           // const data = await response.json();
            //console.log(data)
            setBets(response.data.bets)
            console.log("Apuestas seteadas")
          } catch (error) {
            console.error('Error recargando la billetera:', error);
          }
		
	};

	useEffect(() => {
		getBets();
        getBalance();
	}, []);

	const openModal = (eventId, match) => {
		setSelectedEventId(eventId);
		setMatchInfo(match)
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
		setSelectedEventId(null);
	};

	return (
		<div>

			<div className="div-events">


				<div className="sub-div-events">
                <p className="p-events">My balance: </p>
                {balance}
					<p className="p-events">My recent bets: </p>
		
				</div>
			</div>
			<table className="table-events">
				<thead className="thead-events">
					<tr className="tr-events">
                        <th className="th-events">Event id</th>
						<th className="th-events">Home</th>
						<th className="th-events">Away</th>
						<th className="th-events">Bet amount</th>
						<th className="th-events">Bet</th>
						<th className="th-events">Result</th>
					</tr>
				</thead>
				<tbody className="tbody-events">
					{bets
						.map((e) => (
							<tr key={e}>
							
								<td className="td-events">{e["eventId"]}</td>
								<td className="td-events">{e["home"]}</td>
								<td className="td-events">{e["away"]}</td>
								<td className="td-events">{e["amount"]}</td>
								<td className="td-events">{e["bet"]}</td>
								<td className="td-events">{e["result"]}</td>
							
							</tr>
						))}
				</tbody>
			</table>

		</div>
	);
}

export default Bets;
