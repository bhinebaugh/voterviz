import React from 'react';

import './state-match-up.css';

const StateMatchUp = ({stateName, year, voteData}) => {
    var voteTotal = voteData.reduce( (acc,value) => acc + value.votes, 0 )
    return (
    <div className="panel state">
        <header>
            <h2>{stateName}<span>{year}</span></h2>
            <p>
                {voteTotal.toLocaleString()} votes cast
            </p>
        </header>
        {voteData.map( result => 
            <li className="candidate" key={result.id+result.name}>
                <div className={ "candidate-details " + (result.votes > voteTotal/2 ? "winner" : "") }>
                    <p className="person-name">{result.name}</p>
                    <p className="party-name">{result.parties.join(',')}
                    </p>
                </div>
                <div className="votes">
                    <svg width="100" height="20" viewBox="0 0 100 20">
                        <rect 
                            fill="#874dc5"
                            x="0" y="0" 
                            width={100*result.votes/voteTotal+"%"} 
                            height="10" 
                        />
                    </svg><br/>
                    {result.votes.toLocaleString()} votes
                </div>
            </li>
        )}
    </div>
    )
}

export default StateMatchUp