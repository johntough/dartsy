package com.tough.dartsapp.model;

public class MatchConfigRequest {
    private String initiatorUserSubject;
    private String initiatorUserName;
    private String initiatorUserLocation;
    private String challengedUserSubject;
    private String challengedUserName;
    private String challengedUserLocation;
    private GameMode gameMode;
    private AILevel level;
    private int initialStartingScore;
    private int totalLegs;
    private String currentLegStarterPlayerSubject;
    private String currentTurnPlayerSubject;


    public String getInitiatorUserSubject() {
        return initiatorUserSubject;
    }

    public void setInitiatorUserSubject(String initiatorUserSubject) {
        this.initiatorUserSubject = initiatorUserSubject;
    }

    public String getInitiatorUserName() {
        return initiatorUserName;
    }

    public void setInitiatorUserName(String initiatorUserName) {
        this.initiatorUserName = initiatorUserName;
    }

    public String getInitiatorUserLocation() {
        return initiatorUserLocation;
    }

    public void setInitiatorUserLocation(String initiatorUserLocation) {
        this.initiatorUserLocation = initiatorUserLocation;
    }

    public String getChallengedUserSubject() {
        return challengedUserSubject;
    }

    public void setChallengedUserSubject(String challengedUserSubject) {
        this.challengedUserSubject = challengedUserSubject;
    }

    public String getChallengedUserName() {
        return challengedUserName;
    }

    public void setChallengedUserName(String challengedUserName) {
        this.challengedUserName = challengedUserName;
    }

    public String getChallengedUserLocation() {
        return challengedUserLocation;
    }

    public void setChallengedUserLocation(String challengedUserLocation) {
        this.challengedUserLocation = challengedUserLocation;
    }

    public GameMode getGameMode() {
        return gameMode;
    }

    public void setGameMode(GameMode gameMode) {
        this.gameMode = gameMode;
    }

    public AILevel getLevel() {
        return level;
    }

    public void setLevel(AILevel level) {
        this.level = level;
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
}