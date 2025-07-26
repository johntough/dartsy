package com.tough.dartsapp.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tough.dartsapp.model.MatchState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendMatchCompleteMessage(MatchState completedMatchstate) {
        try {
            String json = objectMapper.writeValueAsString(completedMatchstate);
            String matchCompleteTopic = "match-complete";
            kafkaTemplate.send(matchCompleteTopic, json);
            LOGGER.info("Message sent to {} for gameId: {}", matchCompleteTopic, completedMatchstate.getMatchId());
        } catch (JsonProcessingException e) {
            LOGGER.error("Error converting MatchState to JSON: {}", e.getMessage());
        }
    }
}