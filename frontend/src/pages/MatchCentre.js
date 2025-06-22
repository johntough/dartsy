import React, {useState, useEffect, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';

const MatchCentre = ({ userId, userName }) => {
    const [matchId, setMatchId] = useState('');
    const [activeMatches, setActiveMatches] = useState([]);
    const [selectedMatchId, setSelectedMatchId] = useState('');
    const [scoreInput, setScoreInput] = useState('');
    const [scores, setScores] = useState([]);
    const stompClient = useRef(null);
    const subscription = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');

                const localStorageMatchId = localStorage.getItem("matchId");
                if (!localStorageMatchId) return;

                fetch(`http://localhost:8080/match/restore/${localStorageMatchId}`,{
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
                        setScores(matchState.userMatchStateList[0].scores);
                        setMatchId(matchState.matchId)
                        subscribeToMatch(matchState.matchId);
                    })
                    .catch(error => {
                        toast.error(error.message);
                        console.error('Error restoring match');
                    });

            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;

        // Cleanup on unmount
        return () => {
            if (subscription.current) {
                subscription.current.unsubscribe();
            }
            client.deactivate();
        };
    }, []);

    useEffect(() => {
        if (matchId && stompClient.current && stompClient.current.connected) {
            subscribeToMatch(matchId);
        }
    }, [matchId]);

    // TODO: You should only be able to do this if you don't have an active match. i.e. you need to finish or terminate your active match (if there is one)
    const configureMatch = () => {

        const matchConfig = {
            userId: userId
        };

        fetch(`http://localhost:8080/match/configure`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(matchConfig)
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    throw new Error("Something went wrong.");
                }

                return response.text();
            })
            .then((matchId) => {
                setMatchId(matchId);
                localStorage.setItem('matchId', matchId);
            })
            .catch(error => {
                toast.error(error.message);
                console.error('Error configuring match');
            });
    };

    const getActiveMatches = () => {
        fetch(`http://localhost:8080/matches/active`,{
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
            .then(data => {
                setActiveMatches(data);
            })
            .catch(error => {
                toast.error(error.message);
                console.error('Error getting active matches');
            });
    };

    const updateSelectedMatch = (id) => {
        setSelectedMatchId(id);
        setMatchId(id);
        localStorage.setItem('matchId', id);
    }

    const subscribeToMatch = (id) => {
        // Unsubscribe previous if any
        if (subscription.current) {
            subscription.current.unsubscribe();
        }

        subscription.current = stompClient.current.subscribe(
            `/topic/match/${id}`,
            (message) => {
                const matchState = JSON.parse(message.body);
                setScores(matchState.userMatchStateList[0].scores);
            }
        );
    }

    const submitScore = () => {

        if (!scoreInput) {
            alert('Blank score not allowed!');
            return;
        }

        if (!matchId) {
            alert('Configure a match first!');
            return;
        }
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app/match/${matchId}/score`,
                body: JSON.stringify({ userId: userId, roundScore: scoreInput }),
            });
            setScoreInput(''); // clear input after sending
        } else {
            alert('WebSocket not connected.');
        }
    };

    return (
        <div>
            <div>
                {userId ? (
                    <p>Welcome, {userName}! Your ID is {userId}.</p>
                ) : (
                    <p>Please log in.</p>
                )}
            </div>
            <button className="button" onClick={configureMatch}>Configure Match</button>
            <p>Match ID: {matchId || 'Not configured'}</p>
           <div>
               <select
                   className="match-search-select"
                   value={selectedMatchId}
                   onChange={(e) => updateSelectedMatch(e.target.value)}
               >
                   <option value="">-- Select a Match --</option>
                   {activeMatches.map(matchId => (
                       <option key={matchId} value={matchId}>
                           {matchId}
                       </option>
                   ))}
               </select>
               <button className="button" onClick={getActiveMatches}>Search for active matches</button>
           </div>
            <div>
                <input
                    className="score-input"
                    name="scoreInput"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder="Enter score"
                />
                <button className="button" onClick={submitScore}>Submit Score</button>
            </div>
            {scores.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scores.map((score) => (
                        <tr key={score.roundIndex}>
                          <td>{score.roundIndex}</td>
                          <td>{score.roundScore}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default MatchCentre;
