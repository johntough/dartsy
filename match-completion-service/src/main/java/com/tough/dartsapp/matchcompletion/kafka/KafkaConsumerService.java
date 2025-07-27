package com.tough.dartsapp.matchcompletion.kafka;

import com.tough.dartsapp.matchcompletion.model.MatchState;
import com.tough.dartsapp.matchcompletion.service.MatchCompletionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumerService.class);

    private final MatchCompletionService matchCompletionService;

    @Autowired
    public KafkaConsumerService(MatchCompletionService matchCompletionService) {
        this.matchCompletionService = matchCompletionService;
    }

    @KafkaListener(topics = "match-complete", groupId = "match-completed-consumer-group")
    public void listen(MatchState message) {
        LOGGER.info("Received Match State from Kafka: {}", message.getMatchId());
        matchCompletionService.persistMatchStats(message);
    }
}