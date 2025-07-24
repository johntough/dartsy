package com.tough.dartsapp.authentication.model;

import jakarta.persistence.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "idp_subject", nullable = false, unique = true)
    private String idpSubject;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "name", nullable = false, unique = false)
    private String name;

    @Column(name = "location", nullable = true, unique = false)
    private String location;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = new HashSet<>();

    public Long getId() { return id; }

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