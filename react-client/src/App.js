import './App.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Crossword } from '@guardian/react-crossword'
import LogIn from './pages/LogIn.js'
import Form from './pages/Form.js';
import SignIn from './components/SignIn.js';
import RenderCrosswordPage from './pages/RenderCrosswordPage.js'


function App () {
  const [user, setUser] = useState(null);
  const [crossswordID, setcrosswordID] = useState("")

  // useEffect(() => {
  //   //??
  // });

  return (
    // <div className = 'container'>
    //   <h1 className='title'>Crossword Testing</h1>

    // </div>

    <BrowserRouter>
      <Routes>
        <Route path='' element={<LogIn onUserFetched={setUser}/>}/>

        <Route path='form' element={<Form setcrosswordID={setcrosswordID} user={user}/>}/>

        {/* <Route path='listcrosswords' element={<ListCrosswords />}/> */}

        <Route path='' element={<RenderCrosswordPage />}/>

        {/* <Route path='rendercrossword/:crosswordID' element={<RenderCrossword crosswordID={crosswordID}/>}/> */}

      </Routes>
    </BrowserRouter>
  );
}














export default App;
