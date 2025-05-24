import React, {useEffect} from 'react';
import { Link } from 'react-router-dom'

function Form({ user }) {

    console.log("*****user info:" + user)


    return (
        <div>
            <p>hello world!</p>
            {user ? (
                <p>hi - welcome to the world, {user.name} ({user.username})</p>
            ) : (
                <p>Not logged in (or internal error)</p>
            )}
            <a href='/rendercrosswords/6830e1d11fdb28bb2d6d6022'>crossword?</a>
        </div>
    );
}

export default Form;