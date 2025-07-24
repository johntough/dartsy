
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import { cn } from "@/lib/utils";

interface DartboardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

const DartboardSegment = ({ d, value, label, onClick, className = '' }: { d: string; value: number; label: string; onClick: (val: number, lbl: string) => void; className?: string }) => (
  <path
    d={d}
    className={cn("cursor-pointer stroke-2 stroke-gray-300 dark:stroke-gray-600 transition-all duration-150", className)}
    onClick={() => onClick(value, label)}
  />
);

const DartboardCircle = ({ cx, cy, r, value, label, onClick, className = '' }: { cx: number, cy: number, r: number, value: number; label: string; onClick: (val: number, lbl: string) => void; className?: string }) => (
    <circle
        cx={cx}
        cy={cy}
        r={r}
        className={cn("cursor-pointer stroke-2 stroke-gray-300 dark:stroke-gray-600 transition-all duration-150", className)}
        onClick={() => onClick(value, label)}
    />
);


const Dartboard = ({ onSegmentClick }: { onSegmentClick: (value: number, label: string) => void }) => {
  const center = 250;
  const radius = 220; // Reduced radius to make space for numbers
  const numbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  const angleSlice = 360 / numbers.length;

  const getPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number): string => {
    const start = {
      x: center + outerRadius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: center + outerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    const end = {
      x: center + outerRadius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: center + outerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    const start2 = {
        x: center + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180),
        y: center + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    const end2 = {
        x: center + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180),
        y: center + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
    };

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, end.x, end.y,
      "L", start2.x, start2.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, end2.x, end2.y,
      "Z"
    ].join(" ");
  };

  const tripleWidth = radius * 0.12;
  const doubleWidth = radius * 0.12;
  const outerBullRadius = radius * 0.225;
  const innerBullRadius = radius * 0.105;

  const singleSectionWidth = (radius - doubleWidth - outerBullRadius - tripleWidth) / 2;
  
  const tripleRadius = outerBullRadius + singleSectionWidth;
  const doubleRadius = radius;
  
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full object-contain">
      <defs>
          <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
              </feMerge>
          </filter>
      </defs>

      {/* Segments */}
      {numbers.map((num, i) => {
        const startAngle = i * angleSlice - angleSlice / 2;
        const endAngle = i * angleSlice + angleSlice / 2;
        const isBlack = i % 2 === 0;

        const singleOuterPath = getPath(startAngle, endAngle, tripleRadius + tripleWidth, doubleRadius - doubleWidth);
        const singleInnerPath = getPath(startAngle, endAngle, outerBullRadius, tripleRadius);
        const doublePath = getPath(startAngle, endAngle, doubleRadius - doubleWidth, doubleRadius);
        const triplePath = getPath(startAngle, endAngle, tripleRadius, tripleRadius + tripleWidth);

        const fillSingle = isBlack ? 'fill-black hover:fill-gray-700' : 'fill-stone-200 hover:fill-stone-300';
        const fillDoubleTriple = isBlack ? 'fill-red-600 hover:fill-red-500' : 'fill-green-600 hover:fill-green-500';
        
        return (
          <g key={num}>
            <DartboardSegment d={doublePath} value={num * 2} label={`D${num}`} onClick={onSegmentClick} className={fillDoubleTriple} />
            <DartboardSegment d={singleOuterPath} value={num} label={`${num}`} onClick={onSegmentClick} className={fillSingle} />
            <DartboardSegment d={triplePath} value={num * 3} label={`T${num}`} onClick={onSegmentClick} className={fillDoubleTriple} />
            <DartboardSegment d={singleInnerPath} value={num} label={`${num}`} onClick={onSegmentClick} className={fillSingle} />
          </g>
        );
      })}

      {/* Bullseye */}
      <DartboardCircle cx={center} cy={center} r={outerBullRadius} value={25} label="25" onClick={onSegmentClick} className="fill-green-600 hover:fill-green-500" />
      <DartboardCircle cx={center} cy={center} r={innerBullRadius} value={50} label="Bull" onClick={onSegmentClick} className="fill-red-600 hover:fill-red-500" />
    
        {/* Wireframe overlay */}
        {numbers.map((num, i) => {
            const startAngle = i * angleSlice - angleSlice / 2;
            const endAngle = i * angleSlice + angleSlice / 2;
            return (
                <g key={`wire-${num}`} pointerEvents="none">
                    <path d={getPath(startAngle, endAngle, doubleRadius-doubleWidth, doubleRadius)} fill="none" />
                    <path d={getPath(startAngle, endAngle, tripleRadius, tripleRadius + tripleWidth)} fill="none" />
                </g>
            )
        })}
        <circle cx={center} cy={center} r={outerBullRadius} fill="none" />
        <circle cx={center} cy={center} r={innerBullRadius} fill="none" />

      {/* Numbers */}
      {numbers.map((num, i) => {
        const angle = i * angleSlice;
        const textRadius = radius + 20;
        const x = center + textRadius * Math.cos((angle - 90) * Math.PI / 180);
        const y = center + textRadius * Math.sin((angle - 90) * Math.PI / 180);
        
        return (
            <text
                key={`num-${num}`}
                x={x}
                y={y}
                dy="0.35em"
                textAnchor="middle"
                className="text-2xl font-bold fill-gray-700 dark:fill-gray-300"
                pointerEvents="none"
            >
                {num}
            </text>
        )
      })}
    </svg>
  );
};


export default function DartboardDialog({ isOpen, onClose, onSubmit }: DartboardDialogProps) {
  const [darts, setDarts] = useState<{value: number, label: string}[]>([]);
  const totalScore = darts.reduce((sum, dart) => sum + dart.value, 0);

  const handleSegmentClick = (value: number, label: string) => {
    if (darts.length < 3) {
      setDarts([...darts, { value, label }]);
    }
  };

  const handleUndo = () => {
    setDarts(darts.slice(0, -1));
  };
  
  const handleConfirm = () => {
    onSubmit(totalScore);
    setDarts([]);
  };

  const handleClose = () => {
      setDarts([]);
      onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl w-full h-[90svh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Enter Score Visually</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow flex items-center justify-center min-h-0 p-4">
            <Dartboard onSegmentClick={handleSegmentClick} />
        </div>

        <div className="mt-4 p-4 rounded-lg bg-muted text-center">
            <div className="flex justify-center items-center gap-4 mb-2">
                <p className="text-xl text-muted-foreground">Throws:</p>
                <div className="flex gap-2 min-h-[3rem] items-center">
                    {darts.map((dart, i) => (
                        <div key={i} className="px-3 py-1 rounded bg-background font-mono text-lg font-semibold shadow-sm">{dart.label}</div>
                    ))}
                </div>
            </div>
            <p className="text-xl text-muted-foreground">
                Total Score: <span className="font-bold text-4xl text-primary">{totalScore}</span>
            </p>
        </div>

        <DialogFooter className="gap-2 sm:justify-between pt-4">
          <Button variant="outline" onClick={handleUndo} disabled={darts.length === 0} className="w-full sm:w-auto h-14 text-lg">
            <Undo className="mr-2 h-4 w-4"/>
            Undo Last
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <DialogClose asChild>
                <Button variant="ghost" onClick={handleClose} className="w-full sm:w-auto h-14 text-lg">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirm} disabled={darts.length === 0} className="w-full sm:w-auto h-14 text-lg">
              Confirm Score
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
