
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  adjustDifficulty,
  type AdjustDifficultyInput,
} from "@/ai/flows/ai-opponent-difficulty-tuning";
import { CHECKOUT_DATA } from "@/lib/checkout-data";
import type {
    MatchData,
    UserMatchState,
    RoundScore,
    GameMode as BackendGameMode,
    MatchConfigRequest,
    MatchRequestPayload
} from "@/lib/types";
import {useWebSocket} from "@/hooks/use-websocket";
import { EventSourcePolyfill } from "event-source-polyfill";

export type Player = "player1" | "player2";
export type GameMode = "2p" | "ai" | "remote";
export type AiLevelLabel = 'newbie' | 'beginner' | 'pub' | 'county' | 'pro';

const stringToAiLevel: Record<AiLevelLabel, AiLevel> = {
    newbie: 1,
    beginner: 2,
    pub: 3,
    county: 4,
    pro: 5,
};

export type PlayerProfile = {
  id: number;
  name: string;
  idpSubject: string;
  email: string;
  location: string; // country code
};

export type LifetimeStats = {
    gamesPlayed: number;
    gamesWon: number;
    winPercentage: number;
    oneHundredPlusScores: number;
    oneHundredFortyPlusScores: number;
    oneHundredEightyScores: number;
    lifetimeAverage: number;
    highestCheckout: number;
    bestLeg: number;
    numberOfDartsThrown: number;
    totalScore: number;
};

// Types aligned with frontend state
export type LegHistory = { player1: RoundScore[]; player2: RoundScore[] };

export type PlayerStats = {
    highestCheckout: number;
    bestLeg: number; // in darts
    oneHundredAndEightyCount: number;
    oneHundredAndFortyCount: number;
    oneHundredCount: number;
    totalMatchScore: number;
    totalMatchDartsThrown: number;
};

export type GameAverages = { player1: number; player2: number };

export type GameConfig = {
  initialScore: number;
  legs: number;
  gameMode: GameMode;
  legsWon: { player1: number; player2: number };
  player1Name: string;
  player2Name: string;
  player2Subject: string;
  player1Location: string;
  aiLevel: AiLevelLabel;
};

const INITIAL_PLAYER_STATS: PlayerStats = {
  highestCheckout: 0,
  bestLeg: Infinity,
  oneHundredAndEightyCount: 0,
  oneHundredAndFortyCount: 0,
  oneHundredCount: 0,
  totalMatchScore: 0,
  totalMatchDartsThrown: 0,
};

const INITIAL_STATS: { player1: PlayerStats, player2: PlayerStats } = {
  player1: { ...INITIAL_PLAYER_STATS },
  player2: { ...INITIAL_PLAYER_STATS },
};

const INITIAL_GAME_CONFIG: GameConfig = {
  initialScore: 501,
  legs: 5,
  gameMode: "2p",
  legsWon: { player1: 0, player2: 0 },
  player1Name: "Player 1",
  player2Name: "Player 2",
  player1Location: "none",
  aiLevel: "pub",
};

const INITIAL_PROFILE: PlayerProfile = {
  id: 0,
  name: "",
  email: "",
  idpSubject: "",
  location: "none",
};

const DEFAULT_MATCH_REQUEST_PAYLOAD: MatchRequestPayload = {
    matchId: '',
    initiatorUserName: '',
    initiatorUserSubject: '',
    initiatorUserLocation: '',
    initialStartingScore: 501,
    totalLegs: 3,
};

const INITIAL_LIFETIME_STATS: LifetimeStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: 0,
    oneHundredPlusScores: 0,
    oneHundredFortyPlusScores: 0,
    oneHundredEightyScores: 0,
    lifetimeAverage: 0,
    highestCheckout: 0,
    bestLeg: 0,
    numberOfDartsThrown: 0,
    totalScore: 0
};

const AI_LEVEL_SETTINGS = {
    newbie: { min: 25, max: 45, checkoutChance: 0.05, level: 1 as const },
    beginner: { min: 30, max: 60, checkoutChance: 0.1, level: 2 as const },
    pub: { min: 55, max: 70, checkoutChance: 0.25, level: 3 as const },
    county: { min: 65, max: 95, checkoutChance: 0.4, level: 4 as const },
    pro: { min: 90, max: 110, checkoutChance: 0.6, level: 5 as const },
};

const BOGEY_NUMBERS = [169, 168, 166, 165, 163, 162, 159];

