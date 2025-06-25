import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useWebSocket from '../hooks/useWebSocket';
import MatchNotification from "../components/MatchNotification";
import '../styles/scoreboard.css';

const MatchCentre = ({ isAuthenticated, userSubject, matchId, setMatchId, initiatorScores, setInitiatorScores, challengedUserScores, setChallengedUserScores }) => {
    const [scoreInput, setScoreInput] = useState('');

    const { connect, subscribeToMatch, sendScore } = useWebSocket({
        onMatchUpdate: (matchState) => {
            setInitiatorScores(matchState.initiatorUserMatchState.scores);
            setChallengedUserScores(matchState.challengedUserMatchState.scores);
        }
    });

    useEffect(() => {
        connect(() => {
            const localStorageMatchId = localStorage.getItem("matchId");
            if (!localStorageMatchId) return;

            fetch(`http://localhost:8080/match/restore/${localStorageMatchId}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then((response) => {
                    if (response.status === 401) {
                        throw new Error("Unauthorized");
                    }

                    if (!response.ok) {
                        throw new Error("Something went wrong.");
                    }

                    return response.json();
                })
                .then((matchState) => {
                    setInitiatorScores(matchState.initiatorUserMatchState.scores);
                    setChallengedUserScores(matchState.challengedUserMatchState.scores);
                    setMatchId(matchState.matchId)
                    subscribeToMatch(matchState.matchId);
                })
                .catch(error => {
                    toast.error(error.message);
                    console.error('Error restoring match');
                });
        });
    }, []);

    useEffect(() => {
        if (matchId) {
            subscribeToMatch(matchId);
        }
    }, [matchId]);

    const handleSubmitScore = () => {
        if (!scoreInput) {
            alert('Blank score not allowed!');
            return;
        }

        if (!matchId) {
            alert('Configure a match first!');
            return;
        }

        sendScore(matchId, userSubject, scoreInput);
        setScoreInput('');
    };

    return (
        <div>
            <div>
                <input
                    className="score-input"
                    name="scoreInput"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder="Enter score"
                />
                <button className="button" onClick={handleSubmitScore}>Submit Score</button>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                {initiatorScores.length > 0 && (
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {initiatorScores.map((score) => (
                            <tr key={score.roundIndex}>
                              <td>{score.roundIndex}</td>
                              <td className={score.roundScore >= 100 ? 'ton-plus-score' : ''}>
                                  {score.roundScore}</td>
                            </tr>
                        ))}
                        <tr>
                            <td><strong>Remaining</strong></td>
                            <td>
                                <strong>
                                    {501 - initiatorScores.reduce((sum, score) => sum + score.roundScore, 0)}
                                </strong>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                )}

                {challengedUserScores.length > 0 && (
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {challengedUserScores.map((score) => (
                            <tr key={score.roundIndex}>
                                <td>{score.roundIndex}</td>
                                <td className={score.roundScore >= 100 ? 'ton-plus-score' : ''}>
                                    {score.roundScore}</td>
                            </tr>
                        ))}
                        <tr>
                            <td><strong>Remaining</strong></td>
                            <td>
                                <strong>
                                    {501 - challengedUserScores.reduce((sum, score) => sum + score.roundScore, 0)}
                                </strong>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                )}
            </div>
            <div>
                {isAuthenticated && userSubject && <MatchNotification userSubject={userSubject} setMatchId={setMatchId}
                 onMatchUpdate={matchState => {
                     setInitiatorScores(matchState.initiatorUserMatchState.scores);
                     setChallengedUserScores(matchState.challengedUserMatchState.scores);
                 }
                } />}
            </div>
        </div>

    );
};
export default MatchCentre;
