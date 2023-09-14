import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import MovieList from "./components/MovieList";
import MovieDetailsPage from "./components/MovieDetailsPage";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import "./index.css";

const API_KEY = "86ebf7fd8bd539073185a360072ca76a";
const API_URL = "https://api.themoviedb.org/3";
const TOP_MOVIES_URL = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

function App() {
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomMovie, setRandomMovie] = useState(null);

  useEffect(() => {
    async function fetchTopMovies() {
      try {
        const response = await fetch(TOP_MOVIES_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch top movies");
        }

        const data = await response.json();
        setTopMovies(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top movies:", error);
      }
    }

    fetchTopMovies();

    fetchRandomMovie();
  }, []);

  const searchMovies = async (query) => {
    try {
      const response = await fetch(
        `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch search results. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setTopMovies(data.results);
      setSearchQuery(query);
    } catch (error) {
      console.error("Error searching for movies:", error);
    }
  };

  const fetchRandomMovie = async () => {
    try {
      const response = await fetch(
        `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${
          Math.floor(Math.random() * 10) + 1
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch random movie");
      }

      const data = await response.json();
      const randomMovie =
        data.results[Math.floor(Math.random() * data.results.length)];
      setRandomMovie(randomMovie);
    } catch (error) {
      console.error("Error fetching random movie:", error);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            index
            element={
              <>
                <Banner
                  onSearch={searchMovies}
                  query={searchQuery}
                  setSearchQuery={setSearchQuery}
                  movie={randomMovie}
                  isHomePage={true}
                />
                <MovieList movies={topMovies} onSearch={searchMovies} />
              </>
            }
          />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Footer />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
