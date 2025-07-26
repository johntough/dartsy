package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.MatchConfigRequest;
import com.tough.dartsapp.model.MatchState;
import com.tough.dartsapp.service.MatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class MatchController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MatchController.class);

    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping("match/configure")
    public ResponseEntity<String> configureMatch(@RequestBody MatchConfigRequest matchConfigRequest) {
        LOGGER.info("POST match/configure called by user {} to challenge user {}", matchConfigRequest.getInitiatorUserName(), matchConfigRequest.getChallengedUserName());
        String matchId = matchService.configureMatch(matchConfigRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(matchId);
    }

    @PostMapping("match/local/configure")
    public ResponseEntity<String> configureLocalMatch(@RequestBody MatchConfigRequest matchConfigRequest) {
        LOGGER.info("POST match/local/configure called by user {} ", matchConfigRequest.getInitiatorUserName());
        String matchId = matchService.configureLocalMatch(matchConfigRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(matchId);
    }

    @GetMapping("match/restore/{matchId}")
    public ResponseEntity<MatchState> restoreMatch(@PathVariable String matchId) {
        LOGGER.info("GET match/restore/{} called", matchId);

        Optional<MatchState> matchState = matchService.getMatchState(matchId);

        return matchState
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("matches/active")
    public ResponseEntity<List<String>> getActiveMatchIds() {
        LOGGER.info("GET matches/active called");

        List<String> activeMatchIds = matchService.getActiveMatchIds();

        return ResponseEntity.ok().body(activeMatchIds);
    }
}