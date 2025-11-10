/**
 * StateManager - Tracks and manages game state changes
 */

import { Experience } from '../models/Experience';
import { Key } from '../models/Key';
import { Trigger } from '../models/Trigger';
import { Item } from '../models/Item';

export interface StateChange {
  id: string;
  timestamp: number;
  turn: number;
  type: string;
  data: any;
  description: string;
}

export interface GameAction {
  type: string;
  payload: any;
  timestamp: number;
}

export class StateManager {
  private experience: Experience | null = null;
  private stateHistory: StateChange[] = [];
  private actionHistory: GameAction[] = [];
  private maxHistorySize: number = 100;
  private listeners: Map<string, Set<Function>> = new Map();

  setExperience(experience: Experience): void {
    this.experience = experience;
    this.stateHistory = [];
    this.actionHistory = [];
  }

  getExperience(): Experience | null {
    return this.experience;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Record a state change
   */
  private recordStateChange(change: StateChange): void {
    this.stateHistory.push(change);

    // Trim history if it exceeds max size
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }

    this.emit('stateChange', change);
  }

  /**
   * Record a game action
   */
  private recordAction(action: GameAction): void {
    this.actionHistory.push(action);

    if (this.actionHistory.length > this.maxHistorySize) {
      this.actionHistory.shift();
    }
  }

  /**
   * Examine an item
   */
  examineItem(itemId: string): { success: boolean; description: string; triggers?: any[] } {
    if (!this.experience) {
      return { success: false, description: 'No experience loaded' };
    }

    const currentRoom = this.experience.getCurrentRoom();
    if (!currentRoom) {
      return { success: false, description: 'No current room' };
    }

    const item = currentRoom.findItem(itemId);
    if (!item) {
      return { success: false, description: 'Item not found' };
    }

    // Record examination
    this.experience.examineItem(itemId);

    // Check if item has an examination trigger
    const triggeredResults: any[] = [];
    if (item.examineTrigger) {
      const result = this.experience.activateTrigger(item.examineTrigger, itemId);
      if (result.success) {
        triggeredResults.push(result);
      }
    }

    const description = item.examine();

    this.recordStateChange({
      id: `examine_${itemId}_${Date.now()}`,
      timestamp: Date.now(),
      turn: this.experience.globalState.turnCount,
      type: 'EXAMINE_ITEM',
      data: { itemId, description },
      description: `Examined ${item.name}`
    });

    this.recordAction({
      type: 'EXAMINE',
      payload: { itemId },
      timestamp: Date.now()
    });

    this.experience.incrementTurn();
    this.emit('itemExamined', { itemId, description });

    return {
      success: true,
      description,
      triggers: triggeredResults.length > 0 ? triggeredResults : undefined
    };
  }

  /**
   * Open a container
   */
  openContainer(containerId: string): { success: boolean; message: string; items?: Item[] } {
    if (!this.experience) {
      return { success: false, message: 'No experience loaded' };
    }

    const currentRoom = this.experience.getCurrentRoom();
    if (!currentRoom) {
      return { success: false, message: 'No current room' };
    }

    const container = currentRoom.findItem(containerId);
    if (!container) {
      return { success: false, message: 'Container not found' };
    }

    if (container.isLocked) {
      return { success: false, message: `${container.name} is locked` };
    }

    const items = container.containedItems;

    this.recordStateChange({
      id: `open_${containerId}_${Date.now()}`,
      timestamp: Date.now(),
      turn: this.experience.globalState.turnCount,
      type: 'OPEN_CONTAINER',
      data: { containerId, itemCount: items.length },
      description: `Opened ${container.name}`
    });

    this.recordAction({
      type: 'OPEN',
      payload: { containerId },
      timestamp: Date.now()
    });

    this.experience.incrementTurn();
    this.emit('containerOpened', { containerId, items });

    return {
      success: true,
      message: items.length > 0 ? `Found ${items.length} item(s) inside` : 'The container is empty',
      items
    };
  }

  /**
   * Take an item from a container
   */
  takeItem(itemId: string, containerId?: string): { success: boolean; message: string; key?: Key } {
    if (!this.experience) {
      return { success: false, message: 'No experience loaded' };
    }

    const currentRoom = this.experience.getCurrentRoom();
    if (!currentRoom) {
      return { success: false, message: 'No current room' };
    }

    let item: Item | null = null;
    let sourceLocation = 'room';

    if (containerId) {
      const container = currentRoom.findItem(containerId);
      if (container) {
        item = container.removeItem(itemId, 'contained');
        sourceLocation = containerId;
      }
    } else {
      item = currentRoom.removeItem(itemId);
    }

    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    if (!item.isPortable) {
      // Put it back
      if (containerId) {
        const container = currentRoom.findItem(containerId);
        if (container) {
          container.addItem(item, 'contained');
        }
      } else {
        currentRoom.addItem(item);
      }
      return { success: false, message: `You can't take ${item.name}` };
    }

    // Check if item has an associated key
    let acquiredKey: Key | undefined;
    if (item.keyId) {
      const success = this.experience.acquireKey(item.keyId, sourceLocation);
      if (success) {
        acquiredKey = this.experience.getKey(item.keyId) || undefined;
      }
    }

    this.recordStateChange({
      id: `take_${itemId}_${Date.now()}`,
      timestamp: Date.now(),
      turn: this.experience.globalState.turnCount,
      type: 'TAKE_ITEM',
      data: { itemId, containerId, keyId: item.keyId },
      description: `Took ${item.name}`
    });

    this.recordAction({
      type: 'TAKE',
      payload: { itemId, containerId },
      timestamp: Date.now()
    });

    this.experience.incrementTurn();
    this.emit('itemTaken', { itemId, containerId, key: acquiredKey });

    return {
      success: true,
      message: `Took ${item.name}`,
      key: acquiredKey
    };
  }

