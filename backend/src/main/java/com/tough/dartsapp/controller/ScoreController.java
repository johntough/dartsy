package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.MatchState;
import com.tough.dartsapp.model.ScoreEntry;
import com.tough.dartsapp.service.ScoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class ScoreController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScoreController.class);
    private final ScoreService scoreService;

    @Autowired
    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @MessageMapping("/match/{matchId}/score")
    public void sendScore(@DestinationVariable String matchId, @Payload ScoreEntry score) {

        LOGGER.info("Message received for match id: {}, Player id: {} scored {}", matchId, score.getUserSubject(), score.getRoundScore());
        LOGGER.info("is Winning Score: {}", score.isWinningScore());

        scoreService.registerScore(matchId, score);
    }

    @PutMapping("/match/local/{matchId}/updateState")
    public ResponseEntity<Void> updateLocalMatchState(@PathVariable String matchId, @RequestBody MatchState matchState) {
        LOGGER.info("PUT match/local/{}/updateState called", matchId);

        scoreService.updateLocalMatchState(matchState);

        return ResponseEntity.noContent().build();
    }
}