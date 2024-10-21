import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PokemonList.css'; // 确保路径正确

interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState<'id' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchPokemons = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=251');
      const results = await Promise.all(
        response.data.results.map((pokemon: Pokemon) => pokemon.url)
      );
      const detailedPokemons = await Promise.all(
        results.map(async (url) => {
          const detailedResponse = await axios.get(url);
          return {
            ...(detailedResponse.data as Pokemon),
            id: parseInt(detailedResponse.data.id, 10), // 确保 id 是数字类型
          };
        })
      );
      setPokemons(detailedPokemons);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  // Sorting function
  const sortedPokemons = pokemons.sort((a, b) => {
    const valueA = sortField === 'id' ? a.id : a.name.toUpperCase();
    const valueB = sortField === 'id' ? b.id : b.name.toUpperCase();

    if (valueA < valueB) {
      return sortOrder ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder ? 1 : -1;
    }
    return 0;
  });

  // Filtering function
  const filteredPokemons = sortedPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="pokemon-list">
      <h1>Pokémon List</h1>
      <div className="sort-controls">
        <select value={sortField} onChange={(e) => setSortField(e.target.value as 'id' | 'name')}>
          <option value="id">ID</option>
          <option value="name">Name</option>
        </select>
        <button onClick={() => setSortOrder((prevOrder) => !prevOrder)}>
          {sortOrder ? 'Ascending' : 'Descending'}
        </button>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="pokemon-grid">
        {filteredPokemons.length === 0 ? (
          <h2>Sorry. No Pokemon matches were found.</h2>
        ) : (
          filteredPokemons.map((pokemon) => (
            <div key={pokemon.name} className="pokemon-item">
              <Link to={`/pokemon/${pokemon.name}`}>
                {pokemon.sprites?.other?.['official-artwork']?.front_default ? (
                  <img
                    src={pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                  />
                ) : (
                  pokemon.name
                )}
              </Link>
              <div className="pokemon-name">
                <p>#{pokemon.id} <br />{pokemon.name}</p> {/* 显示编号和名字 */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PokemonList;