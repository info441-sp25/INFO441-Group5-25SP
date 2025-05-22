import React, { useEffect, useState } from 'react';

function LogIn({onUserFetched}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
    async function checkLoginStatus() {
      try {
        let response = await fetch("/users");
        let identity = await response.json();

        if (identity.status === "loggedin") {
          setUser(identity.userInfo);
          onUserFetched(identity.userInfo);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    checkLoginStatus();
    }, [onUserFetched]);

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