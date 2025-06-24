package com.tough.dartsapp.model;

public class MatchConfigRequest {
    private String initiatorUserSubject;
    private String initiatorUserName;
    private String challengedUserSubject;
    private String challengedUserName;

    public String getInitiatorUserSubject() {
        return initiatorUserSubject;
    }

    public void setInitiatorUserSubject(String initiatorUserSubject) {
        this.initiatorUserSubject = initiatorUserSubject;
    }

    public String getInitiatorUserName() {
        return initiatorUserName;
    }

    public void setInitiatorUserName(String initiatorUserName) {
        this.initiatorUserName = initiatorUserName;
    }

    public String getChallengedUserSubject() {
        return challengedUserSubject;
    }

    public void setChallengedUserSubject(String challengedUserSubject) {
        this.challengedUserSubject = challengedUserSubject;
    }

    public String getChallengedUserName() {
        return challengedUserName;
    }

    public void setChallengedUserName(String challengedUserName) {
        this.challengedUserName = challengedUserName;
    }
}