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

    async function handleDelete(crosswordId) {
        if (!window.confirm('Are you sure you want to delete this crossword?')) return;

        try {
            const res = await fetch(`/crosswords/${crosswordId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setCrosswords((prev) => prev.filter(cw => cw._id !== crosswordId));
            } else {
                const result = await res.json();
                alert(result.message || 'Failed to delete crossword');
            }
        } catch (err) {
            console.error('Error deleting crossword:', err);
            alert('Server error');
        }
    }
    
    // TODO: get the crossword preview to have a button for edit
        // - Need to edit the viewcrosswords/user page to show an “edit” button for each crossword
        // - Links to new page below

    return (
        <div>
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
                            <div className="actionLinks" style={{ marginTop: '0.5rem' }}>
                                <Link to={`/editcrossword/${crossword._id}`} className="actionLink">Edit</Link>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(crossword._id)}
                                    }
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    <span className="actionLink">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))   
                )}
            </div>  
        </div>   
    )

}
export default ViewCrosswords;