

import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import "./App.css";

const API_KEY = "21955953";


const defaultIds = [
  "tt15398776", // Oppenheimer (2023)
  "tt1517268",  // Barbie (2023)
  "tt15239678", // Dune: Part Two (2024)
  "tt6263850",  // Deadpool & Wolverine (2024)
  "tt13186482", // Jawan (2023)
  "tt12676892", // Pathaan (2023)
  "tt14696192", // Dunki (2023)
  "tt26739952", // Stree 2 (2024)
];
function App() {
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    loadDefaultMovies();
  }, []);

  async function loadDefaultMovies() {
    setLoading(true);
    setError("");

    try {
      const requests = defaultIds.map((id) =>
        fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`).then((r) =>
          r.json()
        )
      );

      const results = await Promise.all(requests);
      const valid = results.filter((m) => m.Response === "True");
      setMovies(valid);
    } catch (e) {
      setError("Couldn't load movies. Check your API key or internet connection.");
    } finally {
      setLoading(false);
    }
  }
  async function handleSearch() {
    const query = searchInput.trim();
    if (!query) return; 
    setLoading(true);
    setError("");
    setMovies([]);
    setHasSearched(true);

    try {
      const searchRes = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`
      );
      const searchData = await searchRes.json();

      if (searchData.Response === "False") {
        setError(searchData.Error || "No results found.");
        setLoading(false);
        return;
      }
      const top8 = searchData.Search.slice(0, 8);

      const detailRequests = top8.map((m) =>
        fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${API_KEY}`).then(
          (r) => r.json()
        )
      );
      const detailed = await Promise.all(detailRequests);
      const valid = detailed.filter((m) => m.Response === "True");

      setMovies(valid);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }
  return (
    <div className="app">
      <header className="app-header">
        <h1>Movie Search</h1>
        <p>Find movies and check their ratings</p>
      </header>
      <div className="search-row">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      

      {loading && <p className="status-text">Loading...</p>}

      {!loading && error && <p className="status-text error-text">{error}</p>}

      {!loading && !error && hasSearched && movies.length === 0 && (
        <p className="status-text">No movies found. Try a different title.</p>
      )}

      {!loading && !error && !hasSearched && (
        <p className="section-label">Recent Popular Movies</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
