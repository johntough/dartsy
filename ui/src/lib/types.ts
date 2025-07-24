
export type MatchStatus = 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type GameMode = 'LOCAL' | 'REMOTE' | 'AI';
export type AiLevel = 1 | 2 | 3 | 4 | 5;

export interface RoundScore {
  userSubject: string;
  roundIndex: number;
  roundScore: number;
  winningScore: boolean;
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
  currentLegStarter: string;
  currentPlayerTurn: string;
  initiatorUserMatchState: UserMatchState;
  challengedUserMatchState: UserMatchState;
}
