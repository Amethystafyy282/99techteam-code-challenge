import React from "react";
import "./App.css";
import { FirstProblem } from "./FirstProblem";
import { ThirdProblem } from "./ThirdProblem/refactored";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="flex flex-col p-10 gap-4">
          <FirstProblem />
          <ThirdProblem />
        </div>
      </header>
    </div>
  );
}

export default App;
