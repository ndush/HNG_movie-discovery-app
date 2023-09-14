import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import logoImage from "../images/Logo.svg";
import watchTrailerImage from "../images/Play.svg";

const API_KEY = "86ebf7fd8bd539073185a360072ca76a";
const API_URL = "https://api.themoviedb.org/3";

function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        return response.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      });
  }, [movieId]);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div
            style={{
              textDecoration: "none",
              color: "#000",
              position: "absolute",
              top: "20px",
              left: "20px",
              display: "flex",
              alignItems: "center",
              zIndex: "1",
            }}
            onClick={handleLogoClick}
          >
            <img
              src={logoImage}
              alt="Logo"
              style={{ height: "36px", marginRight: "10px" }}
            />
          </div>

          {movie && (
            <div style={{ position: "relative" }}>
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={`${movie.title} Poster`}
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "20px" }}>
                <MovieDetails movie={movie} />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={watchTrailerImage}
                  alt="Watch Trailer"
                  style={{ height: "50px", width: "auto" }}
                />
                <div
                  style={{
                    textTransform: "uppercase",
                    marginLeft: "10px",
                    fontSize: "25px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Watch Trailer
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MovieDetailsPage;
