import React, { } from 'react';
//import StateMatchUps from './components/StateMatchUps';
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
    this.stateAbbrevs = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]
    this.state = {
      rawdata: {},
      dataset: []
    }
  }

  componentDidMount = () => {
    var resultsPromises = this.sourceFiles.results.map( file =>
      fetch('/data/'+file+'.json')
        .then( response => response.json() )
        .then( json => {
          this.setState({
            rawdata: {
              ...this.state.rawdata,
              [file]: json
            }
          });
          return reformatData(json)
        }
)
    )
    Promise.all(resultsPromises)
      .then(values => {
        return values.reduce(
          (acc,res) => acc.concat(res),[]
        )
      })
      .then(result => this.setState({ dataset: result }))
  }
  
  render() {
    let year=2004;
    let subset=this.state.dataset.filter( result => result.year === year )
    this.byState = this.stateAbbrevs.map( stateAbbrev => {
      let results = this.state.dataset.filter( result => result.id === year.toString() + "_" + stateAbbrev )
      return {
        name: stateAbbrev,
        year: year,
        results: results
      }
    })

    return (
      <div className="App">
        <header className="App-header">
          <h1>U.S. Presidential Elections</h1>
        </header>
        <h3>Candidates, 2004 &ndash; 2012</h3>
        <ul>
          {this.byState.map((state) =>
            <StateMatchUp stateName={state.name} year={state.year} voteData={state.results} /> )
          }
        </ul>
      </div>
    )
  }
}

export default App;
