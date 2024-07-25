import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home" ; 
import ListEvents from "./components/ListEvents";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ListEvents" element={<ListEvents />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

