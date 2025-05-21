import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { Crossword } from '@guardian/react-crossword'

/* 
const exampleData = {
	id: 'crosswords/example/1',
	number: 1,
	name: 'Example crossword No 1',
	creator: {
		name: 'James',
		webUrl: 'https://www.theguardian.com/profile/maskarade',
	},
	date: 1740149419743,
	webPublicationDate: 1740149419743,
	entries: [
		{
			id: '1-across',
			number: 1,
			humanNumber: '1',
			clue: 'Toy on a string (2-2)',
			direction: 'across',
			length: 4,
			group: ['1-across'],
			position: { x: 0, y: 0 },
			separatorLocations: {
				'-': [2],
			},
			solution: 'YOYO',
		},
		{
			id: '2-across',
			number: 2,
			humanNumber: '2',
			clue: 'Have a rest (3,4)',
			direction: 'across',
			length: 7,
			group: ['2-across'],
			position: { x: 0, y: 2 },
			separatorLocations: {
				',': [3],
			},
			solution: 'LIEDOWN',
		},
		{
			id: '1-down',
			number: 1,
			humanNumber: '1',
			clue: 'Colour (6)',
			direction: 'down',
			length: 6,
			group: ['1-down'],
			position: { x: 0, y: 0 },
			separatorLocations: {},
			solution: 'YELLOW',
		},
		{
			id: '3-down',
			number: 3,
			humanNumber: '3',
			clue: 'Bits and bobs (4,3,4)',
			direction: 'down',
			length: 7,
			group: ['3-down', '4-down'],
			position: { x: 3, y: 0 },
			separatorLocations: {
				',': [4],
			},
			solution: 'ODDSAND',
		},
		{
			id: '4-down',
			number: 4,
			humanNumber: '4',
			clue: 'See 3 down',
			direction: 'down',
			length: 4,
			group: ['3-down', '4-down'],
			position: {
				x: 6,
				y: 1,
			},
			separatorLocations: {},
			solution: 'ENDS',
		},
	],
	solutionAvailable: true,
	dateSolutionAvailable: 1542326400000,
	dimensions: {
		cols: 13,
		rows: 13,
	},
	crosswordType: 'quick',
	pdf: 'https://crosswords-static.guim.co.uk/gdn.quick.20250221.pdf',
}
*/

function App() {
	const [crossword, setCrossword] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCrossword = async () => {
			try {
				console.log('Fetching crossword...');
				const response = await fetch('http://localhost:3000/crosswords/682d930cd60896057b0c2953', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				});
				
				console.log('Response status:', response.status);
				console.log('Response headers:', response.headers);
				
				if (!response.ok) {
					const text = await response.text();
					console.error('Error response:', text);
					throw new Error(`Failed to fetch crossword: ${response.status} ${response.statusText}`);
				}
				
				const data = await response.json();
				console.log('Received data:', data);
				setCrossword(data);
				setLoading(false);
			} catch (err) {
				console.error('Error details:', err);
				setError(err.message);
				setLoading(false);
			}
		};

		fetchCrossword();
	}, []);

	if (loading) return <div>Loading crossword...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!crossword) return <div>No crossword available</div>;

	return (
		<div style={{ maxWidth: '500px', margin: '0 auto' }}>
			<h1>{crossword.name}</h1>
			<Crossword data={crossword} />
		</div>
	);
}

export default App;
