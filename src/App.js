import Datamap from 'datamaps';
import React, { } from 'react';
//import StateMatchUps from './components/StateMatchUps';
import StateMatchUp from './components/StateMatchUp';
import usStates from './us_states.json';
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
    this.years = [2004, 2008, 2012];
    this.stateAbbrevs = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]
    this.state = {
      shown: [],
      year: 2004,
      rawdata: {},
      dataset: []
    }
  }

  toggleStateShown = (stateAbbr) => {
    let position = this.state.shown.indexOf(stateAbbr);
    if (position > -1) {
      let shortenedList = this.state.shown.filter(item => item !== stateAbbr);
      this.setState({ shown: shortenedList })
    } else {
      this.setState({ shown: [...this.state.shown, stateAbbr]})
    }
  }

  toggleYear = (year) => {
    this.setState({ year: year });
  }

  componentDidMount = () => {
    this.map = new Datamap({
      element: document.getElementById("map"),
      scope: 'usa',
      done: (datamap) => {
        datamap.svg.selectAll('.datamaps-subunit').on('click', (geography) => {
          let clicked = usStates.filter(st => st.name === geography.properties.name)
          this.toggleStateShown(clicked[0].abbreviation)
        })
        // function(geography) {
        //     console.log(geography.properties.name);
        //     this.toggleStateShown(geography.properties.name)
        // })
      }
    })
    var resultsPromises = this.sourceFiles.results.map( file =>
      fetch('data/'+file+'.json')
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
    let year = this.state.year;
    this.byState = this.state.shown.map( stateAbbrev => {
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
        <div id="filters">
          <fieldset id="year">
            <legend>Select election year</legend>
            {this.years.map(year =>
              <label>
                <input type="radio"
                  name="year"
                  value={year}
                  checked={year===this.state.year}
                  onChange={() => this.toggleYear(year)}
                />{year}
              </label>
            )}
          </fieldset>
          <fieldset id="states">
            <legend>Select states to show details for</legend>
            {this.stateAbbrevs.map( stateAbbrev => 
              <label>
                <input type="checkbox" name={stateAbbrev} onChange={() => this.toggleStateShown(stateAbbrev)} />
                {stateAbbrev}
              </label>
            )}
          </fieldset>
        </div>
        <ul>
          { this.byState.length === 0 ? <li>Please select states above to see details</li> : this.byState.map((state) =>
            <StateMatchUp stateName={state.name} year={state.year} voteData={state.results} /> )
          }
        </ul>
      </div>
    )
  }
}

export default App;
