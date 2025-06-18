package com.tough.dartsapp.model;

import java.util.ArrayList;
import java.util.List;

public class MatchState {
    private String matchId;
    private MatchStatus matchStatus;
    private List<ScoreEntry> scores = new ArrayList<>();

    public String getMatchId() {
        return matchId;
    }
    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public MatchStatus getMatchStatus() {
        return matchStatus;
    }
    public void setMatchStatus(MatchStatus matchStatus) {
        this.matchStatus = matchStatus;
    }

    public List<ScoreEntry> getScores() {
        return scores;
    }
    public void setScores(List<ScoreEntry> scores) {
        this.scores = scores;
    }
}