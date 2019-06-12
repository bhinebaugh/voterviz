import React from 'react';

import './state-match-up.css';

const StateMatchUp = ({stateName, year, voteData}) => {
    var voteTotal = voteData.reduce( (acc,value) => acc + value.votes, 0 )
    return (
    <div className="panel state">
        <header>
            <h2>{stateName} &mdash; {year}</h2>
            <p>
                {voteTotal} votes cast
            </p>
        </header>
        {voteData.map( result => 
            <li className="candidate" key={result.id+result.name}>
                <div className="candidate-details">
                    <p className="person-name">{result.name}</p>
                    <p className="party-name">{result.parties.join(',')}
                    </p>
                </div>
                <div className="votes">
                    <svg width="100" height="20" viewbox="0 0 100 20">
                        <rect x="0" y="0" width={100*result.votes/voteTotal+"%"} height="10" />
                    </svg>
                    {result.votes} votes
                </div>
            </li>
        )}
    </div>
    )
}

export default StateMatchUp