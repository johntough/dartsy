
"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Delete, CornerDownLeft, ArrowUp, X, Check } from 'lucide-react';

interface OnScreenKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter?: () => void;
  onDone?: () => void;
  onClose: () => void;
  className?: string;
}

const keyRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default function OnScreenKeyboard({ onKeyPress, onBackspace, onEnter, onDone, onClose, className }: OnScreenKeyboardProps) {
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);

  const handleKeyPress = (key: string) => {
    const char = isShift || isCaps ? key.toUpperCase() : key;
    onKeyPress(char);
    if (isShift && !isCaps) {
      setIsShift(false);
    }
  };

  const handleShift = () => {
    setIsShift(!isShift);
  };

  const handleCapsLock = () => {
    const newCapsState = !isCaps;
    setIsCaps(newCapsState);
    setIsShift(newCapsState);
  }

  return (
    <div className={cn("bg-muted/80 backdrop-blur-sm p-2 rounded-t-lg shadow-lg space-y-2 w-full", className)}>
      <div className="flex justify-end pr-2">
         <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X />
            <span className="sr-only">Close Keyboard</span>
        </Button>
      </div>
      {keyRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {rowIndex === 1 && <div className="w-6" />}
          {rowIndex === 2 && (
             <Button variant="secondary" size="icon" onClick={handleShift} className={cn("h-12 w-14 text-lg", (isShift || isCaps) && 'bg-primary/50')}>
                <ArrowUp />
            </Button>
          )}
          {row.map(key => (
            <Button key={key} variant="secondary" onClick={() => handleKeyPress(key)} className="h-12 w-12 text-xl flex-1">
              {isShift || isCaps ? key.toUpperCase() : key}
            </Button>
          ))}
           {rowIndex === 2 && (
             <Button variant="secondary" size="icon" onClick={onBackspace} className="h-12 w-14">
                <Delete className="h-6 w-6" />
            </Button>
          )}
        </div>
      ))}
      <div className="flex justify-center gap-2">
        <Button variant="secondary" onClick={handleCapsLock} className={cn("h-12 w-28 text-lg", isCaps && 'bg-primary text-primary-foreground')}>
          Caps
        </Button>
        <Button variant="secondary" onClick={() => handleKeyPress(' ')} className="h-12 flex-grow text-lg">
          Space
        </Button>
        {onEnter && (
            <Button variant="secondary" onClick={onEnter} className="h-12 w-28 text-lg">
                <CornerDownLeft className="mr-2" />
                Enter
            </Button>
        )}
        {onDone && (
            <Button variant="primary" onClick={onDone} className="h-12 w-28 text-lg">
                <Check className="mr-2" />
                Done
            </Button>
        )}
      </div>
    </div>
  );
}
