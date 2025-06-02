import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/users/myIdentity");
        const data = await response.json();
        console.log("Logged in data in for Header: ", data);
        if (data.status === "loggedin") {
          setUsername(data.userInfo.username); 
        }
      } catch (err) {
        console.log("Error fetching user: ", err);
      }
    }

    fetchUser();
  }, []);

  const handleLogin = async () => {
        window.location.href = "/signin";
    };

  return (
    <div className="headerContainer">
      <div style={{ flex: 1 }} />
      <div className="headerActionLinks">
        {username ? (
          <Link to={`/viewcrosswords/user/${username}`} className="actionLink">
            {username}
          </Link>
        ) : (
          <Link onClick={handleLogin} className="actionLink">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
  
}

export default Header;
