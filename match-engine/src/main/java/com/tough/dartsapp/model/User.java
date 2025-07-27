package com.tough.dartsapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "user")
public class User {

    @Id
    private String idpSubject;

    private String email;

    private String name;

    private String location;

    private Set<String> roles = new HashSet<>();

    private LifetimeStats lifetimeStats;

    public String getIdpSubject() {
        return idpSubject;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setLifetimeStats(LifetimeStats lifetimeStats) {
        this.lifetimeStats = lifetimeStats;
    }

    public LifetimeStats getLifetimeStats() {
        return lifetimeStats;
    }
}