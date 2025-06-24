package com.tough.dartsapp.service;

import com.tough.dartsapp.model.MatchState;
import com.tough.dartsapp.model.UserMatchState;
import com.tough.dartsapp.model.ScoreEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ScoreService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScoreService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, MatchState> redisTemplate;


    @Autowired
    public ScoreService(SimpMessagingTemplate messagingTemplate, RedisTemplate<String, MatchState> redisTemplate) {
        this.messagingTemplate = messagingTemplate;
        this.redisTemplate = redisTemplate;
    }

    public void registerScore(String matchId, ScoreEntry score) {

        MatchState matchState = redisTemplate.opsForValue().get("match:" + matchId);

        if (matchState == null) {
            LOGGER.warn("Match state not found for match id: {}", matchId);
            return;
        }

        // Step 1: Update MatchState as per newly registered score
        updateMatchState(matchState, score);

        // Step 2: Send WebSocket message to prioritise responsiveness
        sendWebSocketMessage(matchState);

        // Step 3: Update Redis
        storeInRedis(matchState);
    }

    private void updateMatchState(MatchState matchState, ScoreEntry score) {

        UserMatchState player = matchState.findUserMatchStateByUserSubject(score.getUserSubject());

        if (player == null) {
            // TODO: handle exception correctly: return 404?
            throw new IllegalArgumentException("User not found with ID: " + score.getUserSubject());
        }

        // using 1-based indexing as that's how the game of darts works (i.e. you don't have a zero throw)
        score.setRoundIndex(player.getScores().size() + 1);
        player.getScores().add(score);
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
}