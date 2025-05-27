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

  return (
    <div>
      {username && (
        <Link to={`/viewcrosswords/user/${username}`} 
        style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end', 
            alignItems: 'center',
          }}>
            {username}
        </Link>
      )}
    </div>
  );
}

export default Header;
