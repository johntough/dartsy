
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import type { PlayerProfile } from "@/hooks/use-game";
import { PRIORITY_COUNTRIES, OTHER_COUNTRIES } from "@/lib/countries";
import { ArrowLeft, X } from "lucide-react";
import OnScreenKeyboard from './on-screen-keyboard';
import { cn } from '@/lib/utils';

interface ProfilePageProps {
    profile: PlayerProfile;
    setProfile: (profile: PlayerProfile) => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function ProfilePage({ profile, setProfile, onSave, onCancel }: ProfilePageProps) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsKeyboardVisible(false);
    onSave();
  };

  const handleNameFocus = () => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardInput = (key: string) => {
    setProfile({ ...profile, name: profile.name + key });
  };

  const handleKeyboardBackspace = () => {
    setProfile({ ...profile, name: profile.name.slice(0, -1) });
  };
  
  const handleKeyboardDone = () => {
    setIsKeyboardVisible(false);
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-2xl shadow-2xl relative overflow-hidden">
        <div className={cn("transition-all duration-300 ease-in-out", isKeyboardVisible ? 'pb-[280px]' : 'pb-0')}>
          <CardHeader>
              <div className='flex justify-between items-center'>
                  <CardTitle className="text-4xl">Your Profile</CardTitle>
                  <Button onClick={onCancel} variant="outline" size="icon" className='h-12 w-12'>
                      <ArrowLeft className="h-6 w-6" />
                      <span className="sr-only">Back</span>
                  </Button>
              </div>
            <CardDescription>
              Update your name and location. Your country flag will be shown during matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Player Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    ref={nameInputRef}
                    value={profile.name}
                    onFocus={handleNameFocus}
                    onChange={() => {}} // Prevent direct typing
                    inputMode="none"
                    className="h-14 text-2xl pr-10"
                  />
                  {profile.name && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => setProfile({ ...profile, name: '' })}
                      aria-label="Clear player name"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-lg">Location</Label>
                <Select
                  value={profile.location}
                  onValueChange={(value) => setProfile({ ...profile, location: value })}
                >
                  <SelectTrigger id="location" className="h-14 text-2xl">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="h-12 text-lg">None</SelectItem>
                    {PRIORITY_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="h-12 text-lg">
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    {OTHER_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="h-12 text-lg">
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-14 text-lg">Save Profile</Button>
            </form>
          </CardContent>
        </div>
        
        <div className={cn(
          "absolute bottom-0 left-0 right-0 z-10 bg-background/50 backdrop-blur-sm transition-transform duration-300 ease-in-out",
          isKeyboardVisible ? 'translate-y-0' : 'translate-y-full'
        )}>
          {isKeyboardVisible && (
            <OnScreenKeyboard
              onKeyPress={handleKeyboardInput}
              onBackspace={handleKeyboardBackspace}
              onEnter={handleKeyboardDone}
              onDone={handleKeyboardDone}
              onClose={() => setIsKeyboardVisible(false)}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
