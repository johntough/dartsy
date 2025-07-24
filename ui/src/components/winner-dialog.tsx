
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PartyPopper } from "lucide-react";

interface WinnerDialogProps {
  isOpen: boolean;
  winnerName: string;
  onClose: () => void;
}

export default function WinnerDialog({
  isOpen,
  winnerName,
  onClose,
}: WinnerDialogProps) {
  if (!isOpen) return null;
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper className="h-10 w-10" />
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Leg Complete!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {winnerName} wins the leg!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction className="w-full h-14 text-lg" onClick={onClose}>
          Continue
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
