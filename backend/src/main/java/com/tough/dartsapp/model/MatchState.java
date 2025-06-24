package com.tough.dartsapp.model;

public class MatchState {
    private String matchId;
    private MatchStatus matchStatus;
    private UserMatchState initiatorUserMatchState;
    private UserMatchState challengedUserMatchState;


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

    public UserMatchState getInitiatorUserMatchState() {
        return initiatorUserMatchState;
    }

    public void setInitiatorUserMatchState(UserMatchState initiatorUserMatchState) {
        this.initiatorUserMatchState = initiatorUserMatchState;
    }

    public UserMatchState getChallengedUserMatchState() {
        return challengedUserMatchState;
    }

    public void setChallengedUserMatchState(UserMatchState challegedUserMatchState) {
        this.challengedUserMatchState = challegedUserMatchState;
    }

    public UserMatchState findUserMatchStateByUserSubject(String subject) {

        if (initiatorUserMatchState.getSubject().equals(subject)) {
            return initiatorUserMatchState;
        } else if (challengedUserMatchState.getSubject().equals(subject)) {
            return challengedUserMatchState;
        }
        return null;
    }
}