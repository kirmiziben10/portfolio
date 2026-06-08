import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SnippetDetailsProps {
    isOpen: boolean;
}

function SnippetDetails({ isOpen }: SnippetDetailsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

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

            return() => {
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
            )
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
            )
        }

    }, { scope: containerRef, dependencies: [isOpen] });

    return (
        <main ref={containerRef} className="snippet-details">
            <h1>Hello Snippet</h1>
        </main>
    )
}

export default SnippetDetails;