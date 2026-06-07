import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


function SnippetDetails() {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(()=>{
        window.scrollTo({ top: 0, behavior: "smooth" }); 

        const currentScrollY = window.scrollY;                                                                                                                                                                                           
        const screenHeight = window.innerHeight;                                                                                                                                                                                         
        const startY = currentScrollY + screenHeight;   

        gsap.fromTo(
            containerRef.current,
            {y: startY},
            {
                y: 0,
                duration: 0.5,
                ease: "back.out(1)"
            }
        )

    }, {scope: containerRef})

    return (
        <main ref={containerRef} className="snippet-details">
            <h1>Hello Snippets</h1>
        </main>
    )
}

export default SnippetDetails;