import React from 'react';
import './App.css';
import NNGraph from './components/NNGraph';
import BarChart from './components/NNGraph'


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
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
        
      </header> */}
      {/* <div id="scatterplot"></div> */}
      <NNGraph />
    </div>
  );
}

export default App;
