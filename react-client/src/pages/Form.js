import React, {useEffect} from 'react';
import { Link } from 'react-router-dom'

function Form({ user }) {

    console.log("*****user info:" + user)

    return (
        <div className="formContainer">
            {user ? (
                <div className="welcomeSection">
                    <h2 className="welcomeTitle">Welcome, {user.name}</h2>
                    <p className="welcomeSubtitle">@{user.username}</p>
                </div>
            ) : (
                <div className="errorSection">
                    <p>Please sign in to continue</p>
                </div>
            )}
            <div className="actionLinks">
                <Link to="/rendercrosswords/1" className="actionLink">
                    View Crossword
                </Link>
                <Link to="/createcrossword" className="actionLink">
                    Create New Crossword
                </Link>
            </div>
        </div>
    );
}

export default Form;