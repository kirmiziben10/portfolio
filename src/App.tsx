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
      <h1 className="animate" aria-label="Yiğit Ziştoylu">
        {animateWord("Yiğit Ziştoylu")}
      </h1>
      <div className="glyph-bg-wrapper">
        <GlyphDither
          gridCols={20}
          voronoiScale={2}
          skew={1}
          angle={180}
          threshold={0.1}
          gamma={0.3}
          mix={1}
          speed={0.3}
          drift={42}      
        />
      </div>
      <SandpackWindow />
    </>
  );
}

export default App;
