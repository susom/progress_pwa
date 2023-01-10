import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {SessionContextProvider} from "./contexts/Session";

import BackgroundSelection from "./components/backgrounds";

import Landing from './views/Landing';
import Home from './views/Home';
import Settings from './views/Settings';
function App() {
  return (
      <SessionContextProvider>
          <BrowserRouter>
            <div className="view_box">
              <div className="view_body">
                <Routes>
                  <Route path='/' element={<Landing />} />
                  <Route path='/home' element={<Home />} />
                  <Route path='/settings' element={<Settings />} />
                </Routes>
              </div>
              <BackgroundSelection/>
            </div>
          </BrowserRouter>
      </SessionContextProvider>
  );
}

export default App;