const saveProfileToBackend = async (profile: PlayerProfile): Promise<void> => {
  console.log("Saving profile to backend:", profile);

  fetch(`http://localhost:8080/user/${profile.idpSubject}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(profile)
  }).then(response => {
      if (response.status === 401) {
          throw new Error("Unauthorized");
      }

      if (!response.ok) {
          throw new Error("Something went wrong.");
      }
      console.log("Profile saved successfully.");
  }).catch(() => {
      throw new Error("Something went wrong.");
  });
};

const fetchLifetimeStatsFromBackend = async (profile: PlayerProfile): Promise<LifetimeStats> => {
    console.log("Fetching lifetime stats from backend...");

    const stats: LifetimeStats = {
        gamesPlayed: 0,
        gamesWon: 0,
        winPercentage: 0,
        oneHundredPlusScores: 0,
        oneHundredFortyPlusScores: 0,
        oneHundredEightyScores: 0,
        lifetimeAverage: 0,
        highestCheckout: 0,
        bestLeg: 0,
        numberOfDartsThrown: 0,
        totalScore: 0
    };

    try {
        const response = await fetch(`http://localhost:8080/user/${profile.idpSubject}/lifetimeStats`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
            throw new Error("Something went wrong.");
        }

        const data = await response.json();

        stats.gamesPlayed = data.gamesPlayed;
        stats.gamesWon = data.gamesWon;
        if (data.gamesPlayed > 0) {
            stats.winPercentage = (data.gamesWon / data.gamesPlayed) * 100;
        }

        stats.oneHundredPlusScores = data.oneHundredPlusScores;
        stats.oneHundredFortyPlusScores = data.oneHundredFortyPlusScores;
        stats.oneHundredEightyScores = data.oneHundredEightyScores;
        stats.highestCheckout = data.highestCheckout;
        stats.bestLeg = data.bestLeg;
        if (data.numberOfDartsThrown > 0) {
            stats.lifetimeAverage = (data.totalScore / data.numberOfDartsThrown) * 3;
        }
        stats.numberOfDartsThrown = data.numberOfDartsThrown;
        stats.totalScore = data.totalScore;

        console.log("Lifetime stats fetched:", stats);
    } catch (error) {
        console.error('Error returning lifetime stats', error);
    }
    return stats;
}


