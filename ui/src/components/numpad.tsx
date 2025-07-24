
"use client";

import { Button } from "@/components/ui/button";
import { CornerDownLeft, Delete } from "lucide-react";

interface NumpadProps {
  currentValue: string;
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function Numpad({
  currentValue,
  onNumberPress,
  onDelete,
  onSubmit,
  disabled,
}: NumpadProps) {
  const numbers = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
  ];

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 h-16 w-full rounded-md border bg-muted px-4 py-2 text-right font-mono text-5xl flex items-center justify-end">
        {currentValue || "0"}
        <span className="animate-pulse">|</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {numbers.map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-20 text-3xl font-bold"
            onClick={() => onNumberPress(num)}
            disabled={disabled}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="primary"
          className="h-20 text-3xl font-bold"
          onClick={onDelete}
          disabled={disabled}
          aria-label="Backspace"
        >
          <Delete className="h-8 w-8"/>
        </Button>
        <Button
          variant="outline"
          className="h-20 text-3xl font-bold"
          onClick={() => onNumberPress("0")}
          disabled={disabled}
        >
          0
        </Button>
         <Button
          variant="primary"
          className="h-20 text-2xl font-bold"
          onClick={onSubmit}
          disabled={disabled || currentValue.length === 0}
        >
          <CornerDownLeft className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
