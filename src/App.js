import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import React from 'react';
import {SessionContextProvider} from "./contexts/Session";
import BackgroundSelection from "./components/Backgrounds/backgrounds";
import Landing from './views/Landing';
import Home from './views/Home';
import Settings from './views/Settings';

function App() {
  return (
      <SessionContextProvider>
          <BrowserRouter>
            <div className="view_box" style={{height:'100%'}}>
              <div className="view_body" style={{height:'100%'}}>
                <Routes>
                  <Route path='/' element={<Landing />} />
                  <Route path='/home' element={<Home />} />
                  <Route path='/settings' element={<Settings />} />
                </Routes>
              </div>
              {/* <BackgroundSelection/> */}
            </div>
          </BrowserRouter>
      </SessionContextProvider>
  );
}

export default App;
