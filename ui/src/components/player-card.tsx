
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Crown, Target } from "lucide-react";
import type { ReactNode } from "react";

interface PlayerCardProps {
  name: string;
  score: number;
  matchAverage: number;
  legAverage: number;
  isCurrentPlayer: boolean;
  isWinner: boolean;
  isThinking?: boolean;
  isLegStarter: boolean;
  icon: ReactNode;
  showAverage: boolean;
}

export default function PlayerCard({
  name,
  score,
  matchAverage,
  legAverage,
  isCurrentPlayer,
  isWinner,
  isThinking = false,
  isLegStarter,
  icon,
  showAverage,
}: PlayerCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300",
        isCurrentPlayer && !isWinner && "scale-105 border-primary shadow-primary/30",
        isWinner && "border-yellow-400 bg-yellow-400/10"
      )}
    >
      {isWinner && (
        <div className="absolute -top-4 -right-4 rounded-full bg-yellow-400 p-2 text-white shadow-lg">
          <Crown className="h-6 w-6" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-2xl font-semibold">{name}</CardTitle>
          {isLegStarter && !isWinner && <Target className="h-6 w-6 text-red-500" />}
        </div>
        <CardDescription className="text-xs">Current Score</CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div
          key={score}
          className="animate-in fade-in zoom-in-95 duration-500"
        >
          {isThinking ? (
            <div className="flex h-[60px] items-center justify-center">
              <div className="h-4 w-16 animate-pulse rounded-full bg-muted-foreground/30"></div>
            </div>
          ) : (
            <p className="font-headline text-6xl font-bold tracking-tighter text-primary">
              {score}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0 w-full min-h-[40px]">
        {showAverage && (
          <div className="flex flex-col w-full text-xs text-muted-foreground text-right">
              <div>
                Avg (leg): {legAverage.toFixed(2)}
              </div>
              <div>
                Avg (match): {matchAverage.toFixed(2)}
              </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
