package com.tough.dartsapp.model;

public class MatchRequestPayload {
    private String matchId;
    private String message;

    public MatchRequestPayload(String matchId, String message) {
        this.matchId = matchId;
        this.message = message;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}