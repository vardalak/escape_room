import React from 'react';
import { GameStateProvider, useGameState, GAME_STATES } from './src/context/GameStateContext';

// Import screen components
import MainMenu from './src/components/screens/MainMenu';

/**
 * GameRouter - Routes to the correct screen based on game state
 */
function GameRouter() {
  const { gameState } = useGameState();

  switch (gameState) {
    case GAME_STATES.MAIN_MENU:
      return <MainMenu />;
    default:
      return <MainMenu />;
  }
}

/**
 * App - Root component with context providers
 */
export default function App() {
  return (
    <GameStateProvider>
      <GameRouter />
    </GameStateProvider>
  );
}
