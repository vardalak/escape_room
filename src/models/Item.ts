/**
 * Item System - Base classes for room items
 */

import { Trigger } from './Trigger';

export enum ItemCategory {
  FURNITURE = "FURNITURE",
  CONTAINER = "CONTAINER",
  DEVICE = "DEVICE",
  LOCK_MECHANISM = "LOCK_MECHANISM",
  DOOR = "DOOR",
  DECORATIVE = "DECORATIVE",
  TOOL = "TOOL",
  DOCUMENT = "DOCUMENT",
  MEDIA = "MEDIA",
  ELECTRICAL = "ELECTRICAL",
  SECURITY = "SECURITY"
}

export interface Position {
  x: number;
  y: number;
}

export interface ItemConfig {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  type?: string;
  isVisible?: boolean;
  isHidden?: boolean;
  isInteractive?: boolean;
  isExaminable?: boolean;
  isPortable?: boolean;
  position?: Position;
  visualAsset?: string;
  containedItems?: any[];
  surfaceItems?: any[];
  lockTriggerId?: string;
  examineTrigger?: string;
  isLocked?: boolean;
  keyId?: string;
  leadsTo?: string; // For DOOR items: which room this door leads to
}

export abstract class Item {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  type?: string;

  isVisible: boolean;
  isHidden: boolean;
  isInteractive: boolean;
  isExaminable: boolean;
  isPortable: boolean;

  position?: Position;
  visualAsset?: string;

  containedItems: Item[];
  surfaceItems: Item[];

  lockTriggerId?: string;
  examineTrigger?: string;
  isLocked: boolean;
  keyId?: string;
  leadsTo?: string; // For DOOR items: which room this door leads to

  constructor(config: ItemConfig) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.type = config.type;
    this.isHidden = config.isHidden || false;
    this.isVisible = config.isVisible !== false;
    this.isInteractive = config.isInteractive || false;
    this.isExaminable = config.isExaminable !== false;
    this.isPortable = config.isPortable || false;
    this.position = config.position;
    this.visualAsset = config.visualAsset;
    this.containedItems = [];
    this.surfaceItems = [];
    this.lockTriggerId = config.lockTriggerId;
    this.examineTrigger = config.examineTrigger;
    this.isLocked = config.isLocked || false;
    this.keyId = config.keyId;
    this.leadsTo = config.leadsTo;

    // Initialize contained and surface items if provided
    if (config.containedItems) {
      this.containedItems = config.containedItems.map(itemConfig =>
        ItemFactory.createItem(itemConfig)
      );
    }
    if (config.surfaceItems) {
      this.surfaceItems = config.surfaceItems.map(itemConfig =>
        ItemFactory.createItem(itemConfig)
      );
    }
  }

  abstract examine(): string;
  abstract getAvailableActions(): string[];

  unlock(): void {
    this.isLocked = false;
  }

  addItem(item: Item, location: 'contained' | 'surface' = 'contained'): void {
    if (location === 'contained') {
      this.containedItems.push(item);
    } else {
      this.surfaceItems.push(item);
    }
  }

  removeItem(itemId: string, location: 'contained' | 'surface' = 'contained'): Item | null {
    const items = location === 'contained' ? this.containedItems : this.surfaceItems;
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      return items.splice(index, 1)[0];
    }
    return null;
  }

  findItem(itemId: string): Item | null {
    // Check contained items
    let found = this.containedItems.find(item => item.id === itemId);
    if (found) return found;

    // Check surface items
    found = this.surfaceItems.find(item => item.id === itemId);
    if (found) return found;

    // Recursively search in nested items
    for (const item of [...this.containedItems, ...this.surfaceItems]) {
      found = item.findItem(itemId);
      if (found) return found;
    }

    return null;
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      type: this.type,
      isVisible: this.isVisible,
      isInteractive: this.isInteractive,
      isExaminable: this.isExaminable,
      isPortable: this.isPortable,
      position: this.position,
      visualAsset: this.visualAsset,
      containedItems: this.containedItems.map(item => item.toJSON()),
      surfaceItems: this.surfaceItems.map(item => item.toJSON()),
      lockTriggerId: this.lockTriggerId,
      examineTrigger: this.examineTrigger,
      isLocked: this.isLocked,
      keyId: this.keyId
    };
  }
}

export class InactiveItem extends Item {
  constructor(config: ItemConfig) {
    super({...config, isInteractive: false});
  }

  examine(): string {
    return this.description;
  }

  getAvailableActions(): string[] {
    return ['examine'];
  }
}

export class InteractiveItem extends Item {
  state: any;

  constructor(config: ItemConfig & { state?: any }) {
    super({...config, isInteractive: true});
    this.state = config.state || {};
  }

  examine(): string {
    return this.description;
  }

  getAvailableActions(): string[] {
    const actions = ['examine'];

    if (this.isPortable) {
      actions.push('take');
    }

    if (this.containedItems.length > 0 && !this.isLocked) {
      actions.push('open');
    }

    if (this.lockTriggerId && this.isLocked) {
      actions.push('unlock');
    }

    return actions;
  }

  setState(newState: any): void {
    this.state = { ...this.state, ...newState };
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      state: this.state
    };
  }
}

// Specialized Item Types
export interface DeskConfig extends ItemConfig {
  drawerCount?: number;
  hasLock?: boolean;
}

export class Desk extends InteractiveItem {
  drawerCount: number;
  hasLock: boolean;

  constructor(config: DeskConfig) {
    super(config);
    this.drawerCount = config.drawerCount || 2;
    this.hasLock = config.hasLock || false;
    this.category = ItemCategory.FURNITURE;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      drawerCount: this.drawerCount,
      hasLock: this.hasLock
    };
  }
}

export interface CabinetConfig extends ItemConfig {
  doorCount?: number;
  shelfCount?: number;
}

export class Cabinet extends InteractiveItem {
  doorCount: number;
  shelfCount: number;

  constructor(config: CabinetConfig) {
    super(config);
    this.doorCount = config.doorCount || 2;
    this.shelfCount = config.shelfCount || 3;
    this.category = ItemCategory.FURNITURE;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      doorCount: this.doorCount,
      shelfCount: this.shelfCount
    };
  }
}

// Item Factory
export class ItemFactory {
  static createItem(config: any): Item {
    // Check if item is interactive
    if (config.isInteractive === false) {
      return new InactiveItem(config);
    }

    // Check for specialized types
    if (config.type === 'Desk') {
      return new Desk(config);
    }

    if (config.type === 'Cabinet') {
      return new Cabinet(config);
    }

    // Default to InteractiveItem
    return new InteractiveItem(config);
  }

  static createFromJSON(json: any): Item {
    return ItemFactory.createItem(json);
  }
}
