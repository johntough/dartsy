
"use client";

import { useEffect, useCallback } from 'react';
import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {MatchData} from "@/lib/types";

const stompClient: { current: Client | null } = { current: null };
const subscription: { current: StompSubscription | null } = { current: null };
const currentMatchId: { current: string | null } = { current: null };
const isConnected: { current: boolean } = { current: false };
type OnConnectedCallback = () => void;

type UseWebSocketProps = {
    onMatchUpdateAction: (matchData: MatchData) => void;
};

export const useWebSocket = ({ onMatchUpdateAction } : UseWebSocketProps) => {

    const connectToWebSocket: (onConnected?: OnConnectedCallback) => void = useCallback((onConnected? : OnConnectedCallback) => {
        if (isConnected.current) {
            console.log('WebSocket already connected or connecting');
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                isConnected.current = true;
                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
                isConnected.current = false;
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                isConnected.current = false;
            }
        });

        client.activate();
        stompClient.current = client;
    }, []);

    const subscribeToRemoteMatch = useCallback((matchId: string): void => {
        if (!stompClient.current?.connected) {
            console.log('WebSocket not connected');
            return;
        }
        if (currentMatchId.current === matchId) {
            console.log('already subscribed to matchId');
            return;
        }

        if (subscription.current) {
            console.log('unsubscribing to current');
            subscription.current.unsubscribe();
        }

        currentMatchId.current = matchId;

        subscription.current = stompClient.current.subscribe(`/topic/match/${matchId}`, (message: IMessage) => {
            const matchState: MatchData = JSON.parse(message.body);
            console.log('update form websocket received');
            onMatchUpdateAction?.(matchState);
        });
        console.log('subscribed to matchId');
    }, [onMatchUpdateAction]);

    const updateRemoteMatchState = (matchId : string, matchData : MatchData) => {
        if (!stompClient.current?.connected) {
            alert("WebSocket not connected");
            return;
        }

        stompClient.current.publish({
            destination: `/app/match/remote/${matchId}/updateState`,
            body: JSON.stringify(matchData),
        });
    };

    const disconnectWebSocket = () => {
        if (subscription.current) {
            subscription.current.unsubscribe();
        }
        stompClient.current?.deactivate();
        isConnected.current = false;
    };

    useEffect(() => {
        return () => {
            disconnectWebSocket();
        };
    }, []);

    return {
        connectToWebSocket,
        subscribeToRemoteMatch,
        updateRemoteMatchState,
        disconnectWebSocket,
    };
};