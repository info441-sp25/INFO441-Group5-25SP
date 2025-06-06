import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function ViewCrosswords({currentUser}){
    const[crosswords, setCrosswords] = useState([]);
    const navigate = useNavigate();
    const { user } = useParams();
    const currentUsername = (currentUser ? (currentUser.username) : '')

    useEffect(() => {
        async function fetchCrosswords() {
            try {
                const response = await fetch(`/crosswords/created/${user}`);
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
            <div className='card-grid'>
                {crosswords.length === 0 ? (
                    <p>No crosswords to display.</p>
                ) : (
                    crosswords.map((crossword) => (
                        <div 
                            key={crossword._id} 
                            className="crossword-card"
                        >
                            <h3
                                className='card-title'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/rendercrosswords/${crossword._id}`)}
                            >
                                {crossword.title || 'Crossword'}
                            </h3>
                            <img
                                src="/preview_image.png"
                                alt="crossword preview"
                                className='card-image'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/rendercrosswords/${crossword._id}`)}
                            />
                            <p className='card-date'>{new Date(crossword.created_date).toLocaleDateString()}</p>
                            <p className='card-date'>Created By: {crossword.creator || 'Anonymous'}</p>
                            {crossword.creator == currentUsername ? (
                                <div className="actionLinks" style={{ marginTop: '0.5rem' }}>
                                    <Link
                                        to={`/editcrossword/${crossword._id}`}
                                        className="actionLink"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleDelete(crossword._id);
                                        }}
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
                            ) : (
                                <div/>
                            )}
                            
                        </div>
                    ))   
                )}
            </div>  
        </div>   
    )

}
export default ViewCrosswords;