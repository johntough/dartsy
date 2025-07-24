
"use client";

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, User, Users, Trophy, Star, X } from "lucide-react";
import type { GameConfig, AiLevel, PlayerProfile } from "@/hooks/use-game";
import { Slider } from "./ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OnScreenKeyboard from "@/components/on-screen-keyboard";

interface GameSetupWizardProps {
  onSetupComplete: (config: Omit<GameConfig, 'legsWon' | 'player1Location'>) => void;
  onCancel: () => void;
  playerProfile: PlayerProfile;
}

const FAKE_PLAYERS = [
  "Darth Vaper",
  "The Bullionaire",
  "Sir Scores-a-Lot",
  "Mad-Eye Moody",
  "Arrow Dynamic",
  "Triple Threat",
];

const AI_LEVELS: { id: AiLevel; name: string; description: string; avgRange: string }[] = [
    { id: 'newbie', name: "Never played before", description: "Just learning the ropes.", avgRange: "25-45" },
    { id: 'beginner', name: "Beginner", description: "Knows which end of the dart is which.", avgRange: "30-60" },
    { id: 'pub', name: "Solid Pub Player", description: "A regular at the local league.", avgRange: "55-70" },
    { id: 'county', name: "County Player", description: "A formidable opponent.", avgRange: "65-95" },
    { id: 'pro', name: "PDC Tour Card Holder", description: "Welcome to the big leagues.", avgRange: "90-110" },
];


