
"use client";

import type { GameAverages, LegHistory, GameMode, Player } from "@/hooks/use-game";
import Numpad from "@/components/numpad";
import ScoreHistory from "./score-history";
import { QuickScoreButtons } from "./quick-score-buttons";
import { Button } from "./ui/button";
import CheckoutSuggestions from "./checkout-suggestions";
import { Grid, BarChart3 } from "lucide-react";

interface GameBoardProps {
  scores: { player1: number; player2: number };
  matchAverages: GameAverages;
  legAverages: GameAverages;
  currentPlayer: Player;
  inputValue: string;
  winner: Player | null;
  matchWinner: Player | null;
  gameMode: GameMode;
  isAiThinking: boolean;
  player1Name: string;
  player2Name: string;
  player1Location: string;
  history: LegHistory;
  legs: number;
  legsWon: { player1: number; player2: number };
  legStarter: Player;
  showAverage: boolean;
  checkoutSuggestions: string[];
  isSuggestionsLoading: boolean;
  handleNumberPress: (num: string) => void;
  handleDelete: () => void;
  handleSubmit: () => void;
  handleQuickScore: (score: string) => void;
  handleCheckout: () => void;
  openDartboard: () => void;
  toggleStatsScreen: () => void;
}

export default function GameBoard({
  scores,
  matchAverages,
  legAverages,
  currentPlayer,
  inputValue,
  winner,
  matchWinner,
  gameMode,
  isAiThinking,
  player1Name,
  player2Name,
  player1Location,
  history,
  legs,
  legsWon,
  legStarter,
  showAverage,
  checkoutSuggestions,
  isSuggestionsLoading,
  handleNumberPress,
  handleDelete,
  handleSubmit,
  handleQuickScore,
  handleCheckout,
  openDartboard,
  toggleStatsScreen,
}: GameBoardProps) {
  const isDisabled = !!winner || !!matchWinner || (gameMode === "ai" && currentPlayer === "player2");

  const BOGEY_NUMBERS = [169, 168, 166, 165, 163, 162, 159];
  const currentScore = scores[currentPlayer];
  const canCheckout = currentScore <= 170 && !BOGEY_NUMBERS.includes(currentScore);

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
      <div className="md:col-span-2">
        <ScoreHistory
          history={history}
          player1Name={player1Name}
          player2Name={player2Name}
          player1Location={player1Location}
          scores={scores}
          matchAverages={matchAverages}
          legAverages={legAverages}
          currentPlayer={currentPlayer}
          winner={winner}
          gameMode={gameMode}
          isAiThinking={isAiThinking}
          legs={legs}
          legsWon={legsWon}
          legStarter={legStarter}
          showAverage={showAverage}
        />
      </div>

      <div className="flex flex-col gap-8 md:col-span-1">
        <div className="w-full max-w-xs mx-auto">
          <Numpad
            currentValue={inputValue}
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            disabled={isDisabled}
          />
          <QuickScoreButtons
            onScorePress={handleQuickScore}
            disabled={isDisabled}
          />
          <div className="grid grid-cols-2 gap-2 mt-4">
             <Button
                variant="destructive"
                className="w-full h-20 text-xl font-bold"
                onClick={() => handleQuickScore("0")}
                disabled={isDisabled}
              >
                NO SCORE
              </Button>
            {canCheckout && !isDisabled ? (
              <Button
                variant="default"
                className="w-full h-20 text-xl font-bold bg-green-500 hover:bg-green-600 text-white"
                onClick={handleCheckout}
              >
                CHECKOUT
              </Button>
            ) : <div /> }
          </div>
          <Button variant="outline" className="w-full mt-4 h-16 text-xl" onClick={openDartboard} disabled={isDisabled}>
            <Grid className="mr-2 h-6 w-6" />
            Visual Score
          </Button>
          <Button variant="outline" className="w-full mt-2 h-16 text-xl" onClick={toggleStatsScreen}>
            <BarChart3 className="mr-2 h-6 w-6" />
            Match Stats
          </Button>

          {canCheckout && (
            <CheckoutSuggestions suggestions={checkoutSuggestions} isLoading={isSuggestionsLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
