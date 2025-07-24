
"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GameAverages, LegHistory, GameMode, Player } from "@/hooks/use-game";
import { Separator } from "./ui/separator";
import PlayerCard from "./player-card";
import { Bot, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { ALL_COUNTRIES } from "@/lib/countries";

interface ScoreHistoryProps {
  history: LegHistory;
  player1Name: string;
  player2Name: string;
  player1Location: string;
  scores: { player1: number; player2: number };
  matchAverages: GameAverages;
  legAverages: GameAverages;
  currentPlayer: Player;
  winner: Player | null;
  gameMode: GameMode;
  isAiThinking: boolean;
  legs: number;
  legsWon: { player1: number; player2: number };
  legStarter: Player;
  showAverage: boolean;
}

const getFlag = (locationCode: string) => {
  if (!locationCode || locationCode === 'none') return null;
  const country = ALL_COUNTRIES.find(c => c.code === locationCode);
  return country?.flag;
};


export default function ScoreHistory({
  history,
  player1Name,
  player2Name,
  player1Location,
  scores,
  matchAverages,
  legAverages,
  currentPlayer,
  winner,
  gameMode,
  isAiThinking,
  legs,
  legsWon,
  legStarter,
  showAverage,
}: ScoreHistoryProps) {
  const { player1: p1History, player2: p2History } = history;
  const player1Flag = getFlag(player1Location);

  // Function to calculate remaining score based on history
  const calculateRemaining = (initialScore: number, history: LegHistory['player1']) => {
    return history.map((turn, index) => {
        const scoreSoFar = history.slice(0, index + 1).reduce((sum, t) => sum + t.roundScore, 0);
        return initialScore - scoreSoFar;
    });
  }
  
  const initialScore = useMemo(() => scores.player1 + p1History.reduce((sum, t) => sum + t.roundScore, 0), [scores.player1, p1History]);

  const p1Remaining = calculateRemaining(initialScore, p1History);
  const p2Remaining = calculateRemaining(initialScore, p2History);


  return (
    <Card className="shadow-sm w-full h-full">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <Badge variant="secondary" className="text-base px-4 py-2">
            Best of {legs} legs
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xl font-semibold">Legs</p>
              <p className="text-7xl font-bold text-primary">{legsWon.player1}</p>
            </div>
             <div className="text-center">
              <p className="text-xl font-semibold">Legs</p>
              <p className="text-7xl font-bold text-primary">{legsWon.player2}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
          <PlayerCard
            name={player1Name}
            score={scores.player1}
            matchAverage={matchAverages.player1}
            legAverage={legAverages.player1}
            isCurrentPlayer={currentPlayer === "player1"}
            isWinner={winner === "player1"}
            isLegStarter={legStarter === "player1"}
            icon={player1Flag ? <span className="text-3xl">{player1Flag}</span> : <User className="h-6 w-6 text-primary" />}
            showAverage={showAverage}
          />
          <PlayerCard
            name={player2Name}
            score={scores.player2}
            matchAverage={matchAverages.player2}
            legAverage={legAverages.player2}
            isCurrentPlayer={currentPlayer === "player2"}
            isWinner={winner === "player2"}
            isThinking={isAiThinking}
            isLegStarter={legStarter === "player2"}
            icon={
              gameMode === "ai" ? (
                <Bot className="h-6 w-6 text-primary" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )
            }
            showAverage={showAverage}
          />
        </div>
        <Separator />
        <ScrollArea className="h-[40vh] w-full mt-4">
           <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 px-4 text-center h-full min-h-full">
            <ul className="mt-2 space-y-2 text-right">
              {p1History.map((turn, index) => (
                <li
                  key={`p1-score-${index}`}
                  className="text-muted-foreground font-mono py-1 flex justify-end items-baseline gap-4"
                >
                  <span className="text-xs w-8 text-left">{(turn.roundIndex + 1) * 3}</span>
                  <span className="text-3xl w-16 text-right">{turn.roundScore > 0 ? turn.roundScore : "-"}</span>
                  <span className="text-5xl font-bold w-24 text-right">{p1Remaining[index]}</span>
                </li>
              ))}
            </ul>

            <Separator orientation="vertical" className="h-full" />

            <ul className="mt-2 space-y-2 text-left">
              {p2History.map((turn, index) => (
                <li
                  key={`p2-score-${index}`}
                  className="text-muted-foreground font-mono py-1 flex justify-start items-baseline gap-4"
                >
                   <span className="text-5xl font-bold w-24 text-left">{p2Remaining[index]}</span>
                  <span className="text-3xl w-16 text-left">{turn.roundScore > 0 ? turn.roundScore : "-"}</span>
                  <span className="text-xs w-8 text-right">{(turn.roundIndex + 1) * 3}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
