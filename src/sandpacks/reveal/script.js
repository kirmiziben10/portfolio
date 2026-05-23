import React from 'react';
import ReactDOM from 'react-dom/client'

function App() {
  const animateWord = (text) => {
    return text.split("").map((char, i) => {
      return (
        <span
          className="animate-letters"
          key={i}
          style={{ "--i": i }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <h1 className="animate">
        {animateWord("Hello World!")}
      </h1>
    </>
  );
}

export default App;