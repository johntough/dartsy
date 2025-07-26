package com.tough.dartsapp.model;

public class ScoreEntry {
    private String userSubject;
    private int roundIndex;
    private int roundScore;
    private boolean winningScore;

    public ScoreEntry() {
    }

    public ScoreEntry(String userSubject, int score, boolean winningScore) {
        this.userSubject = userSubject;
        this.roundScore = score;
        this.winningScore = winningScore;
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

    public boolean isWinningScore() {
        return winningScore;
    }

    public void setWinningScore(boolean winningScore) {
        this.winningScore = winningScore;
    }
}