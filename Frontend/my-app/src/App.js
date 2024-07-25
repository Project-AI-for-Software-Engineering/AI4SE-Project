// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ListEvents from './components/ListEvents';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ListEvents" element={<ListEvents />} />
      </Routes>
    </Router>
  );
};

export default App;