  /**
   * Use a key on a trigger
   */
  useKey(keyId: string, triggerId: string): { success: boolean; message: string; rewards?: any[] } {
    if (!this.experience) {
      return { success: false, message: 'No experience loaded' };
    }

    const key = this.experience.getKey(keyId);
    if (!key) {
      return { success: false, message: 'Key not found' };
    }

    if (!key.isAcquired) {
      return { success: false, message: "You don't have that key" };
    }

    const trigger = this.experience.getTrigger(triggerId);
    if (!trigger) {
      return { success: false, message: 'Trigger not found' };
    }

    const result = this.experience.activateTrigger(triggerId, key);

    if (result.success) {
      if (key.isConsumed) {
        key.consume();
      }

      this.recordStateChange({
        id: `use_key_${keyId}_${triggerId}_${Date.now()}`,
        timestamp: Date.now(),
        turn: this.experience.globalState.turnCount,
        type: 'USE_KEY',
        data: { keyId, triggerId, rewards: result.rewards },
        description: `Used ${key.name} on ${trigger.name}`
      });

      this.recordAction({
        type: 'USE_KEY',
        payload: { keyId, triggerId },
        timestamp: Date.now()
      });

      this.experience.incrementTurn();
      this.emit('keyUsed', { keyId, triggerId, result });
    }

    return result;
  }

  /**
   * Enter a code on a keypad
   */
  enterCode(triggerId: string, code: string): { success: boolean; message: string; rewards?: any[] } {
    if (!this.experience) {
      return { success: false, message: 'No experience loaded' };
    }

    const result = this.experience.activateTrigger(triggerId, code);

    this.recordStateChange({
      id: `enter_code_${triggerId}_${Date.now()}`,
      timestamp: Date.now(),
      turn: this.experience.globalState.turnCount,
      type: 'ENTER_CODE',
      data: { triggerId, code, success: result.success },
      description: result.success ? `Entered correct code` : `Entered incorrect code`
    });

    this.recordAction({
      type: 'ENTER_CODE',
      payload: { triggerId, code },
      timestamp: Date.now()
    });

    this.experience.incrementTurn();
    this.emit('codeEntered', { triggerId, code, result });

    return result;
  }

  /**
   * Change rooms
   */
  changeRoom(roomId: string): { success: boolean; message: string } {
    if (!this.experience) {
      return { success: false, message: 'No experience loaded' };
    }

    const success = this.experience.changeRoom(roomId);

    if (success) {
      const room = this.experience.getRoom(roomId);

      this.recordStateChange({
        id: `change_room_${roomId}_${Date.now()}`,
        timestamp: Date.now(),
        turn: this.experience.globalState.turnCount,
        type: 'CHANGE_ROOM',
        data: { roomId },
        description: `Entered ${room?.name || roomId}`
      });

      this.recordAction({
        type: 'CHANGE_ROOM',
        payload: { roomId },
        timestamp: Date.now()
      });

      this.emit('roomChanged', { roomId, room });

      return { success: true, message: room?.longDescription || 'Entered new room' };
    }

    return { success: false, message: 'Cannot enter that room' };
  }

  /**
   * Get state history
   */
  getStateHistory(): StateChange[] {
    return [...this.stateHistory];
  }

  /**
   * Get action history
   */
  getActionHistory(): GameAction[] {
    return [...this.actionHistory];
  }

  /**
   * Get recent changes
   */
  getRecentChanges(count: number = 10): StateChange[] {
    return this.stateHistory.slice(-count);
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.stateHistory = [];
    this.actionHistory = [];
  }

  /**
   * Get game statistics
   */
  getStatistics(): any {
    if (!this.experience) {
      return null;
    }

    return {
      turnCount: this.experience.globalState.turnCount,
      hintsUsed: this.experience.globalState.hintsUsed,
      itemsExamined: this.experience.globalState.itemsExamined.length,
      triggersActivated: this.experience.globalState.triggersActivated.length,
      keysAcquired: this.experience.globalState.keysAcquired.length,
      playTime: this.experience.getPlayTime(),
      completionPercentage: this.calculateCompletionPercentage()
    };
  }

  /**
   * Calculate completion percentage
   */
  private calculateCompletionPercentage(): number {
    if (!this.experience) {
      return 0;
    }

    const totalTriggers = this.experience.triggers.size;
    const activatedTriggers = this.experience.globalState.triggersActivated.length;

    if (totalTriggers === 0) {
      return 0;
    }

    return Math.round((activatedTriggers / totalTriggers) * 100);
  }
}

// Singleton instance
export const stateManager = new StateManager();
