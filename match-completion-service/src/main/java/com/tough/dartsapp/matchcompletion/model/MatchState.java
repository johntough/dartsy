package com.tough.dartsapp.matchcompletion.model;

public class MatchState {
    private String matchId;
    private MatchStatus matchStatus;
    private GameMode gameMode;
    private int initialStartingScore;
    private int totalLegs;
    private String currentLegStarterPlayerSubject;
    private String currentTurnPlayerSubject;
    private UserMatchState initiatorUserMatchState;
    private UserMatchState challengedUserMatchState;

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public MatchStatus getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(MatchStatus matchStatus) {
        this.matchStatus = matchStatus;
    }

    public GameMode getGameMode() {
        return gameMode;
    }

    public void setGameMode(GameMode gameMode) {
        this.gameMode = gameMode;
    }

    public int getInitialStartingScore() {
        return initialStartingScore;
    }

    public void setInitialStartingScore(int initialStartingScore) {
        this.initialStartingScore = initialStartingScore;
    }

    public int getTotalLegs() {
        return totalLegs;
    }

    public void setTotalLegs(int totalLegs) {
        this.totalLegs = totalLegs;
    }

    public String getCurrentLegStarterPlayerSubject() {
        return currentLegStarterPlayerSubject;
    }

    public void setCurrentLegStarterPlayerSubject(String currentLegStarterPlayerSubject) {
        this.currentLegStarterPlayerSubject = currentLegStarterPlayerSubject;
    }

    public String getCurrentTurnPlayerSubject() {
        return currentTurnPlayerSubject;
    }

    public void setCurrentTurnPlayerSubject(String currentTurnPlayerSubject) {
        this.currentTurnPlayerSubject = currentTurnPlayerSubject;
    }

    public UserMatchState getInitiatorUserMatchState() {
        return initiatorUserMatchState;
    }

    public void setInitiatorUserMatchState(UserMatchState initiatorUserMatchState) {
        this.initiatorUserMatchState = initiatorUserMatchState;
    }

    public UserMatchState getChallengedUserMatchState() {
        return challengedUserMatchState;
    }

    public void setChallengedUserMatchState(UserMatchState challegedUserMatchState) {
        this.challengedUserMatchState = challegedUserMatchState;
    }

    public UserMatchState findUserMatchStateByUserSubject(String subject) {

        if (initiatorUserMatchState.getSubject().equals(subject)) {
            return initiatorUserMatchState;
        } else if (challengedUserMatchState.getSubject().equals(subject)) {
            return challengedUserMatchState;
        }
        return null;
    }
}