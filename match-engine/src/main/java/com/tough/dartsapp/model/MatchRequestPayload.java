package com.tough.dartsapp.model;

public class MatchRequestPayload {
    private String matchId;
    private String initiatorUserName;

    public MatchRequestPayload(String matchId, String initiatorUserName) {
        this.matchId = matchId;
        this.initiatorUserName = initiatorUserName;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getInitiatorUserName() {
        return initiatorUserName;
    }

    public void setInitiatorUserName(String initiatorUserName) {
        this.initiatorUserName = initiatorUserName;
    }
}