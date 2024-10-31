// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [logoClassName, setLogoClassName] = useState('logo-default');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setLogoClassName('logo-scroll');
      } else {
        setLogoClassName('logo-default');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="logo" className={logoClassName} />
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Pokémon List</Link>
        <Link to="/pokemon" className="navbar-link">Gallery View</Link>
      </div>
    </nav>
  );
};

export default Navbar;