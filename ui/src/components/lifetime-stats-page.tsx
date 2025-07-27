
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LifetimeStats } from "@/hooks/use-game";
import { ArrowLeft, BarChart3 } from "lucide-react";

interface LifetimeStatsPageProps {
  stats: LifetimeStats | null;
  onBack: () => void;
}

const StatRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-4 border-b">
        <dt className="text-lg text-muted-foreground">{label}</dt>
        <dd className="text-2xl font-bold text-primary">{value}</dd>
    </div>
);


export default function LifetimeStatsPage({ stats, onBack }: LifetimeStatsPageProps) {
    if (!stats) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary p-4">
                <Card className="w-full max-w-2xl shadow-2xl">
                    <CardHeader>
                        <CardTitle>Loading Stats...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please wait while we fetch your lifetime statistics.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-4xl flex items-center gap-3">
                        <BarChart3 className="h-10 w-10 text-primary" />
                        Lifetime Stats
                    </CardTitle>
                    <CardDescription className="mt-2 text-lg">
                        Your all-time performance overview.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <StatRow label="Games Played" value={stats.gamesPlayed} />
                <StatRow label="Games Won" value={`${stats.gamesWon} (${Number.isInteger(stats.winPercentage)
                    ? stats.winPercentage
                    : stats.winPercentage.toFixed(1)}%)`} />
                <StatRow label="Highest Checkout" value={stats.highestCheckout} />
                <StatRow label="Best Leg (Darts)" value={stats.bestLeg} />
                <StatRow label="3-Dart Average" value={stats.lifetimeAverage.toFixed(2)} />
              </div>
              <div>
                <StatRow label="100+ Scores" value={stats.oneHundredPlusScores} />
                <StatRow label="140+ Scores" value={stats.oneHundredFortyPlusScores} />
                <StatRow label="180 Scores" value={stats.oneHundredEightyScores} />
                <StatRow label="Total Darts Thrown" value={stats.numberOfDartsThrown} />
                <StatRow label="Total Points Scored" value={stats.totalScore} />
              </div>
            </dl>
             <div className="mt-8 flex justify-center">
                <Button onClick={onBack} className="h-14 px-8 text-lg">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
