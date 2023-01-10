import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Landing from './views/Landing';
import Home from './views/Home';
import Settings from './views/Settings';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
