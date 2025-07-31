
"use client";

import { useState } from "react";
import GameBoard from "@/components/game-board";
import Header from "@/components/header";
import { GameSetupWizard } from "@/components/game-setup-wizard";
import { useGame } from "@/hooks/use-game";
import CheckoutDartsDialog from "@/components/checkout-darts-dialog";
import WinnerDialog from "@/components/winner-dialog";
import { Button } from "@/components/ui/button";
import { LogIn, Target } from "lucide-react";
import DartboardDialog from "@/components/dartboard-dialog";
import MatchStats from "@/components/match-stats";
import type { GameConfig } from "@/hooks/use-game";
import MatchWinnerDialog from "@/components/match-winner-dialog";
import ProfilePage from "@/components/profile-page";
import LifetimeStatsPage from "@/components/lifetime-stats-page";
import HowToPlay from "@/components/how-to-play";
import MatchRequestNotificationDialog from "@/components/match-request-notification-dialog";

export default function Home() {
  const [isSettingUp, setIsSettingUp] = useState(false);

  const {
    scores,
    matchAverages,
    legAverages,
    currentPlayer,
    inputValue,
    winner,
    matchWinner,
    gameMode,
    isAiThinking,
    player1Name,
    player2Name,
    legHistory,
    gameConfig,
    isGameStarted,
    isCheckoutPending,
    checkoutScore,
    isLegWon,
    legStarter,
    showAverage,
    checkoutSuggestions,
    isSuggestionsLoading,
    isDartboardOpen,
    isLoggedIn,
    setIsLoggedIn,
    profile,
    setProfile,
    handleSaveProfile,
    stats,
    isStatsVisible,
    toggleStatsScreen,
    isMatchWinnerDialogOpen,
    isProfilePageVisible,
    toggleProfilePage,
    isHowToPlayVisible,
    toggleHowToPlay,
    handleLogin,
    handleLogout,
    handleSetupComplete,
    handleNumberPress,
    handleDelete,
    handleSubmit,
    startNewMatch,
    handleQuickScore,
    handleCheckout,
    handleCheckoutDartsSelected,
    cancelCheckout,
    acknowledgeLegWin,
    acknowledgeMatchWin,
    toggleShowAverage,
    openDartboard,
    closeDartboard,
    handleDartboardSubmit,
    isLifetimeStatsVisible,
    lifetimeStats,
    toggleLifetimeStats,
    matchRequestInitiatorUserName,
    isMatchRequestNotificationOpen,
    handleMatchRequestNotificationAccept,
    handleMatchRequestNotificationCancel,
  } = useGame();

  const handleStartSetup = () => {
    setIsSettingUp(true);
  };

  const handleCancelSetup = () => {
    setIsSettingUp(false);
  }

  const handleGameSetupComplete = (config: Omit<GameConfig, 'legsWon' | 'player1Location'>) => {
    handleSetupComplete(config);
    setIsSettingUp(false);
  };

  const handleNewMatch = () => {
    startNewMatch();
    setIsSettingUp(false);
  }
  
  const handleProfileSave = () => {
    handleSaveProfile(profile);
    toggleProfilePage();
  };

  if (isHowToPlayVisible) {
    return <HowToPlay onBack={toggleHowToPlay} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center bg-secondary">
        <Header 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          profile={profile}
          setProfile={setProfile}
          onLogin={handleLogin}
          onLogout={handleLogout}
          showAverage={false} 
          onToggleAverage={() => {}} 
          isGameInProgress={false} 
          onToggleProfile={toggleProfilePage}
          onToggleLifetimeStats={toggleLifetimeStats}
          onToggleHowToPlay={toggleHowToPlay}
        />
        <main className="flex flex-grow flex-col items-center justify-center text-center p-4">
          <div className="space-y-4">
              <Target className="h-24 w-24 mx-auto text-primary" />
            <h1 className="text-4xl font-bold">Welcome to Dart Duel</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Please log in to start playing.
            </p>
            <Button size="lg" onClick={handleLogin} className="h-14 px-8 text-lg">
              <LogIn className="mr-2 h-5 w-5"/>
              Login
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  if (isProfilePageVisible) {
    return (
      <ProfilePage 
        profile={profile}
        setProfile={setProfile}
        onSave={handleProfileSave}
        onCancel={toggleProfilePage}
      />
    );
  }
  
  if (isLifetimeStatsVisible) {
    return (
      <LifetimeStatsPage
        stats={lifetimeStats}
        onBack={toggleLifetimeStats}
      />
    );
  }

  if (isGameStarted && gameConfig) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center bg-secondary">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          profile={profile}
          setProfile={setProfile}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onNewGame={handleNewMatch}
          showAverage={showAverage}
          onToggleAverage={toggleShowAverage}
          isGameInProgress={true}
          onToggleProfile={toggleProfilePage}
          onToggleLifetimeStats={toggleLifetimeStats}
          onToggleHowToPlay={toggleHowToPlay}
        />
        <main className="flex flex-grow flex-col items-center py-8 w-full">
          {isStatsVisible ? (
            <MatchStats 
              stats={stats}
              player1Name={player1Name}
              player2Name={player2Name}
              player1Location={gameConfig.player1Location}
              gameMode={gameMode}
              matchAverages={matchAverages}
              legsWon={gameConfig.legsWon}
              onBack={matchWinner ? handleNewMatch : toggleStatsScreen}
              matchWinner={matchWinner}
            />
          ) : (
            <GameBoard
              scores={scores}
              matchAverages={matchAverages}
              legAverages={legAverages}
              currentPlayer={currentPlayer}
              inputValue={inputValue}
              winner={winner}
              matchWinner={matchWinner}
              gameMode={gameMode}
              isAiThinking={isAiThinking}
              player1Name={player1Name}
              player2Name={player2Name}
              player1Location={gameConfig.player1Location}
              history={legHistory}
              legs={gameConfig.legs}
              legsWon={gameConfig.legsWon}
              legStarter={legStarter}
              showAverage={showAverage}
              checkoutSuggestions={checkoutSuggestions}
              isSuggestionsLoading={isSuggestionsLoading}
              handleNumberPress={handleNumberPress}
              handleDelete={handleDelete}
              handleSubmit={handleSubmit}
              handleQuickScore={handleQuickScore}
              handleCheckout={handleCheckout}
              openDartboard={openDartboard}
              toggleStatsScreen={toggleStatsScreen}
            />
          )}
        </main>
        <CheckoutDartsDialog
          isOpen={isCheckoutPending}
          score={checkoutScore}
          onDartsSelected={handleCheckoutDartsSelected}
          onCancel={cancelCheckout}
        />
        <WinnerDialog
          isOpen={isLegWon}
          winnerName={winner === "player1" ? player1Name : player2Name}
          onClose={acknowledgeLegWin}
        />
        <MatchWinnerDialog
          isOpen={isMatchWinnerDialogOpen}
          winnerName={matchWinner === "player1" ? player1Name : player2Name}
          onViewStats={acknowledgeMatchWin}
        />
        <DartboardDialog 
          isOpen={isDartboardOpen}
          onClose={closeDartboard}
          onSubmit={handleDartboardSubmit}
        />
      </div>
    );
  }

  if (isSettingUp) {
    return <GameSetupWizard 
      onSetupComplete={handleGameSetupComplete} 
      onCancel={handleCancelSetup} 
      playerProfile={profile} 
    />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-secondary">
      <Header 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        profile={profile}
        setProfile={setProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNewGame={handleStartSetup} 
        showAverage={showAverage} 
        onToggleAverage={toggleShowAverage} 
        isGameInProgress={false} 
        onToggleProfile={toggleProfilePage}
        onToggleLifetimeStats={toggleLifetimeStats}
        onToggleHowToPlay={toggleHowToPlay}
      />
      <main className="flex flex-grow flex-col items-center justify-center text-center p-4">
        <div className="space-y-4">
            <Target className="h-24 w-24 mx-auto text-primary" />
          <h1 className="text-4xl font-bold">Welcome to Dart Duel</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            The ultimate darts scoring app. Start a new game to challenge a friend or test your skills against our AI opponent.
          </p>
          <Button size="lg" onClick={handleStartSetup} disabled={!isLoggedIn} className="h-14 px-8 text-lg">
            Start New Game
          </Button>
        </div>
      </main>
      <MatchRequestNotificationDialog
          isOpen={isMatchRequestNotificationOpen}
          matchRequestInitiatorUserName={matchRequestInitiatorUserName}
          onAccept={handleMatchRequestNotificationAccept}
          onCancel={handleMatchRequestNotificationCancel}
      />
    </div>
  );
}
