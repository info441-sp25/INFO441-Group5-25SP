import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search.js';

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
      <div className="headerLeftLinks">
        <Link to={'/'} className="actionLink">Front Page</Link>
        <Link to={'/form'} className="actionLink">Welcome Page(form)</Link>
          {username ? (
            <Link to={'/createcrossword'} className="actionLink">Create New Crossword</Link> 
          ) : null }
        <Search />
      </div>
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
  // also to do: have header collapse into a mobile compatible menu once the window gets to a certain size, but optional.
  
}

export default Header;
