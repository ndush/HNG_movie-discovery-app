import React, { useState } from "react";
import logoImage from "../images/Logo.svg";
import signInImage from "../images/Menu.svg";
import playButtonImage from "../images/Play.svg";

function Banner({ onSearch, query, setSearchQuery, movie, isHomePage }) {
  const [bannerSize, setBannerSize] = useState("large");

  const handleSearch = () => {
    const searchTerm = document.getElementById("searchInput").value;
    onSearch(searchTerm);
    setBannerSize("small");
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div>
      {isHomePage && movie && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: bannerSize === "large" ? "900px" : "200px",
            backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.poster_path}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "22px",
              left: "20px",
              cursor: "pointer",
            }}
            onClick={handleLogoClick}
          >
            <img
              src={logoImage}
              alt="Logo"
              style={{ height: "36px", marginRight: "10px" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: "22px",
              right: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "18px", color: "#fff" }}>Sign In</span>
            <img
              src={signInImage}
              alt="Sign In"
              style={{ height: "24px", marginLeft: "10px" }}
            />
          </div>

          <div>
            <input
              id="searchInput"
              type="text"
              placeholder="What do you want to watch?"
              value={query}
              onChange={handleInputChange}
              style={{
                width: "525px",
                height: "25px",
                top: "22px",
                left: "493px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "2px solid white",
                position: "absolute",
                paddingRight: "40px",
                background: "rgba(255, 255, 255, 0.5)",
                color: "white",
                transition: "border-color 0.2s",
              }}
            />
            <i
              className="fa fa-search"
              style={{
                position: "absolute",
                top: "35px",
                right: "600px",
                fontSize: "24px",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={handleSearch}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              color: "#fff",
              maxWidth: "70%",
              padding: "10px",
              borderRadius: "6px",
              width: "404px",
              top: "400px",
              left: "98px",
              gap: "16px",
            }}
          >
            <h1 style={{ fontSize: "2rem", margin: "0" }}>{movie.title}</h1>
            <p style={{ fontSize: "1rem", margin: "0" }}>{movie.overview}</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#BE173C",
                width: "230px",
                marginTop: "16px", 
              }}
            >
              <img
                src={playButtonImage}
                alt="Play Button"
                style={{ height: "36px", marginRight: "10px" }}
              />
              <span
                style={{
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  WATCH TRAILER
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
