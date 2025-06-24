package com.tough.dartsapp.model;

public class ScoreEntry {
    private String userSubject;
    private int roundIndex;
    private int roundScore;

    public ScoreEntry() {}

    public ScoreEntry(String userSubject, int score) {
        this.userSubject = userSubject;
        this.roundScore = score;
    }

    public String getUserSubject() {
        return userSubject;
    }

    public void setUserSubject(String userSubject) {
        this.userSubject = userSubject;
    }

    public int getRoundIndex() {
        return roundIndex;
    }

    public void setRoundIndex(int roundIndex) {
        this.roundIndex = roundIndex;
    }

    public int getRoundScore() {
        return roundScore;
    }

    public void setRoundScore(int roundScore) {
        this.roundScore = roundScore;
    }
}