import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './GalleryView.css';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: Array<{ type: { name: string } }>;
  sprites?: {
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

interface GalleryItem {
  url: string;
  name: string;
  id: number;
  types: Array<{ type: { name: string } }>;
}

type FilterId = 'all' | '1-50' | '51-100' | '101-150' | '151-200' | '201-251';

const GalleryView: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentTypeFilter, setCurrentTypeFilter] = useState<string>('');

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=251'); 
        const results = response.data.results as Pokemon[];
        const gallery = await Promise.all(
          results.map(async (pokemon) => {
            const detailedResponse = await axios.get(pokemon.url);
            return {
              url: detailedResponse.data.sprites.other['official-artwork'].front_default,
              name: pokemon.name,
              id: Number(detailedResponse.data.id),
              types: detailedResponse.data.types,
            };
          })
        );
        setGalleryItems(gallery);
        setFilteredItems(gallery); // Initially show all items
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const applyFilter = (filterId: FilterId, type?: string) => {
    let filtered = [];
    switch (filterId) {
      case 'all':
        filtered = galleryItems;
        if (!type) {
          setCurrentTypeFilter('');
        }
        break;
      case '1-50':
        filtered = galleryItems.filter((item) => item.id <= 50);
        break;
      case '51-100':
        filtered = galleryItems.filter((item) => item.id > 50 && item.id <= 100);
        break;
      case '101-150':
        filtered = galleryItems.filter((item) => item.id > 100 && item.id <= 150);
        break;
      case '151-200':
        filtered = galleryItems.filter((item) => item.id > 150 && item.id <= 200);
        break;
      case '201-251':
        filtered = galleryItems.filter((item) => item.id > 200 && item.id <= 251);
        break;
      default:
        filtered = galleryItems;
    }
    if (type) {
      filtered = filtered.filter(item => item.types.some(t => t.type.name.toLowerCase() === type.toLowerCase()));
    }
    setFilteredItems(filtered);
    setCurrentTypeFilter(type || '');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const uniqueTypes = Array.from(new Set(galleryItems.flatMap(item => item.types.map(t => t.type.name))));

  return (
    <div className="gallery-view">
      <h1>Pokémon Gallery</h1>
      <div className="filters">
        <button onClick={() => applyFilter('all')} className="filter-button">All</button>
        <button onClick={() => applyFilter('1-50')} className="filter-button">1-50</button>
        <button onClick={() => applyFilter('51-100')} className="filter-button">51-100</button>
        <button onClick={() => applyFilter('101-150')} className="filter-button">101-150</button>
        <button onClick={() => applyFilter('151-200')} className="filter-button">151-200</button>
        <button onClick={() => applyFilter('201-251')} className="filter-button">201-251</button>
        <select onChange={(e) => applyFilter('all', e.target.value === 'All Types' ? '' : e.target.value)} value={currentTypeFilter === '' ? 'All Types' : currentTypeFilter} className="filter-button2">
          <option value="All Types">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="pokemon-grid">
        {filteredItems.map((item) => (
          <div key={item.name} className="pokemon-item">
            <Link to={`/pokemon/${item.name}`}>
              <img
                src={item.url}
                alt={item.name}
                className="gallery-image"
              />
            </Link>
            <div className="pokemon-info">
              <p>#{item.id} <br />{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;