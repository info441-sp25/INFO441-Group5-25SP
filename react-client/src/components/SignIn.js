import React, { useEffect, useState } from 'react';

function SignIn(){

    console.log('signing in....')

    useEffect(() => {
        fetch("/signin")
    })
    
}

export default SignIn

