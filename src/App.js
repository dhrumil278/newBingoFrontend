import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from './pages/game';
import Auth from './pages/auth';
import { io } from 'socket.io-client';
import Home from './pages/home';
import OtpVerification from './pages/otpVerification';
const socket = io('https://dhrumil-bingo-1hs1.onrender.com'); // TODO Production
// const socket = io('http://localhost:3001');
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
          <Route
            path='/otpVerification'
            element={<OtpVerification socket={socket} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
