import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ViewCrosswords(){
    const[crosswords, setCrosswords] = useState([]);
    const navigate = useNavigate();
    const { user } = useParams();

    useEffect(() => {
        async function fetchCrosswords() {
            try {
                const response = await fetch(`/crosswords/created?user=${user}`);
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
            <h2>{user}'s Created Crosswords</h2>
            <div
                style={{
                    display: 'flex',
                    gap:'1rem',
                    alignItems: 'center'
                }}
            >
                {crosswords.length === 0 ? (
                    <p>No crosswords to display.</p>
                ) : (
                    crosswords.map((crossword) => (
                        <div 
                            key={crossword._id} 
                            onClick={() => navigate(`/rendercrosswords/${crossword._id}`)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            <p>{crossword.title || 'Crossword'}</p>
                            <img 
                                src="/preview_image.png" 
                                alt="crossword preview"
                                style={{
                                    width: '8rem',
                                    height: '8rem',
                                    objectFit: 'cover'
                                }} 
                            />
                            <p>{new Date(crossword.created_date).toLocaleDateString()}</p>
                        </div>
                    ))   
                )}
            </div>  
        </div>   
    )

}
export default ViewCrosswords;