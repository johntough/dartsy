package com.tough.dartsapp.matchcompletion.model;

public class UserMatchState {
    private String subject;
    private String name;
    private String playerLocation;
    private int highestCheckout;
    private int bestLeg;
    private int oneHundredAndEightyCount;
    private int oneHundredAndFortyCount;
    private int oneHundredCount;
    private int legsWon;
    private int totalMatchScore;
    private int totalMatchDartsThrown;

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

    public String getPlayerLocation() {
        return playerLocation;
    }

    public void setPlayerLocation(String playerLocation) {
        this.playerLocation = playerLocation;
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

    public int getOneHundredAndFortyCount() {
        return oneHundredAndFortyCount;
    }

    public void setOneHundredAndFortyCount(int oneHundredAndFortyCount) {
        this.oneHundredAndFortyCount = oneHundredAndFortyCount;
    }

    public int getOneHundredCount() {
        return oneHundredCount;
    }

    public void setOneHundredCount(int oneHundredCount) {
        this.oneHundredCount = oneHundredCount;
    }

    public int getLegsWon() {
        return legsWon;
    }

    public void setLegsWon(int legsWon) {
        this.legsWon = legsWon;
    }

    public int getTotalMatchScore() {
        return totalMatchScore;
    }

    public void setTotalMatchScore(int totalMatchScore) {
        this.totalMatchScore = totalMatchScore;
    }

    public int getTotalMatchDartsThrown() {
        return totalMatchDartsThrown;
    }

    public void setTotalMatchDartsThrown(int totalMatchDartsThrown) {
        this.totalMatchDartsThrown = totalMatchDartsThrown;
    }
}
