import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function ViewCrosswords({currentUser}){
    const[crosswords, setCrosswords] = useState([]);
    const navigate = useNavigate();
    const { user } = useParams();
    const [error, setError] = useState('');
    const currentUsername = (currentUser ? (currentUser.username) : '')

    useEffect(() => {
        async function fetchCrosswords() {
            try {
                const response = await fetch(`/crosswords/created/${user}`);
                if (!response.ok) {
                    setError("Failed to fetch crossword(s).");
                    return;
                }
                const data = await response.json();
                setCrosswords(data)
            } catch(err) {
                setError('Failed to fetch crossword(s)');
                console.error('Error fetching crosswords:', error);
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
    
    return (
        <div>
            <div className='card-grid'>
                {error ? (
                    <div className="errorMessage">
                        {error}
                    </div>
                ) : crosswords.length === 0 ? (
                    <p>No crosswords to display.</p>
                ) : (
                    crosswords.map((crossword) => (
                        <div 
                            key={crossword._id} 
                            className="crossword-card"
                        >
                            <img
                                src="/preview_image.png"
                                alt="crossword preview"
                                className='card-image'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/rendercrosswords/${crossword._id}`)}
                            />
                            <h3
                                className='card-title'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/rendercrosswords/${crossword._id}`)}
                            >
                                {crossword.title || 'Crossword'}
                            </h3>
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