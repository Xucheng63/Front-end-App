// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from './PokemonList';
import DetailView from './DetailView';
import GalleryView from './GalleryView';
import Navbar from './Navbar';
import Footer from './Footer'; 
import './Footer.css'; 
import './Navbar.css'; 

function App() {
  return (
    <Router>
      <div>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:name" element={<DetailView />} />
          <Route path="/pokemon" element={<GalleryView />} />
        </Routes>
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;