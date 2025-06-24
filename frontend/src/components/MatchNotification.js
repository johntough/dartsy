import { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import useWebSocket from '../hooks/useWebSocket';
import '../styles/notifications.css';

const MatchNotification = ({userSubject, onMatchUpdate, setMatchId}) => {

    const [matchRequest, setMatchRequest] = useState(null);

    const {subscribeToMatch} = useWebSocket({onMatchUpdate});

    useEffect(() => {
        if (!userSubject) return;

        const eventSource = new EventSourcePolyfill(`http://localhost:8080/sse/subscribe/${userSubject}`, {
            withCredentials: true
        });

        eventSource.addEventListener("match-request", (event) => {
            const payload = JSON.parse(event.data);
            setMatchRequest(payload);
        });

        eventSource.onerror = () => {
            console.error("SSE connection error");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [userSubject]);

    const handleAccept = () => {
        if (!matchRequest) return;

        setMatchId(matchRequest.matchId);
        subscribeToMatch(matchRequest.matchId);
        localStorage.setItem('matchId', matchRequest.matchId);
        setMatchRequest(null);
    };

    const handleReject = () => {
        setMatchRequest(null);
        // TODO: call to server to set match as rejected
    };

    return matchRequest ? (
        <div className="notification">
            <p>{matchRequest.message}</p>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleReject}>Reject</button>
        </div>
    ) : null;
};

export default MatchNotification;