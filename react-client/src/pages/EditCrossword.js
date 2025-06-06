import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import WordDefElem from '../components/WordDefElem';

function EditCrossword() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [words, setWords] = useState([{ id: Date.now() + Math.random(), term: '', definition: '' }]);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    useEffect(() => {
    async function fetchCrossword() {
        try {
            const response = await fetch(`/crosswords/${id}`);
            const data = await response.json();
            setTitle(data.name || '');
            const existingWords = data.entries.map((entry) => ({
                id: Date.now() + Math.random(), 
                term: entry.solution,
                definition: entry.clue ? entry.clue.replace(/\s*\(.*\)$/, '') : ''
            }));
            setWords(existingWords.length > 0 ? existingWords : [{ id: Date.now() + Math.random(), term: '', definition: '' }]);
        } catch (error) {
            console.log("Error: " + error);
        }
    }
    fetchCrossword();
    }, [id]);
    
    const navigate = useNavigate();

    const addWordPair = () => {
        const lastWord = words[words.length - 1];
        if (!lastWord.term.trim() || !lastWord.definition.trim()) {
            setError('Please fill out the current word and definition before adding another.');
            return;
        }
        setWords([...words, { id: Date.now() + Math.random(), term: '', definition: '' }]);
    };

    const removeWordPair = (id) => {
        setWords(words.filter(word => word.id !== id));
    };

    const updateWordPair = (id, field, value) => {
        setWords(words.map(word =>
            word.id === id
                ? {
                    ...word,
                    [field]: field === 'term' ? value.toUpperCase() : value
                }
                : word
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please enter a title for your crossword');
            return;
        }

        const validWords = words.filter(word => word.term.trim() && word.definition.trim());

        if (validWords.length <= 1) {
            setError('Please add at least two words and definitions.');
            return;
        }

        const imcompleteWords = words.filter(word => !word.term.trim() || !word.definition.trim());
        
        if (imcompleteWords.length > 0) {
            setError('All words must have both a term and a definition.');
            return;
        }
        
        const tooShort = validWords.find(word => word.term.trim().length <= 1);
        
        if (tooShort) {
            setError('All terms must be at least 2 letters long.');
        }

        try {
            const deleteRes= await fetch(`/crosswords/${id}`, {
                method: 'DELETE',
            });
            if (!deleteRes.ok) {
                throw new Error('Failed to delete original crossword');
            }
            console.log(deleteRes)
            console.log("valid words: " + validWords.stringify)
            const response = await fetch(`/crosswords/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                data: {
                    title: title,
                    words: validWords 
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === "not logged in") {
                    setError("Please sign in to create a crossword.");
                } else if (data.error === "all words were filtered") {
                    setError("💡 Oops! We couldn’t place some of your words into the puzzle. Crossword grids require words to share at least one letter with others.");
                } else {
                    setError("Failed to create crossword.");
                }
                return;
                // throw new Error('Failed to create crossword');
            }

            if (data.filteredEntries && data.filteredEntries.length > 0) {
                const message = `❌ Could not include: ${data.filteredEntries.join(', ')}`;
                setWarning(message);            
                setTimeout(() => setWarning(''), 5000); 
                setTimeout(() => {
                    navigate(`/rendercrosswords/${data.id}`);
                }, 1000);
            } else {
                navigate(`/rendercrosswords/${data.id}`);
            }

        } catch (error) {
            setError('Failed to create crossword. Please try again.');
            console.error('Error creating crossword:', error);
        }
    };

    return (
        <div className="createCrosswordContainer">
            <h1>Edit Crossword Crossword</h1>
            
            <form onSubmit={handleSubmit}>
                <div className="createCrosswordForm">
                    <label htmlFor="title" className="createCrosswordLabel">
                        Crossword Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="createCrosswordInput"
                        placeholder="Enter a title for your crossword"
                    />
                </div>

                <div className="wordsSection">
                    <h3>Words and Definitions</h3>
                    {words.map((word, index) => (
                        <WordDefElem
                            key={word.id}
                            word={word}
                            index={index}
                            onUpdate={updateWordPair}
                            onRemove={removeWordPair}
                            canRemove={words.length > 1}
                        />
                    ))}

                    <button type="button" onClick={addWordPair} className="addWordButton">
                        Add Another Word
                    </button>
                </div>

                {error && (
                    <div className="errorSection">
                        {error}
                    </div>
                )}

                {warning && (
                    <div className='errorSection'>
                        {warning}
                    </div>
                )}

                <button type="submit" className="submitButton">
                    Edit Crossword
                </button>
            </form>
        </div>
    );
}
export default EditCrossword