import React, {useState, useEffect, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';

const MatchCentre = ({ userSubject, userName, matchId, setMatchId }) => {
    // const [activeMatches, setActiveMatches] = useState([]);
    // const [selectedMatchId, setSelectedMatchId] = useState('');
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

    // const getActiveMatches = () => {
    //     fetch(`http://localhost:8080/matches/active`,{
    //         method: 'GET',
    //         credentials: 'include'
    //     })
    //         .then((response) => {
    //             if (response.status === 401) {
    //                 throw new Error("Unauthorized");
    //             }
    //
    //             if (!response.ok) {
    //                 throw new Error("Something went wrong.");
    //             }
    //
    //             return response.json();
    //         })
    //         .then(data => {
    //             setActiveMatches(data);
    //         })
    //         .catch(error => {
    //             toast.error(error.message);
    //             console.error('Error getting active matches');
    //         });
    // };

    // const updateSelectedMatch = (id) => {
    //     setSelectedMatchId(id);
    //     setMatchId(id);
    //     localStorage.setItem('matchId', id);
    // }
    //
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
                body: JSON.stringify({ userSubject: userSubject, roundScore: scoreInput }),
            });
            setScoreInput(''); // clear input after sending
        } else {
            alert('WebSocket not connected.');
        }
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
