import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SearchCrosswords() {
    const[crosswords, setCrosswords] = useState([]);
    const [error, setError] = useState('');
    const { search } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!search) return;
        async function fetchCrosswords() {
            try {
                const response = await fetch(`/crosswords/search/${search}`); 
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
    }, [search])


    return (
        <div>
            <div className='card-grid'>
                {error ? (
                    <div className="errorMessage">
                        {error}
                    </div>
                ) : crosswords.length === 0 ? (
                    <p>No crosswords yet, start searching.</p>
                ) : (
                    crosswords.map((crossword) => (
                        <div 
                            key={crossword._id} 
                            onClick={() => navigate(`/rendercrosswords/${crossword._id}`)}
                            class="crossword-card"
                        >
                            <img src="/preview_image.png" alt="crossword preview" class='card-image' />
                            <h3 className='card-title'>{crossword.title || 'Crossword'}</h3>
                            <p className='card-date'>{new Date(crossword.created_date).toLocaleDateString()}</p>
                            <p className='card-date'>Created By: {crossword.creator || 'Anonymous'}</p>
                        </div>
                    ))   
                )}
            </div>   
        </div>
    )
}

export default SearchCrosswords;


