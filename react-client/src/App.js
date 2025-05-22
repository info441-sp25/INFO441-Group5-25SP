import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { Crossword } from '@guardian/react-crossword'

function App() {
	const [crossword, setCrossword] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCrossword = async () => {
			try {
				console.log('Fetching crossword...');
				const response = await fetch('http://localhost:3000/crosswords/682f6a2e78bd1e75ea73f6c1', {
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
