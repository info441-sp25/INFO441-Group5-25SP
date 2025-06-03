import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import WordDefElem from '../components/WordDefElem';

//TODO:
    // - New frontend page that is based on the pre-existing create crossword page…
    //     - Call GET crossword/edit
    //     - Load all the pre-existing information into the respective forms to edit by the user
    //     - Create crossword button should now route to POST crossword/edit in order to ensure the pre-existing thing is deleted

function EditCrossword({user, id}) {
    const [crosswordID, setCrosswordID] = useState(id)
    const [crossword, setCrossword] = useState('')
    const [title, setTitle] = useState('');
    const [words, setWords] = useState([{ term: '', definition: '' }]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCrossword() { //todo: needs a matching user check
            try {
                const response = await fetch(`/crosswords/${crosswordID}`)
                const data = await response.json();
                setCrossword(data)
            } catch (error) {
                console.log("Error: " + error)
            }
        }
        fetchCrossword()
        setTitle(crossword.name);
        const existingWords = [];
        let counter = 0;
        crossword.entries.map((entry) => {
            const result = ({
                    term: entry.solution,
                    definition: entry.clue.substring(0, (entry.clue.indexOf('(') - 1)),
                    index: counter
                })
            counter++
            return result
        })
    })
    
    const navigate = useNavigate();

    const addWordPair = () => {
        setWords([...words, { term: '', definition: '' }]);
    };

    const removeWordPair = (index) => {
        const newWords = words.filter((_, i) => i !== index);
        setWords(newWords);
    };

    const updateWordPair = (index, field, value) => {
        const newWords = [...words];
        newWords[index][field] = value;
        setWords(newWords);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please enter a title for your crossword');
            return;
        }

        const validWords = words.filter(word => word.term.trim() && word.definition.trim());

        if (validWords.length === 0) {
            setError('Please add at least one word and definition');
            return;
        }

        try {
            const response = await fetch('/crosswords/create', {
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

            if (!response.ok) {
                throw new Error('Failed to create crossword');
            }

            const data = await response.json();
            navigate(`/rendercrosswords/${data.id}`);

        } catch (error) {
            setError('Failed to create crossword. Please try again.');
            console.error('Error creating crossword:', error);
        }
    };

    return (
        <div className="createCrosswordContainer">
            <h1>Create a New Crossword</h1>
            
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
                            key={index}
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
                    <div className="errorMessage">
                        {error}
                    </div>
                )}

                <button type="submit" className="submitButton">
                    Create Crossword
                </button>
            </form>
        </div>
    );
}
export default EditCrossword