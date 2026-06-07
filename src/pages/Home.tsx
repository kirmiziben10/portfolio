import { Link, Outlet, useLocation } from "react-router-dom"
import SandpackWindow from "../components/Sandpack"
import Navbar from "../components/Navbar"

function Home() {
  const location = useLocation()
  const isHome = location.pathname ==="/"
  return (
    <>
      <div className="page">
        <Navbar />
        <div className="content-wrapper">
          <main className={`content ${!isHome ? "content-inset" : ""}`}>
            <section className="about">
              <div className="photo-container">
                <div className="photo">Photo</div>
              </div>
              <p className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </section>
            <div className="snippets">
              <h2 className="snippets-header">---snippets---</h2>
              <div className="snippets-grid">
                <Link to="snippet">
                  <div className="snippet-card">
                    <SandpackWindow />
                  </div>
                </Link>
                <div className="snippet-card">snippet 2</div>
                <div className="snippet-card">snippet 3</div>
                <div className="snippet-card">snippet 4</div>
              </div>
            </div>
          </main>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Home