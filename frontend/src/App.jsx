import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StockDetails from './components/StockDetails';
import { TrendingUp, LayoutDashboard, Search, Github } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0c0e12]">
        <nav className="glass-card sticky top-4 mx-4 my-4 p-4 z-50 flex items-center justify-between border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="text-blue-500" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              NiftyScope
            </h1>
          </div>

          <div className="flex gap-6 items-center">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <Github size={18} />
              Source
            </a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock/:symbol" element={<StockDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
