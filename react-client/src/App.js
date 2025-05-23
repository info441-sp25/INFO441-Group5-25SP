import './App.css';
import React, { useState, useEffect } from 'react'
import { Crossword } from '@guardian/react-crossword'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import LogIn from './pages/LogIn.js'
import Form from './pages/Form.js';
import SignIn from './components/SignIn.js';
import RenderCrosswordPage from './pages/RenderCrosswordPage.js'

function App() {
	const [user, setUser] = useState(null);
	const [crossswordID, setcrosswordID] = useState("")

	const [crossword, setCrossword] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log("user info***z: " + user)
		//console.log("crosswordID: " + crosswordID)
	});

	useEffect(() => {
		fetch('/users/myIdentity')
			.then(res => res.json())
			.then(data => {
				if (data.status === "loggedin") {
					console.log("user info here" + data.userInfo)
					setUser(data.userInfo);
				} else {
					setUser(null);
				}
			});
	}, []);

	useEffect(() => {
		const fetchCrossword = async () => {
			try {
				console.log('Fetching crossword...');
				const response = await fetch('http://localhost:4000/crosswords/682f6a2e78bd1e75ea73f6c1', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					credentials: 'include'
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

	// return (
	// 	<div style={{ maxWidth: '500px', margin: '0 auto' }}>
	// 		<h1>{crossword.name}</h1>
	// 		<Crossword data={crossword} />
	// 	</div>
	// );

	return (
		// <div className = 'container'>
		//   <h1 className='title'>Crossword Testing</h1>
		// </div>
	
		<BrowserRouter>
		  <Routes>
			<Route path='' element={<LogIn user={user}/>}/>
	
			<Route path='form' element={<Form setcrosswordID={setcrosswordID} user={user} />}/>
	
			{/* <Route path='listcrosswords' element={<ListCrosswords />}/> */}
	
			<Route path='' element={<RenderCrosswordPage />}/>
	
			{/* <Route path='rendercrossword/:crosswordID' element={<RenderCrossword crosswordID={crosswordID}/>}/> */}
	
		  </Routes>
		</BrowserRouter>
	);
}

export default App;