export function GameSetupWizard({ onSetupComplete, onCancel, playerProfile }: GameSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [gameMode, setGameMode] = useState<Omit<GameConfig, 'player1Location'>['gameMode']>("2p");
  const [player1Name, setPlayer1Name] = useState(playerProfile.name || "Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [initialScore, setInitialScore] = useState("501");
  const [legs, setLegs] = useState(5);
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);
  const [aiLevel, setAiLevel] = useState<AiLevel>('pub');
  
  const [activeInput, setActiveInput] = useState<'player1Name' | 'player2Name' | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const player1Ref = useRef<HTMLInputElement>(null);
  const player2Ref = useRef<HTMLInputElement>(null);

  const maxSteps = useMemo(() => {
    if (gameMode === '2p') return 4;
    if (gameMode === 'ai') return 4;
    if (gameMode === 'remote') return 4;
    return 4;
  }, [gameMode]);


  const handleNext = () => {
    setIsKeyboardVisible(false);
    setStep(prev => Math.min(prev + 1, maxSteps));
  };
  
  const handleBack = () => {
    setIsKeyboardVisible(false);
    if (step === 1) {
      onCancel();
      return;
    }
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleStartGame = () => {
    onSetupComplete({
      gameMode,
      player1Name,
      player2Name: gameMode === 'remote' ? selectedOpponent! : (gameMode === 'ai' ? 'AI Opponent' : player2Name),
      initialScore: parseInt(initialScore, 10),
      legs: legs,
      aiLevel,
    });
  };

  const handleInputFocus = (inputName: 'player1Name' | 'player2Name') => {
    setActiveInput(inputName);
    setIsKeyboardVisible(true);
  };
  
  const handleKeyboardInput = (key: string) => {
    if (activeInput === 'player1Name') {
      setPlayer1Name(prev => prev + key);
    } else if (activeInput === 'player2Name') {
      setPlayer2Name(prev => prev + key);
    }
  };

  const handleKeyboardBackspace = () => {
    if (activeInput === 'player1Name') {
      setPlayer1Name(prev => prev.slice(0, -1));
    } else if (activeInput === 'player2Name') {
      setPlayer2Name(prev => prev.slice(0, -1));
    }
  };

  const handleKeyboardEnter = () => {
    if (activeInput === 'player1Name') {
      player2Ref.current?.focus();
    } else if (activeInput === 'player2Name') {
      setIsKeyboardVisible(false);
      setActiveInput(null);
    }
  };

  const scoreOptions = ["301", "501", "801", "1001"];

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
           <div className="space-y-4 text-center">
              <h3 className="text-xl font-medium">Choose Game Mode</h3>
               <Tabs
                defaultValue="2p"
                onValueChange={(value) => setGameMode(value as Omit<GameConfig, 'player1Location'>['gameMode'])}
                className="w-full"
                value={gameMode}
              >
                <TabsList className="grid w-full grid-cols-3 h-28">
                  <TabsTrigger value="2p" className="h-full flex flex-col gap-2 text-lg">
                    <User className="w-10 h-10"/>
                    Local
                  </TabsTrigger>
                   <TabsTrigger value="remote" className="h-full flex flex-col gap-2 text-lg">
                    <Users className="w-10 h-10"/>
                    Remote
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="h-full flex flex-col gap-2 text-lg">
                    <Bot className="w-10 h-10" />
                    vs AI
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
        );
      case 2:
        if (gameMode === '2p') {
             return (
              <div className="space-y-6 text-left">
                <h3 className="text-xl font-medium text-center">Enter Player Names</h3>
                <div className="space-y-2">
                  <Label htmlFor="player1Name" className="text-lg">Player 1</Label>
                   <div className="relative">
                    <Input 
                      ref={player1Ref}
                      id="player1Name"
                      value={player1Name} 
                      onChange={() => {}}
                      onFocus={() => handleInputFocus('player1Name')}
                      inputMode="none" 
                      className="pr-10 h-14 text-2xl"
                    />
                    {player1Name && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                        onClick={() => setPlayer1Name('')}
                        aria-label="Clear player 1 name"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player2Name" className="text-lg">Player 2</Label>
                  <div className="relative">
                    <Input 
                      ref={player2Ref}
                      id="player2Name" 
                      value={player2Name} 
                      onChange={() => {}}
                      onFocus={() => handleInputFocus('player2Name')}
                      inputMode="none" 
                      className="pr-10 h-14 text-2xl"
                    />
                    {player2Name && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                        onClick={() => setPlayer2Name('')}
                        aria-label="Clear player 2 name"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
        }
        if (gameMode === 'ai') {
             return (
                <div className="space-y-4 text-center">
                    <h3 className="text-xl font-medium">Select AI Difficulty</h3>
                    <div className="space-y-3">
                        {AI_LEVELS.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setAiLevel(level.id)}
                                className={cn(
                                    "w-full text-left flex items-start gap-4 p-4 rounded-lg transition-colors border-2",
                                    aiLevel === level.id 
                                        ? "bg-primary text-primary-foreground border-primary" 
                                        : "hover:bg-accent"
                                )}
                            >
                                <Star className={cn("w-6 h-6 mt-1", aiLevel === level.id ? 'text-yellow-300' : 'text-muted-foreground')} />
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{level.name}</p>
                                    <p className={cn("text-base", aiLevel === level.id ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{level.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono">AVG</p>
                                    <p className="font-semibold text-lg">{level.avgRange}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
             );
        }
        if (gameMode === 'remote') {
            return (
                <div className="space-y-4 text-center">
                <h3 className="text-xl font-medium">Select Starting Score</h3>
                <Tabs
                    value={initialScore}
                    onValueChange={setInitialScore}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-28 sm:h-16 gap-2">
                    {scoreOptions.map((score) => (
                        <TabsTrigger key={score} value={score} className="h-full text-xl">
                        {score}
                        </TabsTrigger>
                    ))}
                    </TabsList>
                </Tabs>
                </div>
            );
        }
        return null;
      case 3:
        if (gameMode === '2p' || gameMode === 'ai') {
             return (
                <div className="space-y-4 text-center">
                <h3 className="text-xl font-medium">Select Starting Score</h3>
                <Tabs
                    value={initialScore}
                    onValueChange={setInitialScore}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-28 sm:h-16 gap-2">
                    {scoreOptions.map((score) => (
                        <TabsTrigger key={score} value={score} className="h-full text-xl">
                        {score}
                        </TabsTrigger>
                    ))}
                    </TabsList>
                </Tabs>
                </div>
            );
        }
        if (gameMode === 'remote') {
            return (
                 <div className="space-y-8 text-center pt-4">
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium">Best of</h3>
                        <p className="text-7xl font-bold text-primary">{legs}</p>
                    </div>
                    <Slider
                        defaultValue={[5]}
                        min={1}
                        max={31}
                        step={2}
                        onValueChange={(value) => setLegs(value[0])}
                        className="h-8"
                    />
                    </div>
            );
        }
        return null;
      case 4:
        if (gameMode === '2p' || gameMode === 'ai') {
          return (
            <div className="space-y-8 text-center pt-4">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Best of</h3>
                <p className="text-7xl font-bold text-primary">{legs}</p>
              </div>
              <Slider
                defaultValue={[5]}
                min={1}
                max={31}
                step={2}
                onValueChange={(value) => setLegs(value[0])}
                className="h-8"
              />
            </div>
          );
        }
        if (gameMode === 'remote') {
             return (
                 <div className="space-y-4 text-center">
                    <h3 className="text-xl font-medium">Challenge a Player</h3>
                    <ScrollArea className="h-64 w-full rounded-md border">
                        <div className="p-4 space-y-3">
                            {FAKE_PLAYERS.map((player) => (
                                <button
                                    key={player}
                                    onClick={() => setSelectedOpponent(player)}
                                    className={cn(
                                        "w-full text-left flex items-center gap-4 p-4 rounded-lg transition-colors border",
                                        selectedOpponent === player ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
                                    )}
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="text-xl">{player.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-lg font-medium">{player}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
              );
         }
         return null;
      default:
        return null;
    }
  }

  const getStepDescription = () => {
    let currentStepNum = step;
    let totalSteps = maxSteps;
    
    switch(step) {
      case 1:
        return `Step 1 of ${totalSteps}: Choose Game Mode`;
      case 2:
        if (gameMode === '2p') return `Step 2 of ${totalSteps}: Enter Player Names`;
        if (gameMode === 'ai') return `Step 2 of ${totalSteps}: Select AI Difficulty`;
        if (gameMode === 'remote') return `Step 2 of ${totalSteps}: Select Starting Score`;
        return '';
      case 3:
        if (gameMode === '2p' || gameMode === 'ai') return `Step 3 of ${totalSteps}: Select Starting Score`;
        if (gameMode === 'remote') return `Step 3 of ${totalSteps}: Set Number of Legs`;
        return ``;
      case 4:
         if (gameMode === '2p' || gameMode === 'ai') return `Step 4 of ${totalSteps}: Set Number of Legs`;
         if (gameMode === 'remote') return `Step 4 of ${totalSteps}: Challenge a Player`;
        return '';
      default:
        return '';
    }
  }

  const isStartGameDisabled = () => {
    if (step < maxSteps) return true;
    if (gameMode === 'remote') {
      return !selectedOpponent;
    }
    if (gameMode === '2p') {
      return !player1Name || !player2Name;
    }
    return false;
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-2xl shadow-2xl relative overflow-hidden">
        <div className={cn("transition-all duration-300 ease-in-out", isKeyboardVisible ? 'pb-[280px]' : 'pb-[96px]')}>
            <CardHeader className="p-8">
              <div className="flex justify-center mb-6">
                 <Trophy className="w-16 h-16 text-primary"/>
              </div>
              <CardTitle className="text-center text-4xl">Game Setup</CardTitle>
              <CardDescription className="text-center text-lg">
                {getStepDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[320px] px-8">
              {renderStepContent()}
            </CardContent>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/50 backdrop-blur-sm">
            {isKeyboardVisible && (
              <OnScreenKeyboard
                onKeyPress={handleKeyboardInput}
                onBackspace={handleKeyboardBackspace}
                onEnter={handleKeyboardEnter}
                onClose={() => setIsKeyboardVisible(false)}
              />
            )}
            <CardFooter className="flex justify-between p-6 border-t">
              <Button variant="outline" onClick={handleBack} className="h-14 px-8 text-lg">
                {step === 1 ? "Cancel" : "Back"}
              </Button>
              {step < maxSteps ? (
                <Button onClick={handleNext} className="h-14 px-8 text-lg">
                  Next
                </Button>
              ) : (
                <Button onClick={handleStartGame} disabled={isStartGameDisabled()} className="w-auto h-14 px-8 text-lg">
                  Start Game
                </Button>
              )}
            </CardFooter>
        </div>
      </Card>
    </div>
  );
}
