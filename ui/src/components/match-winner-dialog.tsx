
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";

interface MatchWinnerDialogProps {
  isOpen: boolean;
  winnerName: string;
  onViewStats: () => void;
}

export default function MatchWinnerDialog({
  isOpen,
  winnerName,
  onViewStats,
}: MatchWinnerDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500">
            <Trophy className="h-10 w-10" />
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Match won by {winnerName}!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {winnerName} is the Dartsy champion!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction asChild>
           <Button className="w-full h-14 text-lg" onClick={onViewStats}>
            View Match Stats
          </Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
