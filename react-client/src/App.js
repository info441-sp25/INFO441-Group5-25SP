import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from './pages/LogIn.js'
import Form from './pages/Form.js';
import SignIn from './components/SignIn.js';
import RenderCrosswordPage from './pages/RenderCrosswordPage.js'

function App() {
	const [user, setUser] = useState(null);
	const [crossswordID, setcrosswordID] = useState("")

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
		  <Routes>
			<Route path='' element={<LogIn user={user}/>}/>
	
			<Route path='form' element={<Form setcrosswordID={setcrosswordID} user={user} />}/>
	
			{/* <Route path='listcrosswords' element={<ListCrosswords />}/> */}
	
			{/* <Route path='/crossword' element={<RenderCrosswordPage />}/> */}
			<Route path='/crossword/:id' element={<RenderCrosswordPage />}/>
	
			{/* <Route path='rendercrossword/:crosswordID' element={<RenderCrossword crosswordID={crosswordID}/>}/> */}
	
		  </Routes>
		</BrowserRouter>
	);
}

export default App;