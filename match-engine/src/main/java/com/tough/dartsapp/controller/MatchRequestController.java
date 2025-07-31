package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.MatchConfigRequest;
import com.tough.dartsapp.service.MatchRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Controller
public class MatchRequestController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MatchRequestController.class);
    private final MatchRequestService matchRequestService;

    @Autowired
    public MatchRequestController(MatchRequestService matchRequestService) {
        this.matchRequestService = matchRequestService;
    }

    @GetMapping("/sse/subscribe/{userSubject}")
    public SseEmitter subscribe(@PathVariable String userSubject) {
        LOGGER.info("Subscription for SSE for user: {}", userSubject);
        return matchRequestService.subscribe(userSubject);
    }

    @PostMapping("/matchRequest/{matchId}/accept")
    public ResponseEntity<Void> acceptMatchRequest(@PathVariable String matchId, @RequestBody String initiatorUserSubject) {
        LOGGER.info("POST /matchRequest/{}/accept called in response to user: {}", matchId, initiatorUserSubject);
        matchRequestService.acceptMatchRequest(matchId, initiatorUserSubject);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/matchRequest/{matchId}/reject")
    public ResponseEntity<Void> rejectMatchRequest(@PathVariable String matchId, @RequestBody String initiatorUserSubject) {
        LOGGER.info("POST /matchRequest/{}/reject called in response to user: {}", matchId, initiatorUserSubject);
        matchRequestService.rejectMatchRequest(matchId, initiatorUserSubject);
        return ResponseEntity.ok().build();
    }
}