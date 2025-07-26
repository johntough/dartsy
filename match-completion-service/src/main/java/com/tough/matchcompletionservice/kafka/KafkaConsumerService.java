package com.tough.matchcompletionservice.kafka;

import com.tough.matchcompletionservice.model.MatchState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumerService.class);

    @KafkaListener(topics = "match-complete", groupId = "match-completed-consumer-group")
    public void listen(MatchState message) {
        LOGGER.info("Received Match State from Kafka: {}", message.getMatchId());
    }
}
