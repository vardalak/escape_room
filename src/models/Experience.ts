/**
 * Experience System - Top-level game container
 */

import { Room, DifficultyLevel } from './Room';
import { Key, KeyFactory } from './Key';
import { Trigger, TriggerFactory } from './Trigger';

export interface CompletionCriteria {
  type: string;
  triggerId?: string;
  roomId?: string;
  description: string;
}

export interface GlobalState {
  turnCount: number;
  hintsUsed: number;
  itemsExamined: string[];
  triggersActivated: string[];
  keysAcquired: string[];
  currentRoomId: string;
  gameStartTime: number | null;
  gameEndTime: number | null;
  isCompleted: boolean;
}

export interface ExperienceConfig {
  id: string;
  name: string;
  theme: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  storyIntro: string;
  storyOutro: string;
  startingRoomId: string;
  finalRoomId: string;
  rooms: any[];
  triggers: any[];
  keys: any[];
  completionCriteria: CompletionCriteria[];
  globalState: GlobalState;
}

export class Experience {
  id: string;
  name: string;
  theme: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  storyIntro: string;
  storyOutro: string;

  startingRoomId: string;
  finalRoomId: string;

  rooms: Map<string, Room>;
  triggers: Map<string, Trigger>;
  keys: Map<string, Key>;

  completionCriteria: CompletionCriteria[];
  globalState: GlobalState;

  constructor(config: ExperienceConfig) {
    this.id = config.id;
    this.name = config.name;
    this.theme = config.theme;
    this.difficulty = config.difficulty;
    this.estimatedDuration = config.estimatedDuration;
    this.storyIntro = config.storyIntro;
    this.storyOutro = config.storyOutro;
    this.startingRoomId = config.startingRoomId;
    this.finalRoomId = config.finalRoomId;
    this.completionCriteria = config.completionCriteria;
    this.globalState = config.globalState;

    // Initialize collections
    this.rooms = new Map();
    this.triggers = new Map();
    this.keys = new Map();

    // Load rooms
    if (config.rooms) {
      config.rooms.forEach(roomConfig => {
        const room = Room.fromJSON(roomConfig);
        this.rooms.set(room.id, room);
      });
    }

    // Load triggers
    if (config.triggers) {
      config.triggers.forEach(triggerConfig => {
        const trigger = TriggerFactory.createFromJSON(triggerConfig);
        this.triggers.set(trigger.id, trigger);
      });
    }

    // Load keys
    if (config.keys) {
      config.keys.forEach(keyConfig => {
        const key = KeyFactory.createFromJSON(keyConfig);
        this.keys.set(key.id, key);
      });
    }
  }

  // Room Management
  getCurrentRoom(): Room | null {
    return this.rooms.get(this.globalState.currentRoomId) || null;
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  changeRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (room && !room.isLocked) {
      this.globalState.currentRoomId = roomId;
      room.enter(this.globalState.turnCount);
      return true;
    }
    return false;
  }

  // Trigger Management
  getTrigger(triggerId: string): Trigger | null {
    return this.triggers.get(triggerId) || null;
  }

  activateTrigger(triggerId: string, input?: any): { success: boolean; rewards: any[]; message?: string } {
    const trigger = this.triggers.get(triggerId);
    if (!trigger) {
      return { success: false, rewards: [], message: "Trigger not found" };
    }

    if (trigger.isActivated) {
      return { success: false, rewards: [], message: "Already activated" };
    }

    const conditionMet = trigger.checkCondition(input);
    if (conditionMet) {
      const rewards = trigger.activate();
      this.globalState.triggersActivated.push(triggerId);

      // Process rewards
      this.processRewards(rewards);

      return {
        success: true,
        rewards,
        message: trigger.successMessage || "Success!"
      };
    }

    return {
      success: false,
      rewards: [],
      message: trigger.failureMessage || "Condition not met"
    };
  }

  private processRewards(rewards: any[]): void {
    for (const reward of rewards) {
      switch (reward.type) {
        case 'AccessReward':
          if (reward.unlocksDoor) {
            this.unlockDoor(reward.unlocksDoor);
          }
          if (reward.revealsRoom) {
            this.revealRoom(reward.revealsRoom);
          }
          if (reward.activatesTriggers) {
            reward.activatesTriggers.forEach((tid: string) => {
              const trigger = this.triggers.get(tid);
              if (trigger) trigger.isVisible = true;
            });
          }
          break;

        case 'KeyReward':
          // Acquire the key/clue
          if (reward.keyId) {
            this.acquireKey(reward.keyId, 'examination_trigger');
          }
          break;

        case 'ItemReward':
          // Reveal hidden items
          if (reward.itemId) {
            this.revealItem(reward.itemId);
          }
          // Hide items (for cleanup after examination)
          if (reward.hideItemId) {
            this.hideItem(reward.hideItemId);
          }
          break;

        case 'InformationReward':
          // Information is handled by the UI
          break;
      }
    }
  }

  private unlockDoor(doorId: string): void {
    // Find the door item in current room
    const currentRoom = this.getCurrentRoom();
    if (currentRoom) {
      const door = currentRoom.findItem(doorId);
      if (door) {
        door.unlock();
      }
      // Also unlock room connections
      currentRoom.unlockConnection(doorId);
    }
  }

  private revealRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.isHidden = false;
    }
  }

  private revealItem(itemId: string): void {
    // Find the item in the current room
    const currentRoom = this.getCurrentRoom();
    if (currentRoom) {
      const item = currentRoom.findItem(itemId);
      if (item) {
        item.isVisible = true;
        item.isHidden = false;
      }
    }
  }

  private hideItem(itemId: string): void {
    // Find and hide the item in the current room
    const currentRoom = this.getCurrentRoom();
    if (currentRoom) {
      const item = currentRoom.findItem(itemId);
      if (item) {
        item.isVisible = false;
      }
    }
  }

  // Key Management
  getKey(keyId: string): Key | null {
    return this.keys.get(keyId) || null;
  }

  acquireKey(keyId: string, fromSource: string): boolean {
    const key = this.keys.get(keyId);
    if (key && !key.isAcquired) {
      key.acquire(fromSource, this.globalState.turnCount);
      this.globalState.keysAcquired.push(keyId);
      return true;
    }
    return false;
  }

  getAcquiredKeys(): Key[] {
    return Array.from(this.keys.values()).filter(key => key.isAcquired);
  }

  // Game State Management
  incrementTurn(): void {
    this.globalState.turnCount++;
  }

  examineItem(itemId: string): void {
    if (!this.globalState.itemsExamined.includes(itemId)) {
      this.globalState.itemsExamined.push(itemId);
    }
  }

  startGame(): void {
    this.globalState.gameStartTime = Date.now();
    this.globalState.currentRoomId = this.startingRoomId;
    const startRoom = this.rooms.get(this.startingRoomId);
    if (startRoom) {
      startRoom.enter(0);
    }
  }

  checkCompletion(): boolean {
    for (const criteria of this.completionCriteria) {
      if (criteria.type === 'trigger_activated') {
        if (criteria.triggerId && !this.globalState.triggersActivated.includes(criteria.triggerId)) {
          return false;
        }
      }
      // Add more completion criteria checks as needed
    }
    return true;
  }

  completeGame(): void {
    this.globalState.isCompleted = true;
    this.globalState.gameEndTime = Date.now();
  }

  getPlayTime(): number {
    if (this.globalState.gameStartTime) {
      const endTime = this.globalState.gameEndTime || Date.now();
      return Math.floor((endTime - this.globalState.gameStartTime) / 1000); // seconds
    }
    return 0;
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      theme: this.theme,
      difficulty: this.difficulty,
      estimatedDuration: this.estimatedDuration,
      storyIntro: this.storyIntro,
      storyOutro: this.storyOutro,
      startingRoomId: this.startingRoomId,
      finalRoomId: this.finalRoomId,
      rooms: Array.from(this.rooms.values()).map(room => room.toJSON()),
      triggers: Array.from(this.triggers.values()).map(trigger => trigger.toJSON()),
      keys: Array.from(this.keys.values()).map(key => key.toJSON()),
      completionCriteria: this.completionCriteria,
      globalState: this.globalState
    };
  }

  static fromJSON(json: any): Experience {
    return new Experience(json.experience || json);
  }
}
