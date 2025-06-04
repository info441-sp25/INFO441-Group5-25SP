import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
    const[crosswords, setCrosswords] = useState([]);
    const[query, setQuery] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!query) return;
        async function fetchCrosswords() {
            try {
                const response = await fetch(`/crosswords/search?search=${query}`);
                const data = await response.json();
                setCrosswords(data)
            } catch(err) {
                console.log(err)
                alert('Error fetching crosswords.');

            }  
        }
        fetchCrosswords()
    }, [query])

    function handleSubmit(e) {
        e.preventDefault();
        const inputValue = e.target.elements.searchInput.value;
        setQuery(inputValue);
    }

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
                    <p>No crosswords yet, start searching.</p>
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
                            <h3>{crossword.title || 'Crossword'}</h3>
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
            <form id="search-form" onSubmit={handleSubmit}>
                <input type="text" name="searchInput" placeholder="Search..."/>
                <button type="submit">Go</button>
            </form>
        </div>

    )
}

export default Search;


