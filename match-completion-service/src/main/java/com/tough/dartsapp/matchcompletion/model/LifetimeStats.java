package com.tough.dartsapp.matchcompletion.model;


public class LifetimeStats {

    private int gamesPlayed;

    private int gamesWon;

    private int highestCheckout;

    private int bestLeg;

    private int oneHundredPlusScores;

    private int oneHundredFortyPlusScores;

    private int oneHundredEightyScores;

    private int numberOfDartsThrown;

    private int totalScore;

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void incrementGamesPlayed() {
        this.gamesPlayed++;
    }

    public int getGamesWon() {
        return gamesWon;
    }

    public void incrementGamesWon() {
        this.gamesWon++;
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

    public int getOneHundredPlusScores() {
        return oneHundredPlusScores;
    }

    public void setOneHundredPlusScores(int oneHundredPlusScores) {
        this.oneHundredPlusScores = oneHundredPlusScores;
    }

    public int getOneHundredFortyPlusScores() {
        return oneHundredFortyPlusScores;
    }

    public void setOneHundredFortyPlusScores(int oneHundredFortyPlusScores) {
        this.oneHundredFortyPlusScores = oneHundredFortyPlusScores;
    }

    public int getOneHundredEightyScores() {
        return oneHundredEightyScores;
    }

    public void setOneHundredEightyScores(int oneHundredEightyScores) {
        this.oneHundredEightyScores = oneHundredEightyScores;
    }

    public int getNumberOfDartsThrown() {
        return numberOfDartsThrown;
    }

    public void setNumberOfDartsThrown(int numberOfDartsThrown) {
        this.numberOfDartsThrown = numberOfDartsThrown;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }
}