import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import GoogleAuthButton from "./components/GoogleAuthButton";
import MatchConfiguration from "./pages/MatchConfiguration";
import MatchCentre from './pages/MatchCentre';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userSubject, setUserSubject] = useState(null);
    const [userName, setUserName] = useState(null);
    const [matchId, setMatchId] = useState(null);
    const [initiatorScores, setInitiatorScores] = useState([]);
    const [challengedUserScores, setChallengedUserScores] = useState([]);

    return (
      <div className="App">
        <header className="App-header">
          <GoogleAuthButton setUserSubject={setUserSubject} setUserName={setUserName} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
            <div>
                {userSubject ? (
                    <p>Welcome, {userName}! Your ID is {userSubject}.</p>
                ) : (
                    <p>Please log in.</p>
                )}
            </div>
          <MatchConfiguration userSubject={userSubject} userName={userName} matchId={matchId} setMatchId={setMatchId}/>
          <MatchCentre isAuthenticated={isAuthenticated} userSubject={userSubject} matchId={matchId} setMatchId={setMatchId} initiatorScores={initiatorScores} setInitiatorScores={setInitiatorScores} challengedUserScores={challengedUserScores} setChallengedUserScores={setChallengedUserScores}/>
        </header>
          <ToastContainer />

      </div>
    );
}

export default App;