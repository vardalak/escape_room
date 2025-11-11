/**
 * Trigger System - Base classes for all trigger types
 */

import { Key } from './Key';

export enum TriggerType {
  KEYPAD_LOCK = "KeypadLock",
  PAD_LOCK = "PadLock",
  COMBO_LOCK = "ComboLock",
  WORD_LOCK = "WordLock",
  MAGNETIC_LOCK = "MagneticLock",
  PATTERN_LOCK = "PatternLock",
  TURN_COUNT = "TurnCountTrigger",
  RECURRING_TURN = "RecurringTurnTrigger",
  TURN_RANGE = "TurnRangeTrigger",
  PHONE_EXTENSION = "PhoneExtensionTrigger",
  MEDIA_PLAYER = "MediaPlayerTrigger",
  SWITCH_COMBINATION = "SwitchCombinationTrigger",
  TERMINAL_COMMAND = "TerminalCommandTrigger",
  ITEM_COMBINATION = "ItemCombinationTrigger",
  SEQUENCE_ACTION = "SequenceActionTrigger",
  EXAMINATION = "ExaminationTrigger",
  PROXIMITY = "ProximityTrigger"
}

export interface Reward {
  type: string;
  [key: string]: any;
}

export interface TriggerConfig {
  id: string;
  type: TriggerType;
  name: string;
  description: string;
  isActivated?: boolean;
  isVisible?: boolean;
  requiredItems?: string[];
  connectedTriggers?: string[];
  rewards?: Reward[];
  successMessage?: string;
  failureMessage?: string;
}

export abstract class Trigger {
  id: string;
  type: TriggerType;
  name: string;
  description: string;
  isActivated: boolean;
  isVisible: boolean;
  requiredItems: string[];
  connectedTriggers: string[];
  rewards: Reward[];
  successMessage?: string;
  failureMessage?: string;

  constructor(config: TriggerConfig) {
    this.id = config.id;
    this.type = config.type;
    this.name = config.name;
    this.description = config.description;
    this.isActivated = config.isActivated || false;
    this.isVisible = config.isVisible !== false;
    this.requiredItems = config.requiredItems || [];
    this.connectedTriggers = config.connectedTriggers || [];
    this.rewards = config.rewards || [];
    this.successMessage = config.successMessage;
    this.failureMessage = config.failureMessage;
  }

  abstract checkCondition(input?: any): boolean;
  abstract getInteractionPrompt(): string;

  activate(): Reward[] {
    if (this.isActivated) {
      return [];
    }
    this.isActivated = true;
    return this.rewards;
  }

  reset(): void {
    this.isActivated = false;
  }

  toJSON(): any {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      description: this.description,
      isActivated: this.isActivated,
      isVisible: this.isVisible,
      requiredItems: this.requiredItems,
      connectedTriggers: this.connectedTriggers,
      rewards: this.rewards,
      successMessage: this.successMessage,
      failureMessage: this.failureMessage
    };
  }
}

// Lock-Based Triggers
export interface KeypadLockConfig extends TriggerConfig {
  code: string;
  codeLength: number;
  allowedAttempts?: number;
  hintsOnFailure?: boolean;
  inputType?: 'numbers' | 'letters';
}

export class KeypadLock extends Trigger {
  code: string;
  codeLength: number;
  allowedAttempts: number;
  hintsOnFailure: boolean;
  attemptCount: number;
  inputType: 'numbers' | 'letters';

  constructor(config: KeypadLockConfig) {
    super({...config, type: TriggerType.KEYPAD_LOCK});
    this.code = config.code;
    this.codeLength = config.codeLength;
    this.allowedAttempts = config.allowedAttempts || 999;
    this.hintsOnFailure = config.hintsOnFailure || false;
    this.attemptCount = 0;
    this.inputType = config.inputType || 'numbers';
  }

  checkCondition(input: string): boolean {
    this.attemptCount++;
    return input === this.code;
  }

  checkCode(code: string): boolean {
    return this.checkCondition(code);
  }

  getInteractionPrompt(): string {
    return `Enter a ${this.codeLength}-digit code:`;
  }

  getRemainingAttempts(): number {
    return Math.max(0, this.allowedAttempts - this.attemptCount);
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      code: this.code,
      codeLength: this.codeLength,
      allowedAttempts: this.allowedAttempts,
      hintsOnFailure: this.hintsOnFailure,
      attemptCount: this.attemptCount
    };
  }
}

export interface PadLockConfig extends TriggerConfig {
  requiredKey: string;
  keyType?: string;
}

export class PadLock extends Trigger {
  requiredKey: string;
  keyType: string;

  constructor(config: PadLockConfig) {
    super({...config, type: TriggerType.PAD_LOCK});
    this.requiredKey = config.requiredKey;
    this.keyType = config.keyType || "standard";
  }

  checkCondition(key?: Key): boolean {
    if (!key) return false;
    return key.id === this.requiredKey && key.canActivateTrigger(this.id);
  }

  checkKey(key: Key): boolean {
    return this.checkCondition(key);
  }

  getInteractionPrompt(): string {
    return `This lock requires a ${this.keyType} key.`;
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      requiredKey: this.requiredKey,
      keyType: this.keyType
    };
  }
}

// Environmental Triggers
export interface ExaminationTriggerConfig extends TriggerConfig {
  objectId: string;
  requiredPerception?: number;
  revealsInformation?: boolean;
  onceOnly?: boolean;
}

export class ExaminationTrigger extends Trigger {
  objectId: string;
  requiredPerception: number;
  revealsInformation: boolean;
  onceOnly: boolean;

  constructor(config: ExaminationTriggerConfig) {
    super({...config, type: TriggerType.EXAMINATION});
    this.objectId = config.objectId;
    this.requiredPerception = config.requiredPerception || 0;
    this.revealsInformation = config.revealsInformation || false;
    this.onceOnly = config.onceOnly !== false;
  }

  checkCondition(objectId?: string): boolean {
    if (this.onceOnly && this.isActivated) {
      return false;
    }
    return objectId === this.objectId;
  }

  getInteractionPrompt(): string {
    return "Examine this item closely.";
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      objectId: this.objectId,
      requiredPerception: this.requiredPerception,
      revealsInformation: this.revealsInformation,
      onceOnly: this.onceOnly
    };
  }
}

// Trigger Factory
export class TriggerFactory {
  static createTrigger(config: any): Trigger {
    switch (config.type) {
      case TriggerType.KEYPAD_LOCK:
      case "KeypadLock":
        return new KeypadLock(config);
      case TriggerType.PAD_LOCK:
      case "PadLock":
        return new PadLock(config);
      case TriggerType.EXAMINATION:
      case "ExaminationTrigger":
        return new ExaminationTrigger(config);
      default:
        throw new Error(`Unknown trigger type: ${config.type}`);
    }
  }

  static createFromJSON(json: any): Trigger {
    return TriggerFactory.createTrigger(json);
  }
}
