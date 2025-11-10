/**
 * ExperienceManager - Service for loading and managing experiences
 */

import { Experience } from '../models/Experience';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExperienceSaveData {
  experienceId: string;
  saveDate: number;
  globalState: any;
  roomStates: any[];
  triggerStates: any[];
  keyStates: any[];
}

export class ExperienceManager {
  private experience: Experience | null = null;
  private saveKey: string = '@escape_room_save';

  /**
   * Load an experience from JSON data
   */
  async loadExperience(jsonData: any): Promise<Experience> {
    try {
      this.experience = Experience.fromJSON(jsonData);
      return this.experience;
    } catch (error) {
      throw new Error(`Failed to load experience: ${error}`);
    }
  }

  /**
   * Load an experience from a JSON file path (for React Native Asset)
   */
  async loadExperienceFromFile(filePath: string): Promise<Experience> {
    try {
      // In React Native, you'd typically import the JSON directly
      // or fetch it from a URL/asset
      const jsonData = require(filePath);
      return this.loadExperience(jsonData);
    } catch (error) {
      throw new Error(`Failed to load experience from file: ${error}`);
    }
  }

  /**
   * Get the currently loaded experience
   */
  getCurrentExperience(): Experience | null {
    return this.experience;
  }

  /**
   * Save the current experience state to AsyncStorage
   */
  async saveProgress(): Promise<boolean> {
    if (!this.experience) {
      throw new Error('No experience loaded to save');
    }

    try {
      const saveData: ExperienceSaveData = {
        experienceId: this.experience.id,
        saveDate: Date.now(),
        globalState: this.experience.globalState,
        roomStates: Array.from(this.experience.rooms.values()).map(room => room.toJSON()),
        triggerStates: Array.from(this.experience.triggers.values()).map(trigger => trigger.toJSON()),
        keyStates: Array.from(this.experience.keys.values()).map(key => key.toJSON())
      };

      const jsonString = JSON.stringify(saveData);
      await AsyncStorage.setItem(
        `${this.saveKey}_${this.experience.id}`,
        jsonString
      );

      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }

  /**
   * Load saved progress from AsyncStorage
   */
  async loadProgress(experienceId: string): Promise<boolean> {
    try {
      const jsonString = await AsyncStorage.getItem(`${this.saveKey}_${experienceId}`);

      if (!jsonString) {
        return false; // No save found
      }

      const saveData: ExperienceSaveData = JSON.parse(jsonString);

      if (!this.experience || this.experience.id !== experienceId) {
        throw new Error('Experience must be loaded before restoring progress');
      }

      // Restore global state
      this.experience.globalState = saveData.globalState;

      // Restore room states
      saveData.roomStates.forEach((roomState: any) => {
        const room = this.experience!.getRoom(roomState.id);
        if (room) {
          room.isVisited = roomState.isVisited;
          room.isLocked = roomState.isLocked;
          room.turnEntered = roomState.turnEntered;
          // Restore item states
          this.restoreItemStates(room, roomState.items);
        }
      });

      // Restore trigger states
      saveData.triggerStates.forEach((triggerState: any) => {
        const trigger = this.experience!.getTrigger(triggerState.id);
        if (trigger) {
          trigger.isActivated = triggerState.isActivated;
          trigger.isVisible = triggerState.isVisible;
        }
      });

      // Restore key states
      saveData.keyStates.forEach((keyState: any) => {
        const key = this.experience!.getKey(keyState.id);
        if (key) {
          key.isAcquired = keyState.isAcquired;
          key.isHidden = keyState.isHidden;
          key.acquiredFrom = keyState.acquiredFrom;
          key.acquiredTurn = keyState.acquiredTurn;
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return false;
    }
  }

  /**
   * Restore item states recursively
   */
  private restoreItemStates(room: any, itemStates: any[]): void {
    itemStates.forEach((itemState: any) => {
      const item = room.findItem(itemState.id);
      if (item) {
        item.isVisible = itemState.isVisible;
        item.isLocked = itemState.isLocked;

        // Restore nested items
        if (itemState.containedItems) {
          this.restoreNestedItems(item, itemState.containedItems);
        }
        if (itemState.surfaceItems) {
          this.restoreNestedItems(item, itemState.surfaceItems, 'surface');
        }
      }
    });
  }

  private restoreNestedItems(parentItem: any, itemStates: any[], location: 'contained' | 'surface' = 'contained'): void {
    itemStates.forEach((itemState: any) => {
      const items = location === 'contained' ? parentItem.containedItems : parentItem.surfaceItems;
      const item = items.find((i: any) => i.id === itemState.id);
      if (item) {
        item.isVisible = itemState.isVisible;
        item.isLocked = itemState.isLocked;

        // Recursively restore nested items
        if (itemState.containedItems) {
          this.restoreNestedItems(item, itemState.containedItems);
        }
        if (itemState.surfaceItems) {
          this.restoreNestedItems(item, itemState.surfaceItems, 'surface');
        }
      }
    });
  }

  /**
   * Delete saved progress
   */
  async deleteSave(experienceId: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(`${this.saveKey}_${experienceId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  /**
   * Check if a save exists for an experience
   */
  async hasSave(experienceId: string): Promise<boolean> {
    try {
      const jsonString = await AsyncStorage.getItem(`${this.saveKey}_${experienceId}`);
      return jsonString !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all saved experiences
   */
  async getAllSaves(): Promise<ExperienceSaveData[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const saveKeys = keys.filter(key => key.startsWith(this.saveKey));

      const saves: ExperienceSaveData[] = [];
      for (const key of saveKeys) {
        const jsonString = await AsyncStorage.getItem(key);
        if (jsonString) {
          saves.push(JSON.parse(jsonString));
        }
      }

      return saves;
    } catch (error) {
      console.error('Failed to get all saves:', error);
      return [];
    }
  }

  /**
   * Export experience state as JSON string
   */
  exportState(): string {
    if (!this.experience) {
      throw new Error('No experience loaded to export');
    }
    return JSON.stringify(this.experience.toJSON(), null, 2);
  }

  /**
   * Import experience state from JSON string
   */
  async importState(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      this.experience = Experience.fromJSON(data);
      return true;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }

  /**
   * Reset experience to initial state
   */
  resetExperience(): void {
    if (!this.experience) {
      throw new Error('No experience loaded to reset');
    }

    // Reset global state
    this.experience.globalState = {
      turnCount: 0,
      hintsUsed: 0,
      itemsExamined: [],
      triggersActivated: [],
      keysAcquired: [],
      currentRoomId: this.experience.startingRoomId,
      gameStartTime: null,
      gameEndTime: null,
      isCompleted: false
    };

    // Reset all triggers
    this.experience.triggers.forEach(trigger => {
      trigger.reset();
    });

    // Reset all keys
    this.experience.keys.forEach(key => {
      key.isAcquired = false;
      key.acquiredFrom = undefined;
      key.acquiredTurn = undefined;
    });

    // Reset all rooms
    this.experience.rooms.forEach(room => {
      room.isVisited = false;
      room.turnEntered = undefined;
    });
  }
}

// Singleton instance
export const experienceManager = new ExperienceManager();