export function useGame() {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const [inputValue, setInputValue] = useState("");
  const [winner, setWinner] = useState<Player | null>(null);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);
  const [rounds, setRounds] = useState(0); // This is leg-specific, needs reset.
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const [isLegWon, setIsLegWon] = useState(false);
  const [isMatchWinnerDialogOpen, setIsMatchWinnerDialogOpen] = useState(false);

  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<{player: Player; score: number} | null>(null);
  
  const [showAverage, setShowAverage] = useState(true);

  const [checkoutSuggestions, setCheckoutSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const [isDartboardOpen, setIsDartboardOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile>(INITIAL_PROFILE);

  const [isStatsVisible, setIsStatsVisible] = useState(false);
  
  const [isProfilePageVisible, setIsProfilePageVisible] = useState(false);
  const toggleProfilePage = () => setIsProfilePageVisible(prev => !prev);

  const [isHowToPlayVisible, setIsHowToPlayVisible] = useState(false);
  const toggleHowToPlay = () => setIsHowToPlayVisible(prev => !prev);

  const [isLifetimeStatsVisible, setIsLifetimeStatsVisible] = useState(false);
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats>(INITIAL_LIFETIME_STATS);

  const [isMatchRequestNotificationOpen, setIsMatchRequestNotificationOpen] = useState(false);
  const [matchRequestConfig, setMatchRequestConfig] = useState<MatchRequestPayload>(DEFAULT_MATCH_REQUEST_PAYLOAD);
  
  const { toast } = useToast();

  const {
    connectToWebSocket,
    subscribeToRemoteMatch,
    updateRemoteMatchState
  } = useWebSocket({
        onMatchUpdateAction: (matchData : MatchData) => {
            restoreGameFromData(matchData);
        }
    });

    const fetchMatchStateFromBackend = async (): Promise<MatchData | null> => {
        console.log("Attempting to fetch match state from backend...");

        const localStorageMatchId = localStorage.getItem("matchId");
        if (!localStorageMatchId) return null;

        try {
            const response = await fetch(`http://localhost:8080/match/restore/${localStorageMatchId}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                throw new Error("Something went wrong.");
            }

            await establishWebSocketConnection();
            return await response.json();
        } catch (error) {
            console.error('Error restoring match', error);
            return null;
        }
    }

  const establishWebSocketConnection = async (): Promise<void> => {
     // Step 1: re-establish the connection to the websocket
     connectToWebSocket(() => {
       // Step 2: if a match is in progress then subscribe to that topic
       const localStorageMatchId = localStorage.getItem("matchId");
       if (!localStorageMatchId) return;
       subscribeToRemoteMatch(localStorageMatchId);
     });
  }

  const restoreGameFromData = useCallback((data: MatchData) => {
    setMatchData(data);
    setIsGameStarted(true);
    // Reset transient state that isn't saved
    setInputValue("");
    setWinner(null);
    setMatchWinner(data.matchStatus === 'COMPLETED' ? (data.initiatorUserMatchState.legsWon > data.challengedUserMatchState.legsWon ? 'player1' : 'player2') : null);
    setIsAiThinking(false);
    setIsLegWon(false);
    setIsCheckoutPending(false);
    setPendingCheckout(null);
  }, []);

  // On mount, try to restore game state
  useEffect(() => {
    const restore = async () => {
        const data = await fetchMatchStateFromBackend();
        if (data) {
            restoreGameFromData(data);
        }
    };
    restore();
  }, [restoreGameFromData]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const eventSource = new EventSourcePolyfill(`http://localhost:8080/sse/subscribe/${profile.idpSubject}`, {
      withCredentials: true,
    });

    eventSource.addEventListener("match-request", (event) => {
      console.log("SSE match-request received");
      const message = event as MessageEvent;
      const payload: MatchRequestPayload = JSON.parse(message.data);

      setMatchRequestConfig(payload);
      setIsMatchRequestNotificationOpen(true);
    });

    eventSource.onerror = () => {
      console.log("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Clean up when component unmounts or isLoggedIn becomes false
    };
  }, [isLoggedIn]);
  
  const gameConfig: GameConfig | null = useMemo(() => {
    if (!matchData) return null;
    const mapGameMode = (mode: BackendGameMode): GameMode => {
        if (mode === 'LOCAL') return '2p';
        if (mode === 'AI') return 'ai';
        return 'remote';
    }
    const mapAiLevel = (level?: number): AiLevelLabel => {
        for (const key in AI_LEVEL_SETTINGS) {
            const aiLevelKey = key as AiLevelLabel;
            if (AI_LEVEL_SETTINGS[aiLevelKey].level === level) {
                return aiLevelKey;
            }
        }
        return 'pub'; // fallback
    }
    return {
        initialScore: matchData.initialStartingScore,
        legs: matchData.totalLegs,
        gameMode: mapGameMode(matchData.gameMode),
        aiLevel: mapAiLevel(matchData.aiLevel),
        player1Name: matchData.initiatorUserMatchState.name,
        player2Name: matchData.challengedUserMatchState.name,
        player1Location: matchData.initiatorUserMatchState.location,
        legsWon: {
            player1: matchData.initiatorUserMatchState.legsWon,
            player2: matchData.challengedUserMatchState.legsWon,
        }
    }
  }, [matchData]);

  const scores = useMemo(() => {
    if (!matchData) return { player1: 0, player2: 0 };
    const p1Score = matchData.initialStartingScore - matchData.initiatorUserMatchState.scores.reduce((sum, s) => sum + s.roundScore, 0);
    const p2Score = matchData.initialStartingScore - matchData.challengedUserMatchState.scores.reduce((sum, s) => sum + s.roundScore, 0);
    return { player1: p1Score, player2: p2Score };
  }, [matchData]);
  
  const currentPlayer = useMemo(() => matchData?.currentTurnPlayerSubject === "user1_subject" ? "player1" : "player2", [matchData]);
  const legStarter = useMemo(() => matchData?.currentLegStarterPlayerSubject === "user1_subject" ? "player1" : "player2", [matchData]);

  const stats = useMemo(() => {
    if (!matchData) return INITIAL_STATS;
    const mapStateToStats = (state: UserMatchState): PlayerStats => ({
        highestCheckout: state.highestCheckout,
        bestLeg: state.bestLeg,
        oneHundredAndEightyCount: state.oneHundredAndEightyCount,
        oneHundredAndFortyCount: state.oneHundredAndFortyCount,
        oneHundredCount: state.oneHundredCount,
        totalMatchScore: state.totalMatchScore,
        totalMatchDartsThrown: state.totalMatchDartsThrown
    });
    return {
        player1: mapStateToStats(matchData.initiatorUserMatchState),
        player2: mapStateToStats(matchData.challengedUserMatchState)
    }
  }, [matchData]);

  const legHistory = useMemo(() => {
    if (!matchData) return { player1: [], player2: [] };
    return {
        player1: matchData.initiatorUserMatchState.scores,
        player2: matchData.challengedUserMatchState.scores
    }
  }, [matchData]);
  

  const handleLogin = () => {
    localStorage.removeItem('matchId');
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const handleLogout = () => {
      fetch("http://localhost:8081/auth/logout", {
          method: 'POST',
          credentials: 'include'
      })
          .then(response => {
              if (response.ok) {
                  setIsLoggedIn(false);
                  setProfile(INITIAL_PROFILE);
                  localStorage.removeItem('matchId');
              }
          })
          .catch(() => {
              setIsLoggedIn(false);
              setProfile(INITIAL_PROFILE);
              localStorage.removeItem('matchId');
          });

      setMatchData(null);
  };
  
  const toggleLifetimeStats = async () => {
    if (!isLifetimeStatsVisible) {
        try {
            const fetchedStats = await fetchLifetimeStatsFromBackend(profile);
            setLifetimeStats(fetchedStats);
        } catch (error) {
            console.error("Failed to fetch lifetime stats:", error);
            toast({ title: "Error", description: "Could not load lifetime stats.", variant: "destructive" });
        }
    }
    setIsLifetimeStatsVisible(prev => !prev);
  };

  const handleMatchRequestNotificationAccept = async () => {
      console.log("attempting to subscribe to remote match", matchRequestConfig.matchId);
      localStorage.setItem('matchId', matchRequestConfig.matchId);

      await establishWebSocketConnection();

      setIsMatchRequestNotificationOpen(false);

      const newMatchData: MatchData = {
          matchId: matchRequestConfig.matchId,
          matchStatus: 'IN_PROGRESS',
          gameMode: 'REMOTE',
          aiLevel: undefined,
          initialStartingScore: matchRequestConfig.initialStartingScore,
          totalLegs: matchRequestConfig.totalLegs,
          currentLegStarterPlayerSubject: 'user1_subject',
          currentTurnPlayerSubject: 'user1_subject',
          initiatorUserMatchState: {
              subject: matchRequestConfig.initiatorUserSubject,
              name: matchRequestConfig.initiatorUserName,
              location: matchRequestConfig.initiatorUserLocation,
              highestCheckout: 0,
              bestLeg: Infinity,
              oneHundredAndEightyCount: 0,
              oneHundredAndFortyCount: 0,
              oneHundredCount: 0,
              legsWon: 0,
              totalMatchScore: 0,
              totalMatchDartsThrown: 0,
              scores: []
          },
          challengedUserMatchState: {
              subject: profile.idpSubject,
              name: profile.name,
              location: profile.location,
              highestCheckout: 0,
              bestLeg: Infinity,
              oneHundredAndEightyCount: 0,
              oneHundredAndFortyCount: 0,
              oneHundredCount: 0,
              legsWon: 0,
              totalMatchScore: 0,
              totalMatchDartsThrown: 0,
              scores: []
          }
      };
      setMatchData(newMatchData);
      setIsGameStarted(true);
  };

  const handleMatchRequestNotificationCancel = async () => {
      // TODO: what do we do to notify originator of a cancelled request?
      setIsMatchRequestNotificationOpen(false);
  };

  const handleSaveProfile = async (newProfile: PlayerProfile) => {
    try {
      await saveProfileToBackend(newProfile);
      setProfile(newProfile);
      toast({ title: "Profile Saved!", description: "Your details have been updated." });
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({ title: "Save Failed", description: "Could not save your profile. Please try again.", variant: "destructive" });
    }
  };

  const handleSetupComplete = (config: Omit<GameConfig, 'legsWon' | 'player1Location'>) => {
    const mapGameModeToBackend = (mode: GameMode): BackendGameMode => {
        if (mode === '2p') return 'LOCAL';
        if (mode === 'ai') return 'AI';
        return 'REMOTE';
    }

      const newMatchData: MatchData = {
          matchId: `match-${Date.now()}`,
          matchStatus: 'IN_PROGRESS',
          gameMode: mapGameModeToBackend(config.gameMode),
          aiLevel: config.gameMode === 'ai' ? AI_LEVEL_SETTINGS[config.aiLevel].level : undefined,
          initialStartingScore: config.initialScore,
          totalLegs: config.legs,
          currentLegStarterPlayerSubject: 'user1_subject',
          currentTurnPlayerSubject: 'user1_subject',
          initiatorUserMatchState: {
              subject: profile.idpSubject,
              name: profile.name,
              location: profile.location,
              highestCheckout: 0,
              bestLeg: Infinity,
              oneHundredAndEightyCount: 0,
              oneHundredAndFortyCount: 0,
              oneHundredCount: 0,
              legsWon: 0,
              totalMatchScore: 0,
              totalMatchDartsThrown: 0,
              scores: []
          },
          challengedUserMatchState: {
              subject: config.player2Subject,
              name: config.gameMode === 'ai' ? 'AI Opponent' : config.player2Name,
              location: 'none',
              highestCheckout: 0,
              bestLeg: Infinity,
              oneHundredAndEightyCount: 0,
              oneHundredAndFortyCount: 0,
              oneHundredCount: 0,
              legsWon: 0,
              totalMatchScore: 0,
              totalMatchDartsThrown: 0,
              scores: []
          }
      };

    switch (mapGameModeToBackend(config.gameMode)) {
        case 'LOCAL': {
            const newLocalMatchConfigRequest: MatchConfigRequest = {
                initiatorUserSubject: profile.idpSubject,
                initiatorUserName: profile.name,
                initiatorUserLocation: profile.location,
                challengedUserSubject: config.player2Subject,
                challengedUserName: config.player2Name,
                challengedUserLocation: "",
                gameMode: mapGameModeToBackend(config.gameMode),
                initialStartingScore: config.initialScore,
                totalLegs: config.legs,
                currentLegStarterPlayerSubject: 'user1_subject',
                currentTurnPlayerSubject: 'user1_subject'
            }

            fetch(`http://localhost:8080/match/local/configure`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newLocalMatchConfigRequest)
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
                    newMatchData.matchId = matchId;
                    localStorage.setItem('matchId', matchId);
                })
                .catch(error => {
                    console.error('Error configuring local match');
                });
            break;
        }
        case 'AI': {
            const newLocalMatchConfigRequest: MatchConfigRequest = {
                initiatorUserSubject: profile.idpSubject,
                initiatorUserName: profile.name,
                initiatorUserLocation: profile.location,
                challengedUserSubject: config.player2Name,
                challengedUserName: config.player2Name,
                challengedUserLocation: "",
                gameMode: mapGameModeToBackend(config.gameMode),
                AILevel: stringToAiLevel[config.aiLevel],
                initialStartingScore: config.initialScore,
                totalLegs: config.legs,
                currentLegStarterPlayerSubject: 'user1_subject',
                currentTurnPlayerSubject: 'user1_subject'
            }

            fetch(`http://localhost:8080/match/local/configure`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newLocalMatchConfigRequest)
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
                    newMatchData.matchId = matchId;
                    localStorage.setItem('matchId', matchId);
                })
                .catch(error => {
                    console.error('Error configuring ai match');
                });
            break;
        }
        case 'REMOTE': {
            const newRemoteMatchConfigRequest: MatchConfigRequest = {
                initiatorUserSubject: profile.idpSubject,
                initiatorUserName: profile.name,
                initiatorUserLocation: profile.location,
                challengedUserSubject: config.player2Subject,
                challengedUserName: config.player2Name,
                challengedUserLocation: "",
                gameMode: mapGameModeToBackend(config.gameMode),
                initialStartingScore: config.initialScore,
                totalLegs: config.legs,
                currentLegStarterPlayerSubject: 'user1_subject',
                currentTurnPlayerSubject: 'user1_subject'
            }

            fetch(`http://localhost:8080/match/remote/configure`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newRemoteMatchConfigRequest)
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
                    newMatchData.matchId = matchId;
                    localStorage.setItem('matchId', matchId);
                    establishWebSocketConnection();
                })
                .catch(error => {
                    console.error('Error configuring remote match');
                });
            break;
        }
    }

    setMatchData(newMatchData);
    setIsGameStarted(true);
  };
  
  const startNewLeg = useCallback(() => {
    if (!matchData) return;
    if (matchWinner) return;
    
    setMatchData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            initiatorUserMatchState: { ...prev.initiatorUserMatchState, scores: [] },
            challengedUserMatchState: { ...prev.challengedUserMatchState, scores: [] }
        };
    });
    setInputValue("");
    setWinner(null);
    setIsLegWon(false);
    setRounds(0);
    setIsAiThinking(false);
    setIsCheckoutPending(false);
    setPendingCheckout(null);
  }, [matchData, matchWinner]);

  const startNewMatch = useCallback(() => {
    setIsGameStarted(false);
    setMatchData(null);
    setMatchWinner(null);
    setWinner(null);
    setIsStatsVisible(false);
  }, []);

  const finalizeWinner = useCallback((winningPlayer: Player, checkoutScore: number, dartsUsedInLeg: number) => {
      setWinner(winningPlayer);

      setMatchData(prev => {
        if (!prev) return null;

        let newMatchData = { ...prev };
        const winningPlayerStateKey = winningPlayer === 'player1' ? 'initiatorUserMatchState' : 'challengedUserMatchState';
        
        const playerState = newMatchData[winningPlayerStateKey];
        let newPlayerState = { ...playerState };

        // TODO: is there an issue here or if it's infinity at setup is that fine? (if you only get here through winning a leg, i.e. losing a leg won't register a best leg of 0?)
        if (dartsUsedInLeg < newPlayerState.bestLeg) {
            newPlayerState.bestLeg = dartsUsedInLeg;
        }
        if (checkoutScore > newPlayerState.highestCheckout) {
            newPlayerState.highestCheckout = checkoutScore;
        }

        newMatchData[winningPlayerStateKey] = newPlayerState;
        
        const legsToWin = Math.ceil(newMatchData.totalLegs / 2);
        if (newPlayerState.legsWon >= legsToWin) {
          newMatchData.matchStatus = 'COMPLETED';
          setMatchWinner(winningPlayer);
          setIsMatchWinnerDialogOpen(true);
          localStorage.removeItem('matchId');
        } else {
          setIsLegWon(true);
        }

        queueMicrotask(() => saveMatchStateToBackend(newMatchData));

        return newMatchData;
      });

  }, []);
  
  const handleCheckoutDartsSelected = (darts: number) => {
    if (pendingCheckout && matchData) {
      const { player, score } = pendingCheckout;
      const playerStateKey = player === 'player1' ? 'initiatorUserMatchState' : 'challengedUserMatchState';
      const totalTurns = matchData[playerStateKey].scores.length;
      const dartsThrownInLeg = (totalTurns * 3) + darts;
      
      const newMatchData = { ...matchData };
      const playerState = { ...newMatchData[playerStateKey] };

      // TODO :check this si correct
      const nextLegStarterSubject = matchData.currentLegStarterPlayerSubject === 'user1_subject' ? 'user2_subject' : 'user1_subject';
      newMatchData.currentLegStarterPlayerSubject = nextLegStarterSubject;
      newMatchData.currentTurnPlayerSubject = nextLegStarterSubject;

      playerState.legsWon += 1;
      playerState.totalMatchDartsThrown += darts;
      playerState.totalMatchScore += score;
      playerState.scores.push({
          roundScore: score, 
          roundIndex: playerState.scores.length + 1,
          winningScore: true,
          userSubject: player === 'player1' ? 'user1_subject' : 'user2_subject'
      });

      newMatchData[playerStateKey] = playerState;
      setMatchData(newMatchData);
      
      finalizeWinner(player, score, dartsThrownInLeg);
    }
    setIsCheckoutPending(false);
    setPendingCheckout(null);
  };

  const cancelCheckout = useCallback(() => {
    setIsCheckoutPending(false);
    setPendingCheckout(null);
  }, []);

  const handleCheckout = useCallback(() => {
    if (winner || matchWinner) return;
    const currentScore = scores[currentPlayer];
    const possibleCheckout = currentScore <= 170 && !BOGEY_NUMBERS.includes(currentScore);
    if (!possibleCheckout) {
        toast({
            title: "Invalid Checkout",
            description: `You cannot checkout on a score of ${currentScore}.`,
            variant: "destructive",
        });
        return;
    }
    setPendingCheckout({ player: currentPlayer, score: scores[currentPlayer] });
    setIsCheckoutPending(true);
    setInputValue("");
  }, [winner, matchWinner, scores, currentPlayer, toast]);
  
  const submitScore = useCallback((scoreToSubmit: number) => {
      // todo: add check for remote game and  call updateRemoteMatchState()
    if (winner || matchWinner || isCheckoutPending || !matchData) return;

    const score = scoreToSubmit;
    if (isNaN(score)) return;
    
    const newMatchData = { ...matchData };
    const playerStateKey = currentPlayer === 'player1' ? 'initiatorUserMatchState' : 'challengedUserMatchState';
    const playerState = { ...newMatchData[playerStateKey] };
    
    playerState.totalMatchDartsThrown += 3;
    playerState.oneHundredAndEightyCount += score === 180 ? 1 : 0;
    playerState.oneHundredAndFortyCount += (score >= 140 && score < 180) ? 1 : 0;
    playerState.oneHundredCount += (score >= 100 && score < 140) ? 1 : 0;

    const currentScore = scores[currentPlayer];
    const newScore = currentScore - score;
    const roundIndex = playerState.scores.length + 1;

    if (newScore < 0 || newScore === 1) { // Bust
      toast({
        title: "Bust!",
        description: `Your score remains at ${currentScore}.`,
        variant: "destructive",
      });
      playerState.scores.push({ roundScore: 0, roundIndex, winningScore: false, userSubject: playerState.subject });
      newMatchData.currentTurnPlayerSubject = currentPlayer === 'player1' ? 'user2_subject' : 'user1_subject';
    } else if (newScore === 0) {
      const possibleCheckout = currentScore <= 170 && !BOGEY_NUMBERS.includes(currentScore);
      if (possibleCheckout) {
        setPendingCheckout({ player: currentPlayer, score: score });
        setIsCheckoutPending(true);
        setInputValue("");
        // Don't save yet, wait for darts selection
        return; 
      } else {
        toast({
          title: "Invalid Checkout",
          description: `You cannot checkout on a score of ${currentScore}.`,
          variant: "destructive",
        });
        playerState.scores.push({ roundScore: 0, roundIndex, winningScore: false, userSubject: playerState.subject });
        newMatchData.currentTurnPlayerSubject = currentPlayer === 'player1' ? 'user2_subject' : 'user1_subject';
      }
    } else {
      playerState.totalMatchScore += score;
      playerState.scores.push({ roundScore: score, roundIndex, winningScore: false, userSubject: playerState.subject });
      newMatchData.currentTurnPlayerSubject = currentPlayer === 'player1' ? 'user2_subject' : 'user1_subject';
    }

    newMatchData[playerStateKey] = playerState;
    setMatchData(newMatchData);
    setInputValue("");
   
    if (currentPlayer === 'player2') {
      setRounds(r => r + 1);
    }
    
    saveMatchStateToBackend(newMatchData);
    
  }, [winner, matchWinner, scores, currentPlayer, toast, isCheckoutPending, matchData]);

  const saveMatchStateToBackend = async (state: MatchData): Promise<void> => {
    console.log("Saving match state to backend:", state);

    switch (state.gameMode) {
      case "LOCAL":
      case "AI": {
          try {
              const response = await fetch(`http://localhost:8080/match/local/${state.matchId}/updateState`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify(state)
              });

              if (response.status === 401) {
                  throw new Error("Unauthorized");
              }

              if (!response.ok) {
                  throw new Error("Something went wrong.");
              }

              console.log("Match state saved.");
          } catch (error) {
              console.error("Failed to save match state:", error);
              throw error; // rethrow if you want the caller to handle it
          }
          break;
      }
      case "REMOTE": {
          updateRemoteMatchState(state.matchId, state);
          break;
      }
    }
  }

  const handleNumberPress = (num: string) => {
    setInputValue((prev) => {
      const newValue = prev + num;
      if (parseInt(newValue, 10) > 180) {
        toast({
          title: "Invalid Score",
          description: "Maximum score is 180.",
          variant: "destructive",
        });
        return prev;
      }
      return newValue;
    });
  };

  const handleSubmit = () => {
    if(!inputValue) return;
    const enteredScore = parseInt(inputValue, 10);
    submitScore(enteredScore);
  }

  const handleQuickScore = (score: string) => {
    const enteredScore = parseInt(score, 10);
    submitScore(enteredScore);
  }
  
  const acknowledgeLegWin = useCallback(() => {
    setIsLegWon(false);
     if (!matchWinner) {
       setTimeout(() => {
        startNewLeg();
      }, 500); // short delay
    }
  }, [matchWinner, startNewLeg]);

  const acknowledgeMatchWin = () => {
    setIsMatchWinnerDialogOpen(false);
    setIsStatsVisible(true);
  };

  const runDifficultyAdjustment = useCallback(async () => {
    if (!matchData || legHistory.player1.length === 0 || gameConfig?.aiLevel === 'pro') return;

    const playerAverageScore = legHistory.player1.reduce((a, b) => a + b.roundScore, 0) / legHistory.player1.length;
    const aiAverageScore = legHistory.player2.length > 0 ? legHistory.player2.reduce((a, b) => a + b.roundScore, 0) / legHistory.player2.length : 0;

    const input: AdjustDifficultyInput = {
      playerScore: scores.player1,
      aiScore: scores.player2,
      playerAverageScore,
      aiAverageScore: isNaN(aiAverageScore) ? 0 : aiAverageScore,
      roundsPlayed: rounds,
    };

    try {
      const result = await adjustDifficulty(input);
      if (result && typeof result.difficultyAdjustment === 'number') {
        // AI difficulty is now part of matchData and not a separate state
        // This part needs rethinking if dynamic adjustment is still desired.
        // For now, we log it.
        console.log("AI difficulty adjustment suggested:", result.difficultyAdjustment);
      } else {
        console.error("AI difficulty adjustment returned invalid data:", result);
      }
    } catch (e) {
      console.error("Failed to adjust AI difficulty:", e);
      // Don't crash the game, just log the error and continue.
    }
  }, [scores, rounds, legHistory, matchData, gameConfig]);

  const runAiTurn = useCallback(async () => {
    if (isAiThinking || !matchData || !gameConfig) return;

    setIsAiThinking(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      let aiCurrentScore = scores.player2;
      const levelSettings = AI_LEVEL_SETTINGS[gameConfig.aiLevel];

      // Check for checkout
      const canCheckout = aiCurrentScore <= 170 && !BOGEY_NUMBERS.includes(aiCurrentScore) && CHECKOUT_DATA[aiCurrentScore as keyof typeof CHECKOUT_DATA];
      if (canCheckout && Math.random() < levelSettings.checkoutChance) {
          const checkoutInfo = CHECKOUT_DATA[aiCurrentScore as keyof typeof CHECKOUT_DATA];
          const checkoutDarts = Array.isArray(checkoutInfo) ? checkoutInfo.length : 0;
          
          const dartsThrownInLeg = (matchData.challengedUserMatchState.scores.length * 3) + checkoutDarts;
          
          const newMatchData = {...matchData};
          const playerState = {...newMatchData.challengedUserMatchState};
          playerState.totalMatchDartsThrown += checkoutDarts;
          playerState.totalMatchScore += aiCurrentScore;
          playerState.legsWon += 1;
          playerState.scores.push({ 
              roundScore: aiCurrentScore, 
              roundIndex: playerState.scores.length + 1, 
              winningScore: true,
              userSubject: 'user2_subject'
          });
          newMatchData.challengedUserMatchState = playerState;
          setMatchData(newMatchData);
          
          finalizeWinner("player2", aiCurrentScore, dartsThrownInLeg);
          
          setIsAiThinking(false);
          saveMatchStateToBackend(newMatchData);
          return;
      }

      const scoreRange = levelSettings.max - levelSettings.min;
      let scoreToThrow = Math.floor(Math.random() * (scoreRange / 3) + (levelSettings.min / 3)) * 3; 
      scoreToThrow = Math.min(scoreToThrow, 180, aiCurrentScore - 2); 
      
      const newMatchData = {...matchData};
      const playerState = {...newMatchData.challengedUserMatchState};
      playerState.totalMatchDartsThrown += 3;

      const newScore = aiCurrentScore - scoreToThrow;
      const roundIndex = playerState.scores.length + 1;
      
      if (newScore < 0 || newScore === 1) { // Bust
          playerState.scores.push({ roundScore: 0, roundIndex, winningScore: false, userSubject: 'user2_subject' });
      } else {
          playerState.totalMatchScore += scoreToThrow;
          playerState.scores.push({ roundScore: scoreToThrow, roundIndex, winningScore: false, userSubject: 'user2_subject' });
      }
      playerState.oneHundredAndEightyCount += scoreToThrow === 180 ? 1 : 0;
      playerState.oneHundredAndFortyCount += (scoreToThrow >= 140 && scoreToThrow < 180) ? 1 : 0;
      playerState.oneHundredCount += (scoreToThrow >= 100 && scoreToThrow < 140) ? 1 : 0;

      newMatchData.challengedUserMatchState = playerState;
      newMatchData.currentTurnPlayerSubject = 'user1_subject';
      setMatchData(newMatchData);
      
      await runDifficultyAdjustment();
      setRounds((r) => r + 1);
      saveMatchStateToBackend(newMatchData);
    } finally {
      setIsAiThinking(false);
    }

  }, [isAiThinking, scores, gameConfig, matchData, finalizeWinner, runDifficultyAdjustment]);

  useEffect(() => {
    if (gameConfig?.gameMode === 'ai' && currentPlayer === 'player2' && !winner && !matchWinner && !isAiThinking) {
      runAiTurn();
    }
  }, [currentPlayer, winner, matchWinner, gameConfig?.gameMode, runAiTurn, isAiThinking]);

  useEffect(() => {
    const score = scores[currentPlayer];
    const canCheckout = score <= 170 && !BOGEY_NUMBERS.includes(score);
    const isHumanTurn = (gameConfig?.gameMode !== 'ai' || currentPlayer === 'player1');

    if (canCheckout && isHumanTurn && !winner) {
      const suggestions = CHECKOUT_DATA[score as keyof typeof CHECKOUT_DATA];
      if (suggestions) {
        setCheckoutSuggestions([suggestions.join(', ')]);
      } else {
        setCheckoutSuggestions([]);
      }
    } else {
      setCheckoutSuggestions([]);
    }
  }, [scores, currentPlayer, winner, gameConfig?.gameMode]);


  const matchAverages = useMemo(() => {
    if (!stats) return { player1: 0, player2: 0 };
    const p1Avg = stats.player1.totalMatchDartsThrown > 0 ? (stats.player1.totalMatchScore / stats.player1.totalMatchDartsThrown) * 3 : 0;
    const p2Avg = stats.player2.totalMatchDartsThrown > 0 ? (stats.player2.totalMatchScore / stats.player2.totalMatchDartsThrown) * 3 : 0;
    return { player1: p1Avg, player2: p2Avg };
  }, [stats]);

  const legAverages = useMemo(() => {
    if (!legHistory) return { player1: 0, player2: 0 };
    const calcLegAverage = (playerLegHistory: RoundScore[]) => {
      if (playerLegHistory.length === 0) return 0;
      
      const legScore = playerLegHistory.reduce((sum, turn) => sum + turn.roundScore, 0);
      // This is a simplification. For accurate leg average, we need to know exact darts for checkout.
      // The schema doesn't store this per-leg, so we use the match-level data which is more accurate.
      // A truly accurate leg-by-leg average would require schema changes.
      const legDarts = playerLegHistory.length * 3;

      return legDarts > 0 ? (legScore / legDarts) * 3 : 0;
    };
    return {
      player1: calcLegAverage(legHistory.player1),
      player2: calcLegAverage(legHistory.player2),
    };
  }, [legHistory]);
  
  const toggleShowAverage = () => setShowAverage(prev => !prev);
  const openDartboard = () => setIsDartboardOpen(true);
  const closeDartboard = () => setIsDartboardOpen(false);

  const handleDartboardSubmit = (score: number) => {
    submitScore(score);
    closeDartboard();
  };
  
  const toggleStatsScreen = () => setIsStatsVisible(prev => !prev);
  
  return {
    scores,
    matchAverages,
    legAverages,
    currentPlayer,
    inputValue,
    winner,
    matchWinner,
    gameMode: gameConfig?.gameMode,
    isAiThinking,
    player1Name: gameConfig?.player1Name ?? "",
    player2Name: gameConfig?.player2Name ?? "",
    legHistory,
    gameConfig,
    isGameStarted,
    isCheckoutPending,
    checkoutScore: pendingCheckout?.score ?? 0,
    isLegWon,
    isMatchWinnerDialogOpen,
    legStarter,
    showAverage,
    checkoutSuggestions,
    isSuggestionsLoading,
    isDartboardOpen,
    isLoggedIn,
    setIsLoggedIn,
    profile,
    setProfile,
    handleSaveProfile,
    stats,
    isStatsVisible,
    toggleStatsScreen,
    isProfilePageVisible,
    toggleProfilePage,
    isHowToPlayVisible,
    toggleHowToPlay,
    handleLogin,
    handleLogout,
    acknowledgeLegWin,
    acknowledgeMatchWin,
    handleSetupComplete,
    handleNumberPress,
    handleDelete: () => setInputValue(prev => prev.slice(0, -1)),
    handleSubmit,
    startNewMatch,
    handleQuickScore,
    handleCheckout,
    handleCheckoutDartsSelected,
    cancelCheckout,
    toggleShowAverage,
    openDartboard,
    closeDartboard,
    handleDartboardSubmit,
    isLifetimeStatsVisible,
    lifetimeStats,
    toggleLifetimeStats,
    matchRequestConfig,
    isMatchRequestNotificationOpen,
    handleMatchRequestNotificationAccept,
    handleMatchRequestNotificationCancel,
  };
}
