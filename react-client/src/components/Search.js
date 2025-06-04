import React from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
    const navigate = useNavigate();
    
    function handleSubmit(e) {
        e.preventDefault();
        const query = e.target.elements.searchInput.value;
        if (!query) return; 
        navigate(`/search/${query}`)
    }

    return (
        <div>
            <form id="search-form" onSubmit={handleSubmit} class="searchForm">
                <input type="text" name="searchInput" placeholder="Search..." class="searchInput"/>
                <button type="submit" class="searchButton">🔍︎</button>
            </form>
        </div>
    )
}

export default Search;


