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
            case GameMode.AI:
                updateUserStats(matchState.getInitiatorUserMatchState(), matchState.getInitialStartingScore(), isInitiatorWinner(matchState));
                break;
            case GameMode.REMOTE:
                updateUserStats(matchState.getInitiatorUserMatchState(), matchState.getInitialStartingScore(), isInitiatorWinner(matchState));
                updateUserStats(matchState.getChallengedUserMatchState(), matchState.getInitialStartingScore(), !isInitiatorWinner(matchState));
                break;
        }
    }

    private void updateUserStats(UserMatchState userMatchState, int initialStartingScore, boolean isUserWinner) {

        userRepository.findById(userMatchState.getSubject()).ifPresentOrElse(user -> {

                // No stats are set when the user is created by the authentication service. Initialising LifetimeStats here if first time.
                if (user.getLifetimeStats() == null) {
                    user.setLifetimeStats(new LifetimeStats());
                }

                user.getLifetimeStats().incrementGamesPlayed();
                if (isUserWinner) {
                    user.getLifetimeStats().incrementGamesWon();
                }


                if (userMatchState.getHighestCheckout() > user.getLifetimeStats().getHighestCheckout()) {
                    user.getLifetimeStats().setHighestCheckout(userMatchState.getHighestCheckout());
                }

                if (initialStartingScore == 501) {
                    int bestLeg = userMatchState.getBestLeg();
                    int lifetimeBest = user.getLifetimeStats().getBestLeg();

                    if (bestLeg > 0 && (lifetimeBest == 0 || bestLeg < lifetimeBest)) {
                        user.getLifetimeStats().setBestLeg(bestLeg);
                    }
                }


                user.getLifetimeStats().setOneHundredPlusScores(user.getLifetimeStats().getOneHundredPlusScores() + userMatchState.getOneHundredCount());
                user.getLifetimeStats().setOneHundredFortyPlusScores(user.getLifetimeStats().getOneHundredFortyPlusScores() + userMatchState.getOneHundredAndFortyCount());
                user.getLifetimeStats().setOneHundredEightyScores(user.getLifetimeStats().getOneHundredEightyScores() + userMatchState.getOneHundredAndEightyCount());

                user.getLifetimeStats().setNumberOfDartsThrown(user.getLifetimeStats().getNumberOfDartsThrown() + userMatchState.getTotalMatchDartsThrown());
                user.getLifetimeStats().setTotalScore(user.getLifetimeStats().getTotalScore() + userMatchState.getTotalMatchScore());

                userRepository.save(user);

                LOGGER.info("Match stats persisted for user: {}. Match Won: {}, Best Leg: {}, Highest Checkout: {}, 100+: {}, 140+: {}, 180: {}, Total Darts Thrown: {}",
                    userMatchState.getSubject(),
                    isUserWinner,
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
