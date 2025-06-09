import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TaxListEdit from './components/TaxListEdit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tax/edit/:id" element={<TaxListEdit />} />
      </Routes>
    </Router>
  );
};

export default App;