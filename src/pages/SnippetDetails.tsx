import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SandpackWindow from "../components/Sandpack";
import backIcon from "../assets/back.svg";

interface SnippetDetailsProps {
    isOpen: boolean;
}

function SnippetDetails({ isOpen }: SnippetDetailsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);
    const navigate = useNavigate();

    useGSAP(() => {
        const currentScrollY = window.scrollY;
        const screenHeight = window.innerHeight;
        const startY = currentScrollY + screenHeight;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (isOpen) {
                gsap.set(containerRef.current, { y: 0, display: "flex" });
            }
            else { gsap.set(containerRef.current, { y: startY, display: "none" }) };

            return () => {
                isFirstRender.current = true;
            };
        }

        if (isOpen) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            gsap.fromTo(
                containerRef.current,
                { y: startY, display: "flex" },
                {
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(1)"
                }
            );
        }

        if (!isOpen) {
            gsap.to(
                containerRef.current,
                {
                    y: startY,
                    duration: 0.5,
                    ease: "back.in(1)",
                    display: "none"
                }
            );
        }

    }, { scope: containerRef, dependencies: [isOpen] });

    return (
        <main ref={containerRef} className="snippet-details">
            <div className="snippet-details-header">
                <button 
                    className="back-button" 
                    onClick={() => navigate("/")} 
                    aria-label="Go Back"
                >
                    <img
                        className="back-icon"
                        src={backIcon}
                        alt="Go Back"
                    />
                </button>
                <div className="snippet-name-container">
                    <span className="snippet-name-text">Reveal</span>
                </div>
            </div>
            <div className="snippet-details-info">
                <div className="snippet-display-wrapper">
                    <SandpackWindow />
                </div>
                <div className="snippet-details-right">
                    <div className="snippet-about">
                        <span className="about-title">About Snippet</span>
                        <p className="about-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rutrum turpis urna, at posuere elit mattis vitae. Pellentesque tincidunt ullamcorper vulputate. Vestibulum varius porta nisl id vehicula. Integer velit nisl, venenatis id eros molestie, pharetra semper massa. Pellentesque pretium vehicula lorem, sed sollicitudin purus gravida et. Nam lacus metus, fringilla et diam nec, dapibus molestie nunc. Integer vel congue odio.
                        </p>
                    </div>
                    <div className="snippet-bottom">
                        <div className="snippet-categories">
                            <span className="category-badge badge-interactive">Interactive</span>
                            <span className="category-badge badge-animation">Animation</span>
                            <span className="category-badge badge-svg">SVG</span>
                        </div>
                        <div className="snippet-options">
                            <button className="option-button open-codepen">
                                Open in CodePen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SnippetDetails;