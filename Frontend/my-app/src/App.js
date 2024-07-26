import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home" ; 
import ListEvents from "./components/ListEvents";
import Wallets from "./components/Wallets";
import Bets from "./components/Bets";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ListEvents" element={<ListEvents />} />
          <Route path="/Wallets" element={<Wallets />} />
          <Route path="/MyBets" element={<Bets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

