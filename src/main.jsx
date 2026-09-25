import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tonight from "./pages/Tonight";
import Movie from "./pages/Movie";
import Saved from "./pages/Saved";
import Search from "./pages/Search";
import "./index.css";

function Layout() {
  const { pathname } = useLocation();
  // Braces matter: newer browsers make scrollTo return a Promise, which React rejects as a cleanup.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Tonight />} />
          <Route path="search" element={<Search />} />
          <Route path="saved" element={<Saved />} />
          <Route path="movies/:movieId" element={<Movie />} />
          <Route path="*" element={<p className="notice">This reel is missing. <a href="/">Back to tonight</a></p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
