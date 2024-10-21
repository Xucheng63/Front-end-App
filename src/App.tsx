// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from './PokemonList';
import DetailView from './DetailView';
import GalleryView from './GalleryView';
import Navbar from './Navbar';
import Footer from './Footer'; // 引入 Footer 组件
import './Footer.css'; // 确保路径正确
import './Navbar.css'; // 确保路径正确

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* 在页面顶部添加 Navbar 组件 */}
        <Routes>
          <Route path="/mp2" element={<PokemonList />} />
          <Route path="/mp2/pokemon/:name" element={<DetailView />} />
          <Route path="/mp2/pokemon" element={<GalleryView />} />
        </Routes>
        <Footer /> {/* 在页面底部添加 Footer 组件 */}
      </div>
    </Router>
  );
}

export default App;