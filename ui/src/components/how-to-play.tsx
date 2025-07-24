
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import Image from "next/image";

interface HowToPlayProps {
  onBack: () => void;
}

const rules = [
    {
        title: "The Objective",
        content: "The most common darts game is '501'. Each player starts with a score of 501 and takes turns throwing three darts. The goal is to be the first player to reach exactly zero. You must score a 'double' with your final dart to win the leg.",
    },
    {
        title: "Scoring on the Dartboard",
        content: "A standard dartboard is divided into 20 numbered sections. Hitting the large part of a section scores the number shown. The outer ring is the 'double' ring, scoring twice the number. The inner ring is the 'treble' (or triple) ring, scoring three times the number.",
        image: {
            src: "https://placehold.co/600x400.png",
            alt: "A diagram of a dartboard showing single, double, and treble scoring areas.",
            hint: "dartboard diagram"
        }
    },
    {
        title: "The Bullseye",
        content: "The center of the board has two sections. The outer green ring is the 'outer bull' or 'bull', worth 25 points. The very center red circle is the 'inner bull' or 'bullseye', worth 50 points. The inner bull (50) also counts as a double for finishing a leg (Double 25).",
        image: {
            src: "https://placehold.co/300x300.png",
            alt: "A close-up of the bullseye on a dartboard.",
            hint: "dartboard bullseye"
        }
    },
    {
        title: "Winning a Leg (Checking Out)",
        content: "To win a leg, you must reach exactly zero by hitting a double with your final dart. For example, if you have 40 points left, you need to hit a Double 20. If you have 32 left, you need a Double 16. If you have 50 left, you can hit the Bullseye (which counts as Double 25). This is often called 'checking out'.",
    },
    {
        title: "Going Bust",
        content: "You 'go bust' if you score more points than you have remaining, if you reduce your score to exactly 1, or if you reduce your score to 0 but not with a double. When you go bust, your turn ends immediately and your score is returned to what it was at the start of your turn.",
    },
     {
        title: "What is a 'Leg' and a 'Match'?",
        content: "A single game of 501 is called a 'leg'. A 'match' is made up of multiple legs. The first player to win the required number of legs (e.g., best of 5, first to 3) wins the match.",
    },
];

export default function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-secondary p-4">
        <div className="w-full max-w-4xl">
            <Card className="w-full shadow-2xl">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-4xl flex items-center gap-3">
                                <Gamepad2 className="h-10 w-10 text-primary" />
                                How to Play Darts (501)
                            </CardTitle>
                            <CardDescription className="mt-2 text-lg">
                                A beginner's guide to the classic game of 501.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {rules.map((rule, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-2xl hover:no-underline">{rule.title}</AccordionTrigger>
                                <AccordionContent className="text-lg space-y-4 pt-2">
                                    <p>{rule.content}</p>
                                    {rule.image && (
                                        <div className="flex justify-center py-4">
                                             <Image
                                                src={rule.image.src}
                                                alt={rule.image.alt}
                                                width={400}
                                                height={300}
                                                className="rounded-lg shadow-md"
                                                data-ai-hint={rule.image.hint}
                                            />
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                     <div className="mt-8 flex justify-center">
                        <Button onClick={onBack} className="h-14 px-8 text-lg">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
