import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from './pages/game';
import Auth from './pages/auth';
import { io } from 'socket.io-client';
import Home from './pages/home';
const socket = io('http://localhost:3001');
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Auth socket={socket} />}
          />
          <Route
            path='/home'
            element={<Home socket={socket} />}
          />
          <Route
            path='/game'
            element={<Game socket={socket} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
