import './App.css';
import React, { useState, useEffect } from 'react'
import { Crossword } from '@guardian/react-crossword'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import LogIn from './pages/LogIn.js'
import Form from './pages/Form.js';
import SignIn from './components/SignIn.js';
import RenderCrosswordPage from './pages/RenderCrosswordPage.js'
import ViewCrosswords from './pages/ViewCrosswords.js';
import Header from './components/header.js';
import CreateCrossword from './pages/CreateCrossword.js';
import SearchCrosswords from './pages/SearchCrosswords.js';
import EditCrossword from './pages/EditCrossword.js';

function App() {
	const [user, setUser] = useState(null);
	const [crossswordID, setcrosswordID] = useState("")

	// const [crossword, setCrossword] = useState(null);
	// const [loading, setLoading] = useState(true);
	// const [error, setError] = useState(null);

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



	return (	
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='' element={<LogIn user={user}/>}/>
		
				<Route path='/form' element={<Form setcrosswordID={setcrosswordID} user={user} />}/>

				<Route path='/viewcrosswords/user/:user' element={<ViewCrosswords currentUser={user}/>}/>

				{/* Needs to always come before rendercrosswords */}
				<Route path="/search/:search" element={<SearchCrosswords/>} />

				<Route path='/rendercrosswords/:id' element={<RenderCrosswordPage/>}/>
		
				{/* <Route path='' element={<RenderCrosswordPage />}/> */}
		
				{/* <Route path='rendercrossword/:crosswordID' element={<RenderCrossword crosswordID={crosswordID}/>}/> */}

				<Route path='/createcrossword' element={<CreateCrossword user={ user }/>}/>

				<Route path="*" element={<Form setcrosswordID={setcrosswordID} user={user} />}/>

				<Route path="/editcrossword/:id" element={<EditCrossword />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;