import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CardMedia,
  CardContent,
} from '@mui/material';
import './DetailView.css';

interface Pokemon {
  id: string;
  name: string;
  height: number;
  weight: number;
  abilities: Array<{ ability: { name: string } }>;
  types: Array<{ type: { name: string } }>;
  sprites?: {
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

const DetailView: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get<{ results: Pokemon[] }>('https://pokeapi.co/api/v2/pokemon/?limit=251');
        const sortedList = response.data.results.sort((a: Pokemon, b: Pokemon) => parseInt(a.id) - parseInt(b.id));
        setPokemonList(sortedList);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();

    if (pokemonList.length > 0) {
      const index = pokemonList.findIndex((poke) => poke.name === name);
      setCurrentIndex(index);
    }
  }, [name, pokemonList]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % pokemonList.length;
    const nextPokemon = pokemonList[nextIndex];
    navigate(`/pokemon/${nextPokemon.name}`);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
    const prevPokemon = pokemonList[prevIndex];
    navigate(`/pokemon/${prevPokemon.name}`);
  };

  const getTypeClass = (type: string) => `type-${type.toLowerCase()}`;

  return (
    <div className="pokemon-detail-container">
      <h1>Pokemon information</h1>
      {pokemon && (
        <Container>
          <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
            <Grid item xs={12} md={5}>
              <CardMedia
                component="img"
                className="pokemon-imag"
                height="300"
                image={pokemon.sprites?.other?.['official-artwork']?.front_default || 'https://via.placeholder.com/300'}
                alt={pokemon.name}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <CardContent className="pokemon-infor">
                <Typography gutterBottom variant="h5" component="div">
                  {pokemon.name} #{pokemon.id}
                </Typography>
                <Typography variant="body1" color="red">
                  Height: {pokemon.height} m
                </Typography>
                <Typography variant="body1" color="red">
                  Weight: {pokemon.weight} kg
                </Typography>
                <Divider />
                <Typography variant="h6" gutterBottom>
                  Abilities
                </Typography>
                <List>
                  {pokemon.abilities.map((ability, index) => (
                    <div className='fontsize'>
                    <ListItem key={index} className="pokemon-ability">
                      <ListItemText primary={ability.ability.name} />
                    </ListItem></div>
                  ))}
                </List>
                <Typography variant="h6" gutterBottom>
                  Types
                </Typography>
                <List>
                  {pokemon.types.map((type, index) => (
                    <div key={index} className={getTypeClass(type.type.name)}>
                      <ListItem className="pokemon-type">
                        <ListItemText primary={type.type.name} />
                      </ListItem>
                    </div>
                  ))}
                </List>
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <div className="pokemon-buttons">
                <Button onClick={handlePrev} variant="outlined" className="button">
                  Previous
                </Button>
                <Button onClick={handleNext} variant="outlined" className="button">
                  Next
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default DetailView;