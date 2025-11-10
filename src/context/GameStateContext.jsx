import React, { createContext, useContext, useState } from 'react';

// Define your game states here
export const GAME_STATES = {
  MAIN_MENU: 'MAIN_MENU',
  // Add more game states as needed
};

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(GAME_STATES.MAIN_MENU);

  const value = {
    gameState,
    setGameState,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
