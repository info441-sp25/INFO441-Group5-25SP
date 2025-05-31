import React, {useEffect} from 'react';
import { Link } from 'react-router-dom'

function Form({ user }) {

    console.log("*****user info:" + user)

    return (
        <div className='formContainer'>
            <p>hello world!</p>
            {user ? (
                <p>hi - welcome to the world, {user.name} ({user.username})</p>
            ) : (
                <p>Not logged in (or internal error)</p>
            )}
            <a href='/rendercrosswords/1'>crossword?</a>
            <br/>
            <a href='/createcrossword'>Create crossword</a>
        </div>
    );
}

export default Form;