package com.tough.dartsapp.authentication.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
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

    public void setIdpSubject(String idpSubject) { this.idpSubject = idpSubject; }

    public String getIdpSubject() { return idpSubject; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public void setRoles(Set<String> roles) { this.roles = roles; }

    public Collection<SimpleGrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }
}