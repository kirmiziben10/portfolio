import React from "react";

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


function Navbar() {
    return (
        <nav className="navbar">
            <h1 className="animate" aria-label="Yiğit Ziştoylu">
                {animateWord("Yiğit Ziştoylu")}
            </h1>
        </nav>
    )
}

export default Navbar;