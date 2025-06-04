import React from 'react';

function WordDefElem({ word, onUpdate, onRemove, canRemove }) {
    return (
        <div className="wordDefContainer">
            <div className="wordDefRow">
                <div className="wordInputContainer">
                    <label htmlFor={`term${word.id}`} className="createCrosswordLabel">
                        Word:
                    </label>
                    <input
                        type="text"
                        id={`term${word.id}`}
                        value={word.term.toUpperCase()} // always display uppercase
                        onChange={(e) => onUpdate(word.id, 'term', e.target.value)}
                        className="createCrosswordInput"
                        placeholder="Enter a word"
                    />
                </div>
                <div className="definitionInputContainer">
                    <label htmlFor={`definition${word.id}`} className="createCrosswordLabel">
                        Definition:
                    </label>
                    <input
                        type="text"
                        id={`definition${word.id}`}
                        value={word.definition}
                        onChange={(e) => onUpdate(word.id, 'definition', e.target.value)}
                        className="createCrosswordInput"
                        placeholder="Enter the definition"
                    />
                </div>
                {canRemove && (
                    <button type="button" onClick={() => onRemove(word.id)} className="removeWordButton">
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
}

export default WordDefElem;