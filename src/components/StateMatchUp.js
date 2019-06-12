import React from 'react';

import './state-match-up.css';

const StateMatchUp = ({stateName, year, voteData}) => {return (
    <div className="panel state">
        <h2>{stateName} &mdash; {year}</h2>
        {voteData.map( result => 
            <li className="candidate" key={result.id+result.name}>
                <div className="candidate-details">
                    <p className="person-name">{result.name}</p>
                    <p className="party-name">{result.parties.join(',')}
                    </p>
                </div>
                <div className="votes">
                    {result.votes} votes
                </div>
            </li>
        )}
    </div>
)}

export default StateMatchUp