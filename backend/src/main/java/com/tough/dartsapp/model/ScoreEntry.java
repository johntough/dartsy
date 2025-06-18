package com.tough.dartsapp.model;

public class ScoreEntry {
    private int roundIndex;
    private int roundScore;

    public ScoreEntry() {}

    public ScoreEntry(int score) {
        this.roundScore = score;
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