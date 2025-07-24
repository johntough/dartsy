
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart3, HelpCircle, LogIn, LogOut, RotateCcw, User } from "lucide-react";
import type { PlayerProfile } from "@/hooks/use-game";
import {useEffect} from "react";

interface HeaderProps {
  onNewGame?: () => void;
  showAverage: boolean;
  onToggleAverage: () => void;
  isGameInProgress: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  profile: PlayerProfile;
  setProfile: (profile: PlayerProfile) => void;
  onLogin: () => void;
  onLogout: () => void;
  onToggleProfile: () => void;
  onToggleLifetimeStats: () => void;
  onToggleHowToPlay: () => void;
}

export default function Header({ 
  onNewGame, 
  showAverage, 
  onToggleAverage, 
  isGameInProgress, 
  isLoggedIn,
  setIsLoggedIn,
  profile,
  setProfile,
  onLogin, 
  onLogout,
  onToggleProfile,
  onToggleLifetimeStats,
  onToggleHowToPlay,
}: HeaderProps) {

  useEffect(() => {
    fetch("http://localhost:8081/auth/status", {
      method: 'GET',
      credentials: 'include'
    })
        .then(response => {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          }

          if (!response.ok) {
            throw new Error("Something went wrong.");
          }

          return response.json();
        }).then(json => {
          setIsLoggedIn(true);
          const userProfile: PlayerProfile = {
            id: json.id,
            name: json.name,
            email: json.email,
            idpSubject: json.idpSubject,
            location: json.location
          };
          setProfile(userProfile);
    })
        .catch(() => {
          setIsLoggedIn(false);
          // TODO: does profile need resetting?
        });
  }, []);

  return (
    <header className="flex w-full items-center justify-between bg-card p-4 text-card-foreground shadow-md border-b">
      <div className="flex items-center gap-4">
        {isGameInProgress && onNewGame && (
            <Button variant="outline" size="icon" onClick={onNewGame} aria-label="Reset Game" disabled={!isLoggedIn} className="h-12 w-12">
                <RotateCcw className="h-6 w-6" />
            </Button>
        )}
        <h1 className="text-xl font-bold">{isLoggedIn ? `Welcome` : 'Dart Duel'}</h1>
        {isLoggedIn && (
           <Button variant="ghost" onClick={onToggleProfile} className="h-auto p-2">
             <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">{profile.name}</span>
                  <User className="h-6 w-6 text-muted-foreground" />
              </div>
           </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isGameInProgress && (
          <div className="flex items-center space-x-2">
              <Switch id="average-toggle" checked={showAverage} onCheckedChange={onToggleAverage} />
              <Label htmlFor="average-toggle">Show Avg</Label>
          </div>
        )}
        <Button variant="outline" onClick={onToggleHowToPlay} className="h-14 px-6 text-lg">
          <HelpCircle className="mr-2 h-5 w-5" />
          How to Play
        </Button>
         {isLoggedIn && (
           <Button variant="outline" onClick={onToggleLifetimeStats} className="h-14 px-6 text-lg">
            <BarChart3 className="mr-2 h-5 w-5" />
            Lifetime Stats
          </Button>
        )}
        {isLoggedIn ? (
           <Button variant="outline" onClick={onLogout} className="h-14 px-6 text-lg">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        ) : (
          <Button variant="outline" onClick={onLogin} className="h-14 px-6 text-lg">
            <LogIn className="mr-2 h-5 w-5" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
