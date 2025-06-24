package com.tough.dartsapp.model;

import java.util.ArrayList;
import java.util.List;

public class MatchState {
    private String matchId;
    private MatchStatus matchStatus;
    private List<UserMatchState> userMatchStateList = new ArrayList<>();

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

    public List<UserMatchState> getUserMatchStateList() {
        return userMatchStateList;
    }
    public void setUserMatchStateList(List<UserMatchState> userMatchStateList) {
        this.userMatchStateList = userMatchStateList;
    }

    public UserMatchState findUserMatchStateByUserSubject(String subject) {
        for (UserMatchState userMatchState : userMatchStateList) {
            if (userMatchState.getUserSubject().equals(subject)) {
                return userMatchState;
            }
        }
        return null;
    }
}