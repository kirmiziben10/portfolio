import React from "react";
import "./App.css";
import GlyphDither from "./components/GlyphDither";

import SandpackWindow from "./components/Sandpack";

function App() {
  const animateWord = (text: string) => {
    return text.split("").map((char, i) => {
      return (
        <span
          className="animate-letters"
          key={i}
          style={{ "--i": i } as React.CSSProperties}
        >
          {char}
        </span>
      );
    });
  };

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
      <div className="page">
        <nav className="navbar">
          <h1 className="animate" aria-label="Yiğit Ziştoylu">
            {animateWord("Yiğit Ziştoylu")}
          </h1>
        </nav>
        <div className="content-wrapper">
          <main className="content">
            <section className="about">
              <div className="photo-container">
                <div className="photo">Photo</div>
              </div>
              <p className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </section>
            <div className="pens">
              <h2 className="pens-header">Pens</h2>
              <div className="pens-grid">
                <div className="pen-card">
                  <SandpackWindow />
                </div>
                <div className="pen-card">Pen 2</div>
                <div className="pen-card">Pen 3</div>
                <div className="pen-card">Pen 4</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
