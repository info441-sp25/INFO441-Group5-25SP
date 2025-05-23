import React, {useEffect} from 'react';

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
        </div>
    );
}

export default Form;