import { useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = { current: null };
const subscription = { current: null };
const currentMatchId = { current: null };

const useWebSocket = ({ onMatchUpdate }) => {

    const connect = useCallback((onConnected) => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;
    }, []);

    const subscribeToMatch = useCallback((matchId) => {
        if (!stompClient.current?.connected) return;
        if (currentMatchId.current === matchId) return;

        if (subscription.current) {
            subscription.current.unsubscribe();
        }

        currentMatchId.current = matchId;

        subscription.current = stompClient.current.subscribe(`/topic/match/${matchId}`, (message) => {
            const matchState = JSON.parse(message.body);
            onMatchUpdate?.(matchState);
        });
    }, [onMatchUpdate]);

    const sendScore = (matchId, userSubject, scoreInput) => {
        if (!stompClient.current?.connected) {
            alert("WebSocket not connected");
            return;
        }

        stompClient.current.publish({
            destination: `/app/match/${matchId}/score`,
            body: JSON.stringify({ userSubject, roundScore: scoreInput }),
        });
    };

    const disconnect = () => {
        if (subscription.current) {
            subscription.current.unsubscribe();
        }
        stompClient.current?.deactivate();
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return {
        connect,
        subscribeToMatch,
        sendScore,
        disconnect,
    };
};

export default useWebSocket;