import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListEvents from "./components/ListEvents";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<div>
				<Routes>
					<Route path="/" element={<Navigate to="/home" />} />
					<Route path="/ListEvents" element={<ListEvents />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
