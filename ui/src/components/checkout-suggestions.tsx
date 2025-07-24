
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface CheckoutSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
}

export default function CheckoutSuggestions({
  suggestions,
  isLoading,
}: CheckoutSuggestionsProps) {
  const hasSuggestions = suggestions.length > 0;

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs mx-auto mt-4 bg-amber-500/10 border-amber-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-amber-700">
            <Lightbulb className="w-5 h-5" />
            Checkout Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-6 w-3/4 bg-amber-500/20" />
          <Skeleton className="h-6 w-1/2 bg-amber-500/20" />
        </CardContent>
      </Card>
    );
  }

  if (!hasSuggestions) {
    return null;
  }

  return (
    <Card className="w-full max-w-xs mx-auto mt-4 bg-amber-100/60 dark:bg-amber-900/40 border-amber-500/20">
      <CardHeader className="pb-4 pt-4">
        <CardTitle className="flex items-center gap-2 text-base text-amber-800 dark:text-amber-200">
          <Lightbulb className="w-5 h-5" />
          Checkout Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pb-4">
        {suggestions.map((suggestion, index) => (
          <p
            key={index}
            className="text-lg font-semibold text-center text-amber-900 dark:text-amber-100"
          >
            {suggestion}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
