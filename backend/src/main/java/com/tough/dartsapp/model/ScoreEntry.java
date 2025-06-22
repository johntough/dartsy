package com.tough.dartsapp.model;

public class ScoreEntry {
    private String userId;
    private int roundIndex;
    private int roundScore;

    public ScoreEntry() {}

    public ScoreEntry(String userId, int score) {
        this.userId = userId;
        this.roundScore = score;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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