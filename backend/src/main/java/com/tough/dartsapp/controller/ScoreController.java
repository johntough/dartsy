package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.ScoreEntry;
import com.tough.dartsapp.service.ScoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

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

        LOGGER.info("Message received for match id: {}, Score: {}", matchId, score.getRoundScore());

        scoreService.registerScore(matchId, score);
    }
}