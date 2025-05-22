import React, { useEffect, useState } from 'react';

function Form(user) {
    return(
        <div>
        <p>hello world!</p>
            <p>welcome to the world, {user.name} ({user.username})</p>
        </div>
    )
}

export default Form;