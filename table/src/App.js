import React from 'react';
import logo from './logo.svg';
import Table from './Table'
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>

        <Table />
      </div>
    );
  }
}

export default App;
