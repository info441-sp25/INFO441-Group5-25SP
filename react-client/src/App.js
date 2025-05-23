import './App.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Crossword } from '@guardian/react-crossword'
import LogIn from './pages/LogIn.js'
import Form from './pages/Form.js';
import SignIn from './components/SignIn.js';
import RenderCrosswordPage from './pages/RenderCrosswordPage.js'
import ViewCrosswords from './pages/ViewCrosswords.js';
import Header from './components/Header.js';


function App () {
  const [user, setUser] = useState(null);
  const [crossswordID, setcrosswordID] = useState("")

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

  return (
    // <div className = 'container'>
    //   <h1 className='title'>Crossword Testing</h1>

    // </div>

    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='' element={<LogIn user={user}/>}/>

        <Route path='form' element={<Form setcrosswordID={setcrosswordID} user={user} />}/>

        {/* <Route path='listcrosswords' element={<ListCrosswords />}/> */}

        {/* <Route path='' element={<RenderCrosswordPage />}/> */}

        {/* <Route path='rendercrossword/:crosswordID' element={<RenderCrossword crosswordID={crosswordID}/>}/> */}

        <Route path='/crosswords/user/:user' element={<ViewCrosswords />}/>

        <Route path='/crosswords/:id' element={<RenderCrosswordPage />}/>

        {/* <Route path='rendercrossword/:crosswordID' element={<RenderCrossword crosswordID={crosswordID}/>}/> */}

      </Routes>
    </BrowserRouter>
  );
}














export default App;
