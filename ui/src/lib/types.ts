
export type MatchStatus = 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type GameMode = 'LOCAL' | 'REMOTE' | 'AI';
export type AiLevel = 1 | 2 | 3 | 4 | 5;

export interface RoundScore {
  userSubject: string;
  roundIndex: number;
  roundScore: number;
  winningScore: boolean;
}

export interface MatchRequestPayload {
  matchId: string;
  initiatorUserName: string;
  initiatorUserSubject: string;
  initiatorUserLocation: string;
  challengedUserName: string;
  initialStartingScore: number;
  totalLegs: number;
}

export interface UserMatchState {
  subject: string;
  name: string;
  location: string;
  highestCheckout: number;
  bestLeg: number;
  oneHundredAndEightyCount: number;
  oneHundredAndFortyCount: number;
  oneHundredCount: number;
  legsWon: number;
  totalMatchScore: number;
  totalMatchDartsThrown: number;
  scores: RoundScore[];
}

export interface MatchData {
  matchId: string;
  matchStatus: MatchStatus;
  gameMode: GameMode;
  aiLevel?: AiLevel;
  initialStartingScore: number;
  totalLegs: number;
  currentLegStarterPlayerSubject: string;
  currentTurnPlayerSubject: string;
  initiatorUserMatchState: UserMatchState;
  challengedUserMatchState: UserMatchState;
}

export interface MatchConfigRequest {
  initiatorUserSubject: string;
  initiatorUserName: string;
  initiatorUserLocation: string;
  challengedUserSubject: string;
  challengedUserName: string;
  challengedUserLocation: string;
  gameMode: GameMode;
  AILevel?: AiLevel,
  initialStartingScore: number,
  totalLegs: number;
  currentLegStarterPlayerSubject: string;
  currentTurnPlayerSubject: string;
}
