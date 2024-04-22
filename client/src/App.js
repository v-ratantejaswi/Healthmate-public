import React, { useRef } from "react";
import './App.css';
import { Link } from "react-router-dom";
import axios from "axios";


function HomePage() {
  const phyRef = useRef(null);
  const dietRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const handleNavigation = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Healthmate</div>
        <nav>
          <ul className="nav-list">
            <li>
              <button className="nav-button" onClick={() => handleNavigation(phyRef)}>
                Physical Fitness
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => handleNavigation(dietRef)}>
                Diet
              </button>
            </li>
            <li>
              <Link to="/Login">
                <button className="nav-button">
                  Login
                </button>
              </Link>
            </li>
            <li>
              <Link to="/Register">
                <button className="nav-button">
                  Register
                </button>
              </Link>
            </li>
            <li>
              <Link to="/Contact">
                <button className="nav-button">
                  Contact Us
                </button>
              </Link>
            </li>

          </ul>
        </nav>
      </header>
      {/* <div className="login-form-container">
      
         <Signin />
        <Link to="/Signup">
        <button>SignUp</button>
        </Link>
          <br />
          <br />
        <Link to="/Reports">
        <button>Reports</button>
        </Link>
      </div> */}

      <div className="content">

      </div>

      <div ref={phyRef} className="pfit">
        <h1 className="dashboard-h">Physical Fitness</h1>
        <div className="fitness-container">
        <div className="readable-content"><p style={{"color": "white"}} className="dietary-text">
        Our physical fitness tracker makes it easy to monitor your progress
            towards your fitness goals. Track your workouts, set goals, and see
            how far you've come.
          </p></div>

        </div>
      </div>

      
      <div ref={dietRef} className="dfit">
        <h1 className="dashboard-h">Dietary Fitness</h1>
        <div className="dietary-container">
        <div className="readable-content"><p style={{"color": "white"}} className="dietary-text">
            Eating a healthy, balanced diet is key to achieving optimal health.
            With our dietary fitness tracker, you can easily track your meals,
            monitor your nutrient intake, and make sure you're getting the
            nutrients your body needs.
          </p></div>
        </div>
      </div>
      



    </div>
  );
}

export default HomePage;
