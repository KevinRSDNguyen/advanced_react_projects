import React, { Component } from "react";

import Header from "./components/header_footer/Header";
import Featured from "./components/featured";
import VenueInfo from "./components/venueInfo";
import Highlight from "./components/Highlights";
import "./resources/styles.css";

class App extends Component {
  render() {
    return (
      <div
        className="App"
        // style={{ height: "1500px", background: "cornflowerblue" }}
      >
        <Header />
        <Featured />
        <VenueInfo />
        <Highlight />
      </div>
    );
  }
}

export default App;
