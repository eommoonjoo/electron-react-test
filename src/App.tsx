import React from "react";
import logo from "./logo.svg";
import "./App.css";

declare global {
  interface Window {
    electron: {
      process: {
        stdin: any;
      };
    };
    appVersion: string;
  }
}

function App() {
  console.log(window);
  // console.log(window.electron.process.stdin());
  // window.electron.process.stdin();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
