package com.tough.dartsapp.service;

import com.tough.dartsapp.model.MatchConfigRequest;
import com.tough.dartsapp.model.MatchState;
import com.tough.dartsapp.model.MatchStatus;
import com.tough.dartsapp.model.UserMatchState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MatchService.class);

    private final RedisTemplate<String, MatchState> redisTemplate;


    @Autowired
    public MatchService(RedisTemplate<String, MatchState> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String configureMatch(MatchConfigRequest matchConfigRequest) {
        String matchId = UUID.randomUUID().toString();

        MatchState matchState = new MatchState();
        matchState.setMatchId(matchId);
        matchState.setMatchStatus(MatchStatus.REQUESTED);

        UserMatchState initiator = new UserMatchState();
        initiator.setUserSubject(matchConfigRequest.getInitiatorUserSubject());
        initiator.setUserName(matchConfigRequest.getInitiatorUserName());

        UserMatchState challengedUser = new UserMatchState();
        challengedUser.setUserSubject(matchConfigRequest.getChallengedUserSubject());
        challengedUser.setUserName(matchConfigRequest.getChallengedUserName());

        matchState.setUserMatchStateList(List.of(initiator, challengedUser));

        storeInRedis(matchState);

        return matchId;
    }

    public Optional<MatchState> getMatchState(String matchId) {
        MatchState matchState = redisTemplate.opsForValue().get("match:" + matchId);

        if (matchState == null) {
            LOGGER.warn("Match state not found for match id: {}", matchId);
            return Optional.empty();
        }

        return Optional.of(matchState);
    }

    public List<String> getActiveMatchIds() {

        Set<String> keys = redisTemplate.keys("match:*");

        if (keys == null || keys.isEmpty()) {
            return List.of();
        }

        List<String> inProgressMatchIds = keys.stream()
                .map(redisTemplate.opsForValue()::get)
                .filter(Objects::nonNull)
                .filter(match -> match.getMatchStatus() == MatchStatus.IN_PROGRESS)
                .map(MatchState::getMatchId)
                .toList();

        LOGGER.info("{} active matches returned", inProgressMatchIds.size());

        return inProgressMatchIds;
    }

    private void storeInRedis(MatchState matchState) {
        String key = "match:" + matchState.getMatchId();
        redisTemplate.opsForValue().set(key, matchState);
        LOGGER.info("New Match stored in Redis with key: {}", key);
    }
}