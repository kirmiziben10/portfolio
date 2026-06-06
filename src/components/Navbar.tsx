import React from "react";
import { Link } from "react-router-dom";

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
                <Link to="/" className="logo-anchor">
                    {animateWord("Yiğit Ziştoylu")}
                </Link>
            </h1>
        </nav>
    )
}

export default Navbar;