package com.tough.dartsapp.service;

import com.tough.dartsapp.kafka.KafkaProducerService;
import com.tough.dartsapp.model.MatchState;
import com.tough.dartsapp.model.MatchStatus;
import com.tough.dartsapp.model.UserMatchState;
import com.tough.dartsapp.model.ScoreEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScoreService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, MatchState> redisTemplate;
    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public ScoreService(SimpMessagingTemplate messagingTemplate, RedisTemplate<String, MatchState> redisTemplate, KafkaProducerService kafkaProducerService) {
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
        this.kafkaProducerService = kafkaProducerService;
    }

    public void updateRemoteMatchState(MatchState updatedMatchState) {

        MatchState matchState = redisTemplate.opsForValue().get("match:" + updatedMatchState.getMatchId());

        if (matchState == null) {
            LOGGER.warn("Match state not found for match id: {}", matchState);
            return;
        }

        // If the leg has been won then clear the scores. This protects from a complete leg being restored (remaining score 0)
        // if the user refreshes their browser before a score is registered in the next leg
        List<ScoreEntry> initiatorUserScores = updatedMatchState.getInitiatorUserMatchState().getScores();
        List<ScoreEntry> challengedUserScores = updatedMatchState.getChallengedUserMatchState().getScores();

        if ((initiatorUserScores != null && !initiatorUserScores.isEmpty() && initiatorUserScores.getLast().isWinningScore()) ||
                (challengedUserScores != null && !challengedUserScores.isEmpty() && challengedUserScores.getLast().isWinningScore())) {
            updatedMatchState.getInitiatorUserMatchState().clearScores();
            updatedMatchState.getChallengedUserMatchState().clearScores();
        }

        // Send WebSocket message to prioritise responsiveness
        sendWebSocketMessage(updatedMatchState);
        storeInRedis(updatedMatchState);
    }

    public void updateLocalMatchState(MatchState updatedMatchState) {

        MatchState matchState = redisTemplate.opsForValue().get("match:" + updatedMatchState.getMatchId());

        if (matchState == null) {
            LOGGER.warn("Match state not found for match id: {}", updatedMatchState.getMatchId());
            return;
        }

        // If the leg has been won then clear the scores. This protects from a complete leg being restored (remaining score 0)
        // if the user refreshes their browser before a score is registered in the next leg
        List<ScoreEntry> initiatorUserScores = updatedMatchState.getInitiatorUserMatchState().getScores();
        List<ScoreEntry> challengedUserScores = updatedMatchState.getChallengedUserMatchState().getScores();

        if ((initiatorUserScores != null && !initiatorUserScores.isEmpty() && initiatorUserScores.getLast().isWinningScore()) ||
                (challengedUserScores != null && !challengedUserScores.isEmpty() && challengedUserScores.getLast().isWinningScore())) {
            clearLegScores(updatedMatchState);
        }

        storeInRedis(updatedMatchState);

        checkMatchComplete(updatedMatchState);
    }

    private void checkMatchComplete(MatchState updatedMatchState) {
        if (updatedMatchState.getMatchStatus().equals(MatchStatus.COMPLETED)) {
            kafkaProducerService.sendMatchCompleteMessage(updatedMatchState);
        }
    }

    private void sendWebSocketMessage(MatchState matchState) {
        LOGGER.info("Broadcasting match state to: /topic/match/{}", matchState.getMatchId());
        messagingTemplate.convertAndSend("/topic/match/" + matchState.getMatchId(), matchState);
    }

    private void storeInRedis(MatchState matchState) {
        String key = "match:" + matchState.getMatchId();
        redisTemplate.opsForValue().set(key, matchState);
        LOGGER.info("MatchState updated in Redis with key: {}", key);
    }

    private void clearLegScores(MatchState matchState) {
        matchState.getInitiatorUserMatchState().clearScores();
        matchState.getChallengedUserMatchState().clearScores();
        LOGGER.info("Scores cleared");
    }
}