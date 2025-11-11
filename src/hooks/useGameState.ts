import { useState, useEffect, useCallback } from 'react';
import { experienceManager, stateManager } from '../services';
import { Experience } from '../models/Experience';
import trainingBasementData from '../../experiences/training_basement/experience.json';

// Simple game state hook
export function useGameState() {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load the experience
  useEffect(() => {
    async function loadGame() {
      try {
        console.log('Loading experience data:', trainingBasementData);
        const exp = await experienceManager.loadExperience(trainingBasementData);
        console.log('Experience loaded successfully:', exp);
        stateManager.setExperience(exp);
        exp.startGame();
        setExperience(exp);

        // Subscribe to state changes
        stateManager.subscribe('stateChange', (change) => {
          console.log('State change:', change);
          setMessage(change.description);
          setTimeout(() => setMessage(null), 3000);

          // Update inventory
          updateInventory();

          // Check win condition
          if (exp.checkCompletion()) {
            setGameWon(true);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('DETAILED ERROR loading experience:', error);
        console.error('Error name:', error?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        setLoading(false);
      }
    }

    loadGame();
  }, []);

  const updateInventory = useCallback(() => {
    const exp = stateManager.getExperience();
    if (!exp) {
      console.log('updateInventory: no experience');
      return;
    }

    const keys = Array.from(exp.keys.values()).filter(key => key.isAcquired);
    console.log('updateInventory: found keys:', keys);
    setInventory(keys);
  }, []);

  const examineItem = useCallback((itemId: string) => {
    return stateManager.examineItem(itemId);
  }, []);

  const openContainer = useCallback((containerId: string) => {
    return stateManager.openContainer(containerId);
  }, []);

  const takeItem = useCallback((itemId: string, containerId?: string) => {
    console.log('takeItem called:', itemId, containerId);
    const result = stateManager.takeItem(itemId, containerId);
    console.log('takeItem result:', result);
    if (result.success) {
      console.log('takeItem success, updating inventory');
      updateInventory();
    }
    return result;
  }, [updateInventory]);

  const useKey = useCallback((keyId: string, triggerId: string) => {
    return stateManager.useKey(keyId, triggerId);
  }, []);

  const enterCode = useCallback((triggerId: string, code: string) => {
    return stateManager.enterCode(triggerId, code);
  }, []);

  return {
    experience,
    loading,
    inventory,
    gameWon,
    message,
    examineItem,
    openContainer,
    takeItem,
    useKey,
    enterCode,
  };
}
