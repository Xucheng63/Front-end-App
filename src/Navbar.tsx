// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand"><img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="logo" /></div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Pokémon List</Link>
        <Link to="/pokemon" className="navbar-link">Gallery View</Link>
      </div>
    </nav>
  );
};

export default Navbar;