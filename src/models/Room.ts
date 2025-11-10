/**
 * Room System - Container for game experience
 */

import { Item, ItemFactory } from './Item';

export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT"
}

export enum LightingCondition {
  DARK = "DARK",
  DIM = "DIM",
  NORMAL = "NORMAL",
  BRIGHT = "BRIGHT",
  FLICKERING = "FLICKERING"
}

export interface RoomConnection {
  id: string;
  connectedRoomId: string;
  direction: string;
  name: string;
  description: string;
  isLocked: boolean;
  isHidden: boolean;
  requiredTrigger?: string;
}

export interface RoomConfig {
  id: string;
  name: string;
  theme: string;
  difficulty: DifficultyLevel;
  parentExperience: string;
  shortDescription: string;
  longDescription: string;
  ambientAudio?: string;
  lightingState?: LightingCondition;
  isLocked?: boolean;
  isHidden?: boolean;
  isVisited?: boolean;
  turnEntered?: number;
  items?: any[];
  connectedRooms?: RoomConnection[];
}

export class Room {
  id: string;
  name: string;
  theme: string;
  difficulty: DifficultyLevel;
  parentExperience: string;
  shortDescription: string;
  longDescription: string;

  items: Item[];
  connectedRooms: RoomConnection[];

  ambientAudio?: string;
  lightingState: LightingCondition;

  isLocked: boolean;
  isHidden: boolean;
  isVisited: boolean;
  turnEntered?: number;

  constructor(config: RoomConfig) {
    this.id = config.id;
    this.name = config.name;
    this.theme = config.theme;
    this.difficulty = config.difficulty;
    this.parentExperience = config.parentExperience;
    this.shortDescription = config.shortDescription;
    this.longDescription = config.longDescription;
    this.ambientAudio = config.ambientAudio;
    this.lightingState = config.lightingState || LightingCondition.NORMAL;
    this.isLocked = config.isLocked || false;
    this.isHidden = config.isHidden || false;
    this.isVisited = config.isVisited || false;
    this.turnEntered = config.turnEntered;
    this.items = [];
    this.connectedRooms = config.connectedRooms || [];

    // Initialize items
    if (config.items) {
      this.items = config.items.map(itemConfig =>
        ItemFactory.createItem(itemConfig)
      );
    }
  }

  getVisibleItems(): Item[] {
    return this.items.filter(item => item.isVisible);
  }

  getInteractiveItems(): Item[] {
    return this.items.filter(item => item.isInteractive);
  }

  getAvailableExits(): RoomConnection[] {
    return this.connectedRooms.filter(conn => !conn.isHidden);
  }

  getLockedExits(): RoomConnection[] {
    return this.connectedRooms.filter(conn => conn.isLocked);
  }

  findItem(itemId: string): Item | null {
    // Direct search
    let found = this.items.find(item => item.id === itemId);
    if (found) return found;

    // Recursive search in nested items
    for (const item of this.items) {
      found = item.findItem(itemId);
      if (found) return found;
    }

    return null;
  }

  addItem(item: Item): void {
    this.items.push(item);
  }

  removeItem(itemId: string): Item | null {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
  }

  unlockConnection(connectionId: string): boolean {
    const connection = this.connectedRooms.find(conn => conn.id === connectionId);
    if (connection) {
      connection.isLocked = false;
      return true;
    }
    return false;
  }

  revealConnection(connectionId: string): boolean {
    const connection = this.connectedRooms.find(conn => conn.id === connectionId);
    if (connection) {
      connection.isHidden = false;
      return true;
    }
    return false;
  }

  enter(turn: number): void {
    this.isVisited = true;
    this.turnEntered = turn;
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      theme: this.theme,
      difficulty: this.difficulty,
      parentExperience: this.parentExperience,
      shortDescription: this.shortDescription,
      longDescription: this.longDescription,
      ambientAudio: this.ambientAudio,
      lightingState: this.lightingState,
      isLocked: this.isLocked,
      isHidden: this.isHidden,
      isVisited: this.isVisited,
      turnEntered: this.turnEntered,
      items: this.items.map(item => item.toJSON()),
      connectedRooms: this.connectedRooms
    };
  }

  static fromJSON(json: any): Room {
    return new Room(json);
  }
}
