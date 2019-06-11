import React, { } from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.dataset = {};
    this.sourceFiles = {
      parties: ['parties_2004', 'parties_2008', 'parties_2012'],
      results: ['results_2004', 'results_2008', 'results_2012']
    }
  }

  componentDidMount = () => {
    this.sourceFiles.results.forEach( file =>
      fetch('/data/'+file+'.json')
        .then( response => response.json() )
        .then( json => this.dataset[file] = json )
    )
    this.sourceFiles.parties.forEach( file =>
      fetch('/data/'+file+'.json')
      .then( response => response.json() )
      .then( json => this.dataset[file] = json )
    )
  }

  render = () => (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
