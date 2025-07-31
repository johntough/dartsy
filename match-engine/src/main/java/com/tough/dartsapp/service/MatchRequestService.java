package com.tough.dartsapp.service;

import com.tough.dartsapp.model.MatchConfigRequest;
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
    public void notifyUserOfMatchRequest(String matchId, MatchConfigRequest matchConfigRequest) {
        SseEmitter emitter = emitters.get(matchConfigRequest.getChallengedUserSubject());

        if (emitter == null) {
            return;
        }

        MatchRequestPayload matchRequestPayload = new MatchRequestPayload(
                matchId,
                matchConfigRequest.getInitiatorUserName(),
                matchConfigRequest.getInitiatorUserSubject(),
                matchConfigRequest.getInitiatorUserLocation(),
                matchConfigRequest.getChallengedUserName(),
                matchConfigRequest.getInitialStartingScore(),
                matchConfigRequest.getTotalLegs()
        );

        try {
            LOGGER.info("Sending match request to {}", matchConfigRequest.getChallengedUserSubject());
            emitter.send(SseEmitter.event()
                    .name("match-request")
                    .data(matchRequestPayload));
        } catch (IOException e) {
            emitters.remove(matchConfigRequest.getChallengedUserSubject());
        }
    }

    public void acceptMatchRequest(String matchId, String initiatorUserSubject) {
        SseEmitter emitter = emitters.get(initiatorUserSubject);

        if (emitter == null) {
            return;
        }

        try {
            LOGGER.info("Sending match request acceptance message to {}", initiatorUserSubject);
            emitter.send(SseEmitter.event()
                    .name("match-request-accepted")
                    .data(true));
        } catch (IOException e) {
            emitters.remove(initiatorUserSubject);
        }
    }

    public void rejectMatchRequest(String matchId, String initiatorUserSubject) {
        SseEmitter emitter = emitters.get(initiatorUserSubject);

        if (emitter == null) {
            return;
        }

        try {
            LOGGER.info("Sending match request rejection message to {}", initiatorUserSubject);
            emitter.send(SseEmitter.event()
                    .name("match-request-rejected")
                    .data(true));
        } catch (IOException e) {
            emitters.remove(initiatorUserSubject);
        }
    }
}