package com.tough.dartsapp.model;

public enum AILevel {
    NEWBIE(1),
    BEGINNER(2),
    PUB(3),
    COUNTY(4),
    PRO(5);

    private final int level;

    AILevel(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }
}