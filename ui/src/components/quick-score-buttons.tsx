
"use client";

import { Button } from "@/components/ui/button";

interface QuickScoreButtonsProps {
  onScorePress: (score: string) => void;
  disabled: boolean;
}

export function QuickScoreButtons({ onScorePress, disabled }: QuickScoreButtonsProps) {
  const commonScores = [100, 140, 180, 60, 85, 81, 45, 41];

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-2">
        {commonScores.map((score) => (
          <Button
            key={score}
            variant="outline"
            className="h-16 text-xl font-bold"
            onClick={() => onScorePress(score.toString())}
            disabled={disabled}
          >
            {score}
          </Button>
        ))}
      </div>
    </div>
  );
}
