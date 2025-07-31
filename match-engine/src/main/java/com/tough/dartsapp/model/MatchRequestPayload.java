package com.tough.dartsapp.model;

public class MatchRequestPayload {
    private String matchId;
    private String initiatorUserName;
    private String initiatorUserSubject;
    private String initiatorUserLocation;
    private int initialStartingScore;
    private int totalLegs;

    public MatchRequestPayload(String matchId, String initiatorUserName, String initiatorUserSubject, String initiatorUserLocation, int initialStartingScore, int totalLegs) {
        this.matchId = matchId;
        this.initiatorUserName = initiatorUserName;
        this.initiatorUserSubject = initiatorUserSubject;
        this.setInitiatorUserLocation(initiatorUserLocation);
        this.initialStartingScore = initialStartingScore;
        this.totalLegs = totalLegs;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getInitiatorUserName() {
        return initiatorUserName;
    }

    public void setInitiatorUserName(String initiatorUserName) {
        this.initiatorUserName = initiatorUserName;
    }

    public String getInitiatorUserSubject() {
        return initiatorUserSubject;
    }

    public void setInitiatorUserSubject(String initiatorUserSubject) {
        this.initiatorUserSubject = initiatorUserSubject;
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

    public String getInitiatorUserLocation() {
        return initiatorUserLocation;
    }

    public void setInitiatorUserLocation(String initiatorUserLocation) {
        this.initiatorUserLocation = initiatorUserLocation;
    }
}