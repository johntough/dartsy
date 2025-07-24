
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

interface CheckoutDartsDialogProps {
  isOpen: boolean;
  score: number;
  onDartsSelected: (darts: number) => void;
  onCancel: () => void;
}

// Function to determine possible checkout combinations
const getPossibleDartCounts = (score: number): number[] => {
  if (score <= 0 || score > 170) return [];

  // 1-dart checkout (must be a double)
  const can1Dart = score <= 40 && score % 2 === 0;

  // 2-dart checkout (e.g., T20, D20 for 100)
  const can2Dart = score <= 110 && score !== 109 && score !== 106 && score !== 103 && score !== 102 && score !== 99;

  // 3-dart checkout is always possible for valid checkout scores
  const can3Dart = true;

  const options = [];
  if (can1Dart) options.push(1);
  if (can2Dart) options.push(2);
  if (can3Dart) options.push(3);

  // Special cases where 2 darts is impossible but 1 is.
  if (score === 50 && !options.includes(2)) { // Bullseye
     // It is possible to get 100 with T20, D20. Or 98 with T20, D19.
  }
  
  if (options.length === 0) return [3]; // Fallback for complex cases, assume 3
  
  // Filter out impossible options based on score
  if (score > 110) return [3]; // e.g., 170 must be 3 darts
  if (score > 40 && score <= 110) {
      const twoDartOptions = options.filter(o => o > 1);
      if(twoDartOptions.length > 0) return twoDartOptions;
  }

  return options;
};

export default function CheckoutDartsDialog({
  isOpen,
  score,
  onDartsSelected,
  onCancel,
}: CheckoutDartsDialogProps) {
  if (!isOpen) return null;

  const dartOptions = getPossibleDartCounts(score);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
            <Target className="h-10 w-10" />
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Checkout Successful!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            How many darts did you use for the {score} checkout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center flex-col-reverse sm:flex-row gap-2">
           <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full sm:w-auto h-14 text-lg" onClick={onCancel}>Cancel</Button>
          </AlertDialogCancel>
          {dartOptions.map((darts) => (
            <AlertDialogAction asChild key={darts}>
              <Button
                onClick={() => onDartsSelected(darts)}
                className="w-full sm:w-auto h-14 text-lg"
              >
                {darts} {darts === 1 ? "Dart" : "Darts"}
              </Button>
            </AlertDialogAction>
          ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
