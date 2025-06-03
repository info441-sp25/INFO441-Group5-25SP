import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
    
    // TODO: get the crossword preview to have a button for edit
        // - Need to edit the viewcrosswords/user page to show an “edit” button for each crossword
        // - Links to new page below

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
                            <div className="actionLinks">
                                <Link to={'/EditCrossword'} className="actionLink">Edit</Link>
                                <Link to={null} className="actionLink">Delete</Link>
                            </div>
                        </div>
                    ))   
                )}
            </div>  
        </div>   
    )

}
export default ViewCrosswords;