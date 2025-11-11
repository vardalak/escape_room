/**
 * Key System - Base classes for all key types
 */

export enum KeyType {
  PHYSICAL_KEY = "PHYSICAL_KEY",
  MAGNETIC_CARD = "MAGNETIC_CARD",
  TOOL = "TOOL",
  NUMERIC_CODE = "NUMERIC_CODE",
  WORD_CODE = "WORD_CODE",
  PATTERN = "PATTERN",
  COMMAND_SEQUENCE = "COMMAND_SEQUENCE",
  CLUE = "CLUE",
  MAP = "MAP",
  DOCUMENT = "DOCUMENT",
  MEDIA_ITEM = "MEDIA_ITEM",
  AUDIO_RECORDING = "AUDIO_RECORDING",
  PERMISSION = "PERMISSION",
  KNOWLEDGE = "KNOWLEDGE",
  SEQUENCE_STEP = "SEQUENCE_STEP"
}

export enum KeyCategory {
  PHYSICAL = "PHYSICAL",
  DIGITAL = "DIGITAL",
  INFORMATION = "INFORMATION",
  MEDIA = "MEDIA",
  ABSTRACT = "ABSTRACT"
}

export interface KeyConfig {
  id: string;
  name: string;
  description: string;
  type: KeyType;
  category: KeyCategory;
  roomId: string;
  associatedTriggerId: string;
  isAcquired?: boolean;
  isRedHerring?: boolean;
  isHidden?: boolean;
  isConsumed?: boolean;
  acquiredFrom?: string;
  acquiredTurn?: number;
  visualAsset?: string;
  nameOverride?: string;
  descriptionOverride?: string;
}

export abstract class Key {
  id: string;
  name: string;
  description: string;
  type: KeyType;
  category: KeyCategory;

  roomId: string;
  associatedTriggerId: string;

  isAcquired: boolean;
  isRedHerring: boolean;
  isHidden: boolean;
  isConsumed: boolean;

  acquiredFrom?: string;
  acquiredTurn?: number;

  visualAsset?: string;
  nameOverride?: string;
  descriptionOverride?: string;

  constructor(config: KeyConfig) {
    this.id = config.id;
    this.name = config.nameOverride || config.name;
    this.description = config.descriptionOverride || config.description;
    this.type = config.type;
    this.category = config.category;
    this.roomId = config.roomId;
    this.associatedTriggerId = config.associatedTriggerId;
    this.isAcquired = config.isAcquired || false;
    this.isRedHerring = config.isRedHerring || false;
    this.isHidden = config.isHidden || false;
    this.isConsumed = config.isConsumed || false;
    this.acquiredFrom = config.acquiredFrom;
    this.acquiredTurn = config.acquiredTurn;
    this.visualAsset = config.visualAsset;
    this.nameOverride = config.nameOverride;
    this.descriptionOverride = config.descriptionOverride;
  }

  abstract canActivateTrigger(triggerId: string): boolean;
  abstract getUsageHint(): string;

  acquire(fromSource: string, turn: number): void {
    this.isAcquired = true;
    this.acquiredFrom = fromSource;
    this.acquiredTurn = turn;
    if (this.isHidden) {
      this.isHidden = false;
    }
  }

  consume(): void {
    if (this.isConsumed) {
      this.isAcquired = false;
    }
  }

  getDisplayName(): string {
    return this.nameOverride || this.name;
  }

  getDisplayDescription(): string {
    return this.descriptionOverride || this.description;
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      category: this.category,
      roomId: this.roomId,
      associatedTriggerId: this.associatedTriggerId,
      isAcquired: this.isAcquired,
      isRedHerring: this.isRedHerring,
      isHidden: this.isHidden,
      isConsumed: this.isConsumed,
      acquiredFrom: this.acquiredFrom,
      acquiredTurn: this.acquiredTurn,
      visualAsset: this.visualAsset,
      nameOverride: this.nameOverride,
      descriptionOverride: this.descriptionOverride
    };
  }
}

// Physical Key Types
export interface PhysicalKeyConfig extends KeyConfig {
  keyMaterial?: string;
  keyShape?: string;
  keySize?: string;
  hasTag?: boolean;
  tagText?: string;
}

export class PhysicalKey extends Key {
  keyMaterial: string;
  keyShape: string;
  keySize: string;
  hasTag: boolean;
  tagText?: string;

  constructor(config: PhysicalKeyConfig) {
    super({...config, type: KeyType.PHYSICAL_KEY, category: KeyCategory.PHYSICAL});
    this.keyMaterial = config.keyMaterial || "brass";
    this.keyShape = config.keyShape || "standard";
    this.keySize = config.keySize || "small";
    this.hasTag = config.hasTag || false;
    this.tagText = config.tagText;
    this.isConsumed = false; // Physical keys are never consumed
  }

  canActivateTrigger(triggerId: string): boolean {
    return this.associatedTriggerId === triggerId;
  }

  getUsageHint(): string {
    return `Try using this ${this.keyMaterial} key on a lock.`;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      keyMaterial: this.keyMaterial,
      keyShape: this.keyShape,
      keySize: this.keySize,
      hasTag: this.hasTag,
      tagText: this.tagText
    };
  }
}

// Digital Key Types
export interface NumericCodeConfig extends KeyConfig {
  code: string;
  codeLength?: number;
  codeHint?: string;
  isPartial?: boolean;
}

export class NumericCode extends Key {
  code: string;
  codeLength: number;
  codeHint?: string;
  isPartial: boolean;

  constructor(config: NumericCodeConfig) {
    super({...config, type: KeyType.NUMERIC_CODE, category: KeyCategory.DIGITAL});
    this.code = config.code;
    this.codeLength = config.codeLength || config.code.length;
    this.codeHint = config.codeHint;
    this.isPartial = config.isPartial || false;
    this.isConsumed = false; // Codes can be reused
  }

  canActivateTrigger(triggerId: string): boolean {
    return this.associatedTriggerId === triggerId;
  }

  getUsageHint(): string {
    if (this.isPartial) {
      return `This is part of a code: ${this.codeHint || this.code}`;
    }
    return `Try entering the code: ${this.code}`;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      code: this.code,
      codeLength: this.codeLength,
      codeHint: this.codeHint,
      isPartial: this.isPartial
    };
  }
}

// Information Key Types
export interface ClueKeyConfig extends KeyConfig {
  clueText: string;
  clueType: string;
  relatedPuzzle?: string;
  clarityLevel?: number;
}

export class ClueKey extends Key {
  clueText: string;
  clueType: string;
  relatedPuzzle?: string;
  clarityLevel: number;

  constructor(config: ClueKeyConfig) {
    super({...config, type: KeyType.CLUE, category: KeyCategory.INFORMATION});
    this.clueText = config.clueText;
    this.clueType = config.clueType;
    this.relatedPuzzle = config.relatedPuzzle;
    this.clarityLevel = config.clarityLevel || 3;
    this.isConsumed = false;
  }

  canActivateTrigger(triggerId: string): boolean {
    return this.relatedPuzzle === triggerId;
  }

  getUsageHint(): string {
    return this.clueText;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      clueText: this.clueText,
      clueType: this.clueType,
      relatedPuzzle: this.relatedPuzzle,
      clarityLevel: this.clarityLevel
    };
  }
}

// Key Factory
export class KeyFactory {
  static createKey(config: any): Key {
    switch (config.type) {
      case KeyType.PHYSICAL_KEY:
        return new PhysicalKey(config);
      case KeyType.NUMERIC_CODE:
        return new NumericCode(config);
      case KeyType.CLUE:
        return new ClueKey(config);
      default:
        throw new Error(`Unknown key type: ${config.type}`);
    }
  }

  static createFromJSON(json: any): Key {
    return KeyFactory.createKey(json);
  }
}
