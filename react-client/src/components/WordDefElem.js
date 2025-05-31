import React from 'react';

function WordDefElem({ word, index, onUpdate, onRemove, canRemove }) {
    return (
        <div className="wordDefContainer">
            <div className="wordDefRow">
                <div className="wordInputContainer">
                    <label htmlFor={`term${index}`} className="createCrosswordLabel">
                        Word:
                    </label>
                    <input
                        type="text"
                        id={`term${index}`}
                        value={word.term}
                        onChange={(e) => onUpdate(index, 'term', e.target.value)}
                        className="createCrosswordInput"
                        placeholder="Enter a word"
                    />
                </div>
                <div className="definitionInputContainer">
                    <label htmlFor={`definition${index}`} className="createCrosswordLabel">
                        Definition:
                    </label>
                    <input
                        type="text"
                        id={`definition${index}`}
                        value={word.definition}
                        onChange={(e) => onUpdate(index, 'definition', e.target.value)}
                        className="createCrosswordInput"
                        placeholder="Enter the definition"
                    />
                </div>
                {canRemove && (
                    <button type="button" onClick={() => onRemove(index)} className="removeWordButton">
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
}

export default WordDefElem; 