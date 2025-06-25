import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useWebSocket from '../hooks/useWebSocket';
import MatchNotification from "../components/MatchNotification";
import '../styles/scoreboard.css';

const MatchCentre = ({ isAuthenticated, userSubject, matchId, setMatchId, initiatorScores, setInitiatorScores, challengedUserScores, setChallengedUserScores }) => {
    const [scoreInput, setScoreInput] = useState('');
    const [initiatorUserName, setInitiatorUserName] = useState('');
    const [challengedUserName, setChallengedUserName] = useState('');

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
                    // TODO: this should be set once match is accepted and not on every score update
                    setInitiatorUserName(matchState.initiatorUserMatchState.name)
                    setChallengedUserName(matchState.challengedUserMatchState.name)
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
                {initiatorScores.length > 0 || challengedUserScores.length > 0 ? (() => {
                        const playedRoundIndices = new Set([
                            ...initiatorScores.map(s => s.roundIndex),
                            ...challengedUserScores.map(s => s.roundIndex)
                        ]);

                        const initiatorMap = Object.fromEntries(
                            initiatorScores.map(score => [score.roundIndex, score])
                        );
                        const challengedMap = Object.fromEntries(
                            challengedUserScores.map(score => [score.roundIndex, score])
                        );


                        const maxPlayedRoundIndex = Math.max(...playedRoundIndices);
                        // +1 as the array is 1-based
                        const rounds = Array.from({ length: maxPlayedRoundIndex }, (_, i) => i + 1);

                        const initiatorRemaining = 501 - initiatorScores.reduce((sum, s) => sum + s.roundScore, 0);
                        const challengedRemaining = 501 - challengedUserScores.reduce((sum, s) => sum + s.roundScore, 0);

                    return (
                        <>
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>{initiatorUserName}</th>
                                </tr>
                                <tr>
                                    <th>#</th>
                                    <th>Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rounds.map(i => (
                                    <tr key={i}>
                                        <td>{i}</td>
                                        <td className={initiatorMap[i]?.roundScore >= 100 ? 'ton-plus-score' : ''}>
                                            {initiatorMap[i]?.roundScore ?? '-'}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>Remaining</strong></td>
                                    <td><strong>{initiatorRemaining}</strong></td>
                                </tr>
                                </tbody>
                            </table>

                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>{challengedUserName}</th>
                                </tr>
                                <tr>
                                    <th>#</th>
                                    <th>Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rounds.map(i => (
                                    <tr key={i}>
                                        <td>{i}</td>
                                        <td className={challengedMap[i]?.roundScore >= 100 ? 'ton-plus-score' : ''}>
                                            {challengedMap[i]?.roundScore ?? '-'}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td><strong>Remaining</strong></td>
                                    <td><strong>{challengedRemaining}</strong></td>
                                </tr>
                                </tbody>
                            </table>
                        </>
                    );
                })() : null}
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
