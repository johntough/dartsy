
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
import { Target } from "lucide-react";
import { MatchRequestPayload } from "@/lib/types";

interface MatchRequestNotificationDialogProps {
  isOpen: boolean;
  matchRequestConfig: MatchRequestPayload;
  onAccept: () => void;
  onCancel: () => void;
}

export default function MatchRequestNotificationDialog({
  isOpen,
  matchRequestConfig,
  onAccept,
  onCancel,
}: MatchRequestNotificationDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500">
            <Target className="h-10 w-10" />
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Match Challenge!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <p>You have been challenged to a match by {matchRequestConfig.initiatorUserName}.</p>
            <p>It's a game of {matchRequestConfig.initialStartingScore}, best of {matchRequestConfig.totalLegs} legs!</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction asChild>
           <Button className="w-full h-14 text-lg" onClick={onAccept}>
            Accept
          </Button>
        </AlertDialogAction>
        <AlertDialogAction asChild>
          <Button className="w-full h-14 text-lg" onClick={onCancel}>
            Reject
          </Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
