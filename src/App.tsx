import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlyphDither from "./components/GlyphDither";
import Home from "./pages/Home";
import SnippetDetails from "./pages/SnippetDetails";
import "./App.css";

function App() {

  return (
    <>
      <div className="glyph-bg-wrapper">
        <GlyphDither
          gridCols={40}
          voronoiScale={2}
          skew={1}
          angle={90}
          threshold={0.1}
          gamma={0.3}
          mix={1}
          speed={0.1}
          drift={42}
        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="snippet" element={<SnippetDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
