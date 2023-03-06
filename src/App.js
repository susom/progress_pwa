import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import React, { useEffect } from 'react';
import { SessionContextProvider } from "./contexts/Session";
import { DatabaseContextProvider } from "./contexts/Database";

import Landing from './views/Landing';
import Home from './views/Home';
import Settings from './views/Settings';
import Login from './views/Login';

function App() { //Props passed via offline parent 

  // useEffect(() => {
  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, []);

  // const handleUnload = (e) => {
  //   const message = "o/";
  //   (e || window.event).returnValue = message; //Gecko + IE
  //   return message;
  // };

  return (
    <DatabaseContextProvider>
      <SessionContextProvider>
        <BrowserRouter>
          <div className="view_box" style={{ height: '100%' }}>
            <div className="view_body" style={{ height: '100%' }}>
              <Routes>
                <Route path='/' element={<Landing  />} />
                <Route
                  path='/home'
                  element={<Home />}
                />
                <Route path='/settings' element={<Settings />} />
                <Route path='/login' element={<Login  />} />
              </Routes>
            </div>
            {/* <BackgroundSelection/> */}
          </div>
        </BrowserRouter>
      </SessionContextProvider>
    </DatabaseContextProvider>
  );
}

export default App;
