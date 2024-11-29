import React from "react";

import "./App.css";
import Weather from "./Weather";


function App() {
  return (
    <React.Fragment>
      <div className="container">
<Weather />
      </div>
      <div className="footer-info">
        Developed by{" "}
        <a
          target="_blank"
          href="https://aniketdev-portfolio.netlify.app/"
          rel="noopener noreferrer"
        >
          Aniket Pratap Singh
        </a>
      </div>
    </React.Fragment>
  );
}

export default App;
