import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ViewCrosswords(){
    const[crosswords, setCrosswords] = useState([]);
    const navigate = useNavigate();
    const { user } = useParams();

    useEffect(() => {
        async function fetchCrosswords() {
            try {
                const response = await fetch("/crosswords/user?user=" + user)
                const data = await response.json();
                setCrosswords(data)
            } catch(err) {
                console.log(err)
            }  
        }
        fetchCrosswords()
    }, [user])
    
    return (
        <div>
            <h2>{user}'s Crosswords</h2>
            <div>
                {crosswords.length === 0 ? (
                    <p>No crosswords to display.</p>
                ) : (
                    crosswords.map((crossword) => (
                        <div 
                            key={crossword._id} 
                            onClick={() => navigate(`/crosswords/${crossword._id}`)}
                        >
                            <h3>{crossword.title}</h3>
                            <img src="/preview_image.png" alt="crossword preview" />
                            <p>{new Date(crossword.created_date).toLocaleDateString()}</p>
                        </div>
                    ))   
                )}
            </div>  
        </div>   
    )

}
export default ViewCrosswords;