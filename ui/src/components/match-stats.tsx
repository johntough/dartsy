
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GameMode, PlayerStats, GameAverages } from "@/hooks/use-game";
import { ArrowLeft, Bot, Home, User } from "lucide-react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { ALL_COUNTRIES } from "@/lib/countries";

interface MatchStatsProps {
  stats: { player1: PlayerStats; player2: PlayerStats };
  player1Name: string;
  player2Name: string;
  player1Location: string;
  gameMode: GameMode;
  matchAverages: GameAverages;
  legsWon: { player1: number; player2: number };
  onBack: () => void;
  matchWinner: "player1" | "player2" | null;
}

const getFlag = (locationCode: string) => {
    if (!locationCode || locationCode === 'none') return null;
    const country = ALL_COUNTRIES.find(c => c.code === locationCode);
    return country?.flag;
};

const StatRow = ({
  label,
  valueP1,
  valueP2,
  highlightP1,
  highlightP2,
}: {
  label: string;
  valueP1: string | number;
  valueP2: string | number;
  highlightP1: boolean;
  highlightP2: boolean;
}) => (
  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
    <dd
      className={cn(
        "text-2xl font-bold text-primary text-right rounded-md px-2 py-1 transition-colors",
        highlightP1 && "bg-green-100 dark:bg-green-900/40"
      )}
    >
      {valueP1}
    </dd>
    <dt className="text-sm font-medium text-muted-foreground text-center">
      {label}
    </dt>
    <dd
      className={cn(
        "text-2xl font-bold text-primary text-left rounded-md px-2 py-1 transition-colors",
        highlightP2 && "bg-green-100 dark:bg-green-900/40"
      )}
    >
      {valueP2}
    </dd>
  </div>
);

export default function MatchStats({
  stats,
  player1Name,
  player2Name,
  player1Location,
  gameMode,
  matchAverages,
  legsWon,
  onBack,
  matchWinner,
}: MatchStatsProps) {
  const p1 = stats.player1;
  const p2 = stats.player2;
  const player1Flag = getFlag(player1Location);

  const compare = (val1: number, val2: number, higherIsBetter = true) => {
    if (val1 === val2) return { p1: false, p2: false };
    if (higherIsBetter) {
      return { p1: val1 > val2, p2: val2 > val1 };
    }
    // Handle cases where lower is better, like best leg darts
    const val1IsFinite = isFinite(val1);
    const val2IsFinite = isFinite(val2);
    if (!val1IsFinite && val2IsFinite) return { p1: false, p2: true };
    if (val1IsFinite && !val2IsFinite) return { p1: true, p2: false };
    return { p1: val1 < val2, p2: val2 < val1 };
  };

  const legsWonHighlights = compare(legsWon.player1, legsWon.player2);
  const avgHighlights = compare(matchAverages.player1, matchAverages.player2);
  const s180sHighlights = compare(p1.oneHundredAndEightyCount, p2.oneHundredAndEightyCount);
  const s140sHighlights = compare(p1.oneHundredAndFortyCount, p2.oneHundredAndFortyCount);
  const s100sHighlights = compare(p1.oneHundredCount, p2.oneHundredCount);
  const checkoutHighlights = compare(p1.highestCheckout, p2.highestCheckout);
  const bestLegHighlights = compare(p1.bestLeg, p2.bestLeg, false);

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Match Statistics</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
          <div className="flex items-center justify-end gap-3">
            <h3 className="text-2xl font-semibold">{player1Name}</h3>
             {player1Flag ? <span className="text-4xl">{player1Flag}</span> : <User className="w-8 h-8 text-primary" />}
          </div>
          <div />
          <div className="flex items-center justify-start gap-3">
            {gameMode === "ai" ? (
              <Bot className="w-8 h-8 text-primary" />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
            <h3 className="text-2xl font-semibold">{player2Name}</h3>
          </div>
        </div>

        <div className="divide-y divide-border">
          <StatRow
            label="Legs Won"
            valueP1={legsWon.player1}
            valueP2={legsWon.player2}
            highlightP1={legsWonHighlights.p1}
            highlightP2={legsWonHighlights.p2}
          />
          <StatRow
            label="Match Average"
            valueP1={matchAverages.player1.toFixed(2)}
            valueP2={matchAverages.player2.toFixed(2)}
            highlightP1={avgHighlights.p1}
            highlightP2={avgHighlights.p2}
          />
          <StatRow
            label="180s Hit"
            valueP1={p1.oneHundredAndEightyCount}
            valueP2={p2.oneHundredAndEightyCount}
            highlightP1={s180sHighlights.p1}
            highlightP2={s180sHighlights.p2}
          />
          <StatRow
            label="140+ Hit"
            valueP1={p1.oneHundredAndFortyCount}
            valueP2={p2.oneHundredAndFortyCount}
            highlightP1={s140sHighlights.p1}
            highlightP2={s140sHighlights.p2}
          />
          <StatRow
            label="100+ Hit"
            valueP1={p1.oneHundredCount}
            valueP2={p2.oneHundredCount}
            highlightP1={s100sHighlights.p1}
            highlightP2={s100sHighlights.p2}
          />
          <StatRow
            label="Highest Checkout"
            valueP1={p1.highestCheckout > 0 ? p1.highestCheckout : "-"}
            valueP2={p2.highestCheckout > 0 ? p2.highestCheckout : "-"}
            highlightP1={checkoutHighlights.p1}
            highlightP2={checkoutHighlights.p2}
          />
          <StatRow
            label="Best Leg (Darts)"
            valueP1={p1.bestLeg !== Infinity ? p1.bestLeg : "-"}
            valueP2={p2.bestLeg !== Infinity ? p2.bestLeg : "-"}
            highlightP1={bestLegHighlights.p1}
            highlightP2={bestLegHighlights.p2}
          />
        </div>

        <Separator className="my-8" />

        <div className="flex justify-center">
           {matchWinner ? (
             <Button onClick={onBack} className="h-14 px-8 text-lg">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
           ) : (
            <Button onClick={onBack} className="h-14 px-8 text-lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Game
            </Button>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
