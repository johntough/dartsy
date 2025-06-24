package com.tough.dartsapp.model;

import java.util.ArrayList;
import java.util.List;

public class UserMatchState {
    private String userSubject;
    private String userName;
    private int highestCheckout;
    private int bestLeg;
    private int oneHundredAndEightyCount;
    private int legsWon;
    private List<ScoreEntry> scores = new ArrayList<>();

    public String getUserSubject() {
        return userSubject;
    }

    public void setUserSubject(String userSubject) {
        this.userSubject = userSubject;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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
