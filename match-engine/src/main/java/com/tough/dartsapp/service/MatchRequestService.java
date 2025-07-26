package com.tough.dartsapp.service;

import com.tough.dartsapp.model.MatchRequestPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MatchRequestService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MatchRequestService.class);

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String userSubject) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userSubject, emitter);

        emitter.onCompletion(() -> emitters.remove(userSubject));
        emitter.onTimeout(() -> emitters.remove(userSubject));
        emitter.onError(e -> emitters.remove(userSubject));

        return emitter;
    }

    // TODO: implement error handling flows
    public void notifyUserOfMatchRequest(String challengedUserSubject, String initiatorUserName, String matchId) {
        SseEmitter emitter = emitters.get(challengedUserSubject);

        if (emitter == null) {
            return;
        }

        MatchRequestPayload matchRequestPayload = new MatchRequestPayload(
                matchId,
                initiatorUserName + " has challenged you to a match!"
        );

        try {
            LOGGER.info("Sending match request to {}", challengedUserSubject);
            emitter.send(SseEmitter.event()
                    .name("match-request")
                    .data(matchRequestPayload));
        } catch (IOException e) {
            emitters.remove(challengedUserSubject);
        }
    }
}