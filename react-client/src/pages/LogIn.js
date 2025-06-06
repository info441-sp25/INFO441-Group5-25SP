import React, { useEffect, useState } from 'react';

function LogIn({user}) {

    const handleLogin = async () => {
        window.location.href = "/signin";
    };

    const handleLogout = () => {
        window.location.href = "/signout";
    };

    return (
        <div className="loginContainer">
            <div className="loginCard">
                <h1 className="loginTitle">Crossly</h1>
                <p className="loginSubtitle">Create and solve crosswords with ease</p>
                {user ? (
                    <button className="loginButton logout" onClick={handleLogout}>
                        Sign Out
                    </button>
                ) : (
                    <button className="loginButton" onClick={handleLogin}>
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
}

export default LogIn;