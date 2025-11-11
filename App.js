import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import DynamicGameScreen from './src/screens/DynamicGameScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' or 'game'
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);

  const handleSelectExperience = (experienceId) => {
    setSelectedExperienceId(experienceId);
    setCurrentScreen('game');
  };

  const handleExitToHome = () => {
    setSelectedExperienceId(null);
    setCurrentScreen('home');
  };

  if (currentScreen === 'home') {
    return <HomeScreen onSelectExperience={handleSelectExperience} />;
  }

  if (currentScreen === 'game' && selectedExperienceId) {
    return <DynamicGameScreen experienceId={selectedExperienceId} onExit={handleExitToHome} />;
  }

  // Fallback
  return <HomeScreen onSelectExperience={handleSelectExperience} />;
}
