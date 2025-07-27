package com.tough.dartsapp.matchcompletion.service;

import com.tough.dartsapp.matchcompletion.model.*;
import com.tough.dartsapp.matchcompletion.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MatchCompletionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MatchCompletionService.class);

    private final UserRepository userRepository;

    @Autowired
    public MatchCompletionService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void persistMatchStats(MatchState matchState) {

        switch (matchState.getGameMode()) {
            case GameMode.LOCAL:
                updateUserStats(matchState.getInitiatorUserMatchState(), isInitiatorWinner(matchState));
                break;
            case GameMode.AI:
                LOGGER.warn("Persisting stats in AI game mode not yet supported.");
                break;
            case GameMode.REMOTE:
                LOGGER.warn("Persisting stats in REMOTE game mode not yet supported.");
                break;
        }
    }

    private void updateUserStats(UserMatchState userMatchState, boolean isInitiatorWinner) {

        userRepository.findById(userMatchState.getSubject()).ifPresentOrElse(user -> {

                // No stats are set when the user is created by the authentication service. Initialising LifetimeStats here if first time.
                if (user.getLifetimeStats() == null) {
                    user.setLifetimeStats(new LifetimeStats());
                }

                user.getLifetimeStats().incrementGamesPlayed();
                if (isInitiatorWinner) {
                    user.getLifetimeStats().incrementGamesWon();
                }

                if (userMatchState.getHighestCheckout() > user.getLifetimeStats().getHighestCheckout()) {
                    user.getLifetimeStats().setHighestCheckout(userMatchState.getHighestCheckout());
                }

                if (user.getLifetimeStats().getBestLeg() == 0 || userMatchState.getBestLeg() < user.getLifetimeStats().getBestLeg()) {
                    user.getLifetimeStats().setBestLeg(userMatchState.getBestLeg());
                }

                user.getLifetimeStats().setOneHundredPlusScores(user.getLifetimeStats().getOneHundredPlusScores() + userMatchState.getOneHundredCount());
                user.getLifetimeStats().setOneHundredFortyPlusScores(user.getLifetimeStats().getOneHundredFortyPlusScores() + userMatchState.getOneHundredAndFortyCount());
                user.getLifetimeStats().setOneHundredEightyScores(user.getLifetimeStats().getOneHundredEightyScores() + userMatchState.getOneHundredAndEightyCount());

                user.getLifetimeStats().setNumberOfDartsThrown(user.getLifetimeStats().getNumberOfDartsThrown() + userMatchState.getTotalMatchDartsThrown());
                user.getLifetimeStats().setTotalScore(user.getLifetimeStats().getTotalScore() + userMatchState.getTotalMatchScore());

                userRepository.save(user);

                LOGGER.info("Match stats persisted for user: {}. Match Won: {}, Best Leg: {}, Highest Checkout: {}, 100+: {}, 140+: {}, 180: {}, Total Darts Thrown: {}",
                    userMatchState.getSubject(),
                    isInitiatorWinner,
                    userMatchState.getBestLeg(),
                    userMatchState.getHighestCheckout(),
                    userMatchState.getOneHundredCount(),
                    userMatchState.getOneHundredAndFortyCount(),
                    userMatchState.getOneHundredAndEightyCount(),
                    userMatchState.getTotalMatchDartsThrown()
                );
            },() -> LOGGER.error("Unable to persist match stats for User: {}. User not found in DB.", userMatchState.getSubject()));
    }

    private boolean isInitiatorWinner(MatchState matchState) {
        return matchState.getInitiatorUserMatchState().getLegsWon() > matchState.getChallengedUserMatchState().getLegsWon();
    }
}
