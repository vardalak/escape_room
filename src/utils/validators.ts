/**
 * Validation Utilities - Validate state updates and game logic
 */

import { Experience } from '../models/Experience';
import { Room } from '../models/Room';
import { Item } from '../models/Item';
import { Key } from '../models/Key';
import { Trigger } from '../models/Trigger';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ExperienceValidator {
  /**
   * Validate an entire experience structure
   */
  static validateExperience(experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!experience.id) errors.push('Experience must have an ID');
    if (!experience.name) errors.push('Experience must have a name');
    if (!experience.startingRoomId) errors.push('Experience must have a starting room ID');

    // Validate starting room exists
    if (!experience.rooms.has(experience.startingRoomId)) {
      errors.push(`Starting room "${experience.startingRoomId}" does not exist`);
    }

    // Validate final room exists
    if (experience.finalRoomId && !experience.rooms.has(experience.finalRoomId)) {
      warnings.push(`Final room "${experience.finalRoomId}" does not exist`);
    }

    // Validate rooms
    experience.rooms.forEach(room => {
      const roomResult = this.validateRoom(room, experience);
      errors.push(...roomResult.errors);
      warnings.push(...roomResult.warnings);
    });

    // Validate triggers
    experience.triggers.forEach(trigger => {
      const triggerResult = this.validateTrigger(trigger, experience);
      errors.push(...triggerResult.errors);
      warnings.push(...triggerResult.warnings);
    });

    // Validate keys
    experience.keys.forEach(key => {
      const keyResult = this.validateKey(key, experience);
      errors.push(...keyResult.errors);
      warnings.push(...keyResult.warnings);
    });

    // Check for circular dependencies
    const circularResult = this.checkCircularDependencies(experience);
    errors.push(...circularResult.errors);
    warnings.push(...circularResult.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate a room
   */
  static validateRoom(room: Room, experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!room.id) errors.push('Room must have an ID');
    if (!room.name) errors.push('Room must have a name');

    // Validate room connections
    room.connectedRooms.forEach(connection => {
      if (!experience.rooms.has(connection.connectedRoomId)) {
        errors.push(`Room "${room.id}" connects to non-existent room "${connection.connectedRoomId}"`);
      }

      if (connection.requiredTrigger && !experience.triggers.has(connection.requiredTrigger)) {
        errors.push(`Room connection requires non-existent trigger "${connection.requiredTrigger}"`);
      }
    });

    // Validate items
    room.items.forEach(item => {
      const itemResult = this.validateItem(item, experience);
      errors.push(...itemResult.errors);
      warnings.push(...itemResult.warnings);
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate an item
   */
  static validateItem(item: Item, experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!item.id) errors.push('Item must have an ID');
    if (!item.name) errors.push('Item must have a name');

    // Validate lock trigger
    if (item.lockTriggerId && !experience.triggers.has(item.lockTriggerId)) {
      errors.push(`Item "${item.id}" has non-existent lock trigger "${item.lockTriggerId}"`);
    }

    // Validate examine trigger
    if (item.examineTrigger && !experience.triggers.has(item.examineTrigger)) {
      errors.push(`Item "${item.id}" has non-existent examine trigger "${item.examineTrigger}"`);
    }

    // Validate key reference
    if (item.keyId && !experience.keys.has(item.keyId)) {
      errors.push(`Item "${item.id}" references non-existent key "${item.keyId}"`);
    }

    // Validate contained items recursively
    item.containedItems.forEach(contained => {
      const containedResult = this.validateItem(contained, experience);
      errors.push(...containedResult.errors);
      warnings.push(...containedResult.warnings);
    });

    // Validate surface items recursively
    item.surfaceItems.forEach(surface => {
      const surfaceResult = this.validateItem(surface, experience);
      errors.push(...surfaceResult.errors);
      warnings.push(...surfaceResult.warnings);
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate a trigger
   */
  static validateTrigger(trigger: Trigger, experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!trigger.id) errors.push('Trigger must have an ID');
    if (!trigger.name) errors.push('Trigger must have a name');

    // Validate connected triggers
    trigger.connectedTriggers.forEach(connectedId => {
      if (!experience.triggers.has(connectedId)) {
        errors.push(`Trigger "${trigger.id}" connects to non-existent trigger "${connectedId}"`);
      }
    });

    // Validate required items
    trigger.requiredItems.forEach(itemId => {
      // Check if item exists in any room
      let itemExists = false;
      experience.rooms.forEach(room => {
        if (room.findItem(itemId)) {
          itemExists = true;
        }
      });
      if (!itemExists) {
        warnings.push(`Trigger "${trigger.id}" requires item "${itemId}" which may not exist`);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate a key
   */
  static validateKey(key: Key, experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!key.id) errors.push('Key must have an ID');
    if (!key.name) errors.push('Key must have a name');

    // Validate associated trigger
    if (key.associatedTriggerId &&
        key.associatedTriggerId !== 'none' &&
        !experience.triggers.has(key.associatedTriggerId)) {
      errors.push(`Key "${key.id}" associated with non-existent trigger "${key.associatedTriggerId}"`);
    }

    // Validate room reference
    if (key.roomId && !experience.rooms.has(key.roomId)) {
      warnings.push(`Key "${key.id}" belongs to non-existent room "${key.roomId}"`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Check for circular dependencies in triggers
   */
  static checkCircularDependencies(experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCycle = (triggerId: string, path: string[]): boolean => {
      if (recursionStack.has(triggerId)) {
        errors.push(`Circular dependency detected in triggers: ${path.join(' -> ')} -> ${triggerId}`);
        return true;
      }

      if (visited.has(triggerId)) {
        return false;
      }

      visited.add(triggerId);
      recursionStack.add(triggerId);

      const trigger = experience.triggers.get(triggerId);
      if (trigger) {
        for (const connectedId of trigger.connectedTriggers) {
          if (detectCycle(connectedId, [...path, triggerId])) {
            return true;
          }
        }
      }

      recursionStack.delete(triggerId);
      return false;
    };

    experience.triggers.forEach((trigger, triggerId) => {
      if (!visited.has(triggerId)) {
        detectCycle(triggerId, []);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate that the experience is completable
   */
  static validateCompletability(experience: Experience): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if there's a path from starting room to completion
    const reachableRooms = this.findReachableRooms(experience);

    if (experience.finalRoomId && !reachableRooms.has(experience.finalRoomId)) {
      errors.push(`Final room "${experience.finalRoomId}" is not reachable from starting room`);
    }

    // Check if all completion criteria triggers are reachable
    experience.completionCriteria.forEach(criteria => {
      if (criteria.type === 'trigger_activated' && criteria.triggerId) {
        const trigger = experience.triggers.get(criteria.triggerId);
        if (trigger) {
          // Check if trigger is in a reachable room
          // This is a simplified check - a more thorough check would trace key/item dependencies
          let isReachable = false;
          reachableRooms.forEach(roomId => {
            const room = experience.rooms.get(roomId);
            if (room) {
              room.items.forEach(item => {
                if (item.lockTriggerId === criteria.triggerId ||
                    item.examineTrigger === criteria.triggerId) {
                  isReachable = true;
                }
              });
            }
          });

          if (!isReachable) {
            warnings.push(`Completion trigger "${criteria.triggerId}" may not be reachable`);
          }
        }
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Find all rooms reachable from starting room
   */
  private static findReachableRooms(experience: Experience): Set<string> {
    const reachable = new Set<string>();
    const queue: string[] = [experience.startingRoomId];

    while (queue.length > 0) {
      const roomId = queue.shift()!;
      if (reachable.has(roomId)) continue;

      reachable.add(roomId);

      const room = experience.rooms.get(roomId);
      if (room) {
        room.connectedRooms.forEach(connection => {
          if (!connection.isHidden && !reachable.has(connection.connectedRoomId)) {
            queue.push(connection.connectedRoomId);
          }
        });
      }
    }

    return reachable;
  }
}

/**
 * Validate a state update action
 */
export class StateUpdateValidator {
  /**
   * Validate that an item can be examined
   */
  static canExamineItem(item: Item): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!item.isVisible) {
      errors.push('Item is not visible');
    }

    if (!item.isExaminable) {
      errors.push('Item cannot be examined');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate that a container can be opened
   */
  static canOpenContainer(item: Item): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!item.isVisible) {
      errors.push('Container is not visible');
    }

    if (!item.isInteractive) {
      errors.push('Item is not a container');
    }

    if (item.isLocked) {
      errors.push('Container is locked');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate that an item can be taken
   */
  static canTakeItem(item: Item): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!item.isVisible) {
      errors.push('Item is not visible');
    }

    if (!item.isPortable) {
      errors.push('Item cannot be taken');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate that a key can be used on a trigger
   */
  static canUseKey(key: Key, trigger: Trigger): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!key.isAcquired) {
      errors.push('Key has not been acquired');
    }

    if (key.isRedHerring) {
      warnings.push('This key might not work on anything');
    }

    if (!trigger.isVisible) {
      errors.push('Trigger is not visible');
    }

    if (trigger.isActivated) {
      errors.push('Trigger is already activated');
    }

    if (!key.canActivateTrigger(trigger.id)) {
      errors.push('Key cannot activate this trigger');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate that a room can be entered
   */
  static canEnterRoom(room: Room, fromRoom: Room): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (room.isLocked) {
      errors.push('Room is locked');
    }

    if (room.isHidden) {
      errors.push('Room is hidden');
    }

    // Check if rooms are connected
    const connection = fromRoom.connectedRooms.find(
      conn => conn.connectedRoomId === room.id
    );

    if (!connection) {
      errors.push('Rooms are not connected');
    } else if (connection.isLocked) {
      errors.push('Connection is locked');
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}
