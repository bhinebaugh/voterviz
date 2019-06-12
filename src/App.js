import React, { } from 'react';
import StateMatchUps from './components/StateMatchUps';
import StateMatchUp from './components/StateMatchUp';
import './App.css';

// for each year (from separate JSON files),
// take each object (which will be a state's results),
// and add its objects (a unique candidate-state-year unit)
// to a single, flat array
function reformatData(nestedResults) {
  var flattened = [];
  Object.keys(nestedResults).forEach(stateKey => {
    let stateResult = nestedResults[stateKey];
    Object.keys(stateResult).forEach(candidateKey => 
      flattened.push(stateResult[candidateKey])
    )
  });
  return flattened;
}

class App extends React.Component {
  constructor() {
    super();
    this.sourceFiles = {
      parties: ['parties_2004', 'parties_2008', 'parties_2012'], // unnused
      results: ['results_2004', 'results_2008', 'results_2012']
    }
    this.state = {
      dataset: []
    }
  }

  componentDidMount = () => {
    var resultsPromises = this.sourceFiles.results.map( file =>
      fetch('/data/'+file+'.json')
        .then( response => response.json() )
        .then( json => reformatData(json) )
    )
    Promise.all(resultsPromises)
      .then(values => values.reduce(
        (acc,res) => acc.concat(res),[])
      )
      .then(result => this.setState({ dataset: result }))
  }
  
  render() {
    let year=2004;
    let subset=this.state.dataset.filter( result => result.year === year )
    let maine2008 = this.state.dataset.filter( result => result.state === "Maine" && result.year === 2008)

    return (
      <div className="App">
        <header className="App-header">
          <h1>U.S. Presidential Elections</h1>
        </header>
        <h3>Candidates, 2004 &ndash; 2012</h3>
        <StateMatchUp stateName="Maine" year={2004} voteData={maine2008}></StateMatchUp>
        <StateMatchUps states={['AL','OK']} year={2004} data={subset}></StateMatchUps>
        <ul>
          {this.state.dataset.map((result) => <li key={`${result.id}+${result.name}`}>
            {result.name}
          </li>
            )}
        </ul>
      </div>
    )
  }
}

export default App;
