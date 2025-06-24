package com.tough.dartsapp.model;

import java.util.ArrayList;
import java.util.List;

public class UserMatchState {
    private String subject;
    private String name;
    private int highestCheckout;
    private int bestLeg;
    private int oneHundredAndEightyCount;
    private int legsWon;
    private List<ScoreEntry> scores = new ArrayList<>();

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getHighestCheckout() {
        return highestCheckout;
    }

    public void setHighestCheckout(int highestCheckout) {
        this.highestCheckout = highestCheckout;
    }

    public int getBestLeg() {
        return bestLeg;
    }

    public void setBestLeg(int bestLeg) {
        this.bestLeg = bestLeg;
    }

    public int getOneHundredAndEightyCount() {
        return oneHundredAndEightyCount;
    }

    public void setOneHundredAndEightyCount(int onEightyCount) {
        this.oneHundredAndEightyCount = onEightyCount;
    }

    public int getLegsWon() {
        return legsWon;
    }

    public void setLegsWon(int legsWon) {
        this.legsWon = legsWon;
    }

    public List<ScoreEntry> getScores() {
        return scores;
    }
    public void setScores(List<ScoreEntry> scores) {
        this.scores = scores;
    }
}
