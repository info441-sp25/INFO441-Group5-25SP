import React, { useEffect, useState } from 'react';

function LogIn({user}) {

    const handleLogin = async () => {
      window.location.href = "/signin";
    };

    const handleLogout = () => {
      window.location.href = "/signout";
    };

    return (
    <div>
      {user ? (
        <button onClick={handleLogout}>
          LOGOUT
        </button>
      ) : (
        <button onClick={handleLogin}>
          LOGIN
        </button>
      )}
    </div>
  );
}

export default LogIn;