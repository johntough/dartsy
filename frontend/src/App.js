import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import GoogleAuthButton from "./components/GoogleAuthButton";
import GameConfiguration from "./pages/GameConfiguration";
import MatchCentre from './pages/MatchCentre';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';


function App() {

    const [userSubject, setUserSubject] = useState(null);
    const [userName, setUserName] = useState(null);
    const [matchId, setMatchId] = useState(null);

    return (
      <div className="App">
        <header className="App-header">
          <GoogleAuthButton setUserSubject={setUserSubject} setUserName={setUserName}/>
            <div>
                {userSubject ? (
                    <p>Welcome, {userName}! Your ID is {userSubject}.</p>
                ) : (
                    <p>Please log in.</p>
                )}
            </div>
          <GameConfiguration userSubject={userSubject} userName={userName} matchId={matchId} setMatchId={setMatchId}/>
          <MatchCentre userSubject={userSubject} userName={userName} matchId={matchId} setMatchId={setMatchId}/>
        </header>
          <ToastContainer />
      </div>
    );
}

export default App;