/**
 * Experience Validator - Validates that escape room experiences are completable
 *
 * Usage: npm run validate <experience_id>
 * Example: npm run validate training_basement
 */

export interface ValidationError {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  details?: any;
}

export interface ValidationReport {
  experienceId: string;
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
  dependencyGraph: DependencyGraph;
  reachabilityAnalysis: ReachabilityAnalysis;
}

export interface DependencyGraph {
  items: Map<string, ItemNode>;
  triggers: Map<string, TriggerNode>;
  keys: Map<string, KeyNode>;
}

export interface ItemNode {
  id: string;
  name: string;
  category: string;
  isPortable: boolean;
  location: string; // parent container or 'room'
  isLocked: boolean;
  lockTriggerId?: string;
  containedItems: string[];
  requiredToAccess: string[]; // items/keys needed to access this
  keyId?: string; // If this item represents a key/clue
}

export interface TriggerNode {
  id: string;
  type: string;
  requiredKey?: string;
  code?: string;
  unlocks?: string; // item/door it unlocks
}

export interface KeyNode {
  id: string;
  name: string;
  type: string;
  associatedTriggerId?: string;
  location: string;
}

export interface ReachabilityAnalysis {
  reachableItems: Set<string>;
  reachableTriggers: Set<string>;
  unreachableItems: Set<string>;
  unreachableTriggers: Set<string>;
  accessPath: Map<string, string[]>; // item -> path to access it
}

export class ExperienceValidator {
  private experienceData: any;
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];
  private info: ValidationError[] = [];

  constructor(experienceData: any) {
    this.experienceData = experienceData.experience || experienceData;
  }

  /**
   * Main validation entry point
   */
  validate(): ValidationReport {
    console.log(`\n🔍 Validating Experience: ${this.experienceData.name}\n`);

    // Reset validation state
    this.errors = [];
    this.warnings = [];
    this.info = [];

    // Build dependency graph
    const graph = this.buildDependencyGraph();

    // Run validation checks
    this.validateStructure();
    this.validateReferences();
    this.validateCompletionCriteria();

    // Analyze reachability
    const reachability = this.analyzeReachability(graph);
    this.validateReachability(reachability);

    // Check for circular dependencies
    this.checkCircularDependencies(graph);

    // Validate puzzle clues
    this.validatePuzzleClues(graph);

    const isValid = this.errors.length === 0;

    return {
      experienceId: this.experienceData.id,
      isValid,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      dependencyGraph: graph,
      reachabilityAnalysis: reachability,
    };
  }

  /**
   * Build dependency graph from experience data
   */
  private buildDependencyGraph(): DependencyGraph {
    const items = new Map<string, ItemNode>();
    const triggers = new Map<string, TriggerNode>();
    const keys = new Map<string, KeyNode>();

    // Parse rooms and items
    if (this.experienceData.rooms) {
      this.experienceData.rooms.forEach((room: any) => {
        this.parseItems(room.items || [], 'room', items);
      });
    }

    // Parse triggers
    if (this.experienceData.triggers) {
      this.experienceData.triggers.forEach((trigger: any) => {
        triggers.set(trigger.id, {
          id: trigger.id,
          type: trigger.type,
          requiredKey: trigger.requiredKey,
          code: trigger.code,
          unlocks: this.findUnlockTarget(trigger),
        });
      });
    }

    // Parse keys
    if (this.experienceData.keys) {
      this.experienceData.keys.forEach((key: any) => {
        keys.set(key.id, {
          id: key.id,
          name: key.name,
          type: key.type,
          associatedTriggerId: key.associatedTriggerId,
          location: key.acquiredFrom || 'unknown',
        });
      });
    }

    return { items, triggers, keys };
  }

  /**
   * Recursively parse items and nested containers
   */
  private parseItems(items: any[], parentId: string, itemMap: Map<string, ItemNode>): void {
    items.forEach((item: any) => {
      const containedItemIds = (item.containedItems || []).map((ci: any) => ci.id);

      itemMap.set(item.id, {
        id: item.id,
        name: item.name,
        category: item.category,
        isPortable: item.isPortable || false,
        location: parentId,
        isLocked: item.isLocked || false,
        lockTriggerId: item.lockTriggerId,
        containedItems: containedItemIds,
        requiredToAccess: [],
        keyId: item.keyId, // Store keyId if item represents a key/clue
      });

      // Recursively parse contained items
      if (item.containedItems) {
        this.parseItems(item.containedItems, item.id, itemMap);
      }

      // Parse surface items
      if (item.surfaceItems) {
        this.parseItems(item.surfaceItems, item.id, itemMap);
      }
    });
  }

  /**
   * Find what a trigger unlocks
   */
  private findUnlockTarget(trigger: any): string | undefined {
    if (trigger.rewards) {
      const accessReward = trigger.rewards.find((r: any) => r.type === 'AccessReward');
      if (accessReward) {
        return accessReward.unlocksDoor;
      }
    }
    return undefined;
  }

  /**
   * Validate basic structure
   */
  private validateStructure(): void {
    if (!this.experienceData.id) {
      this.errors.push({
        type: 'error',
        category: 'structure',
        message: 'Experience missing required field: id',
      });
    }

    if (!this.experienceData.name) {
      this.errors.push({
        type: 'error',
        category: 'structure',
        message: 'Experience missing required field: name',
      });
    }

    if (!this.experienceData.rooms || this.experienceData.rooms.length === 0) {
      this.errors.push({
        type: 'error',
        category: 'structure',
        message: 'Experience has no rooms defined',
      });
    }

    if (!this.experienceData.startingRoomId) {
      this.errors.push({
        type: 'error',
        category: 'structure',
        message: 'Experience missing startingRoomId',
      });
    }

    this.info.push({
      type: 'info',
      category: 'structure',
      message: `Experience has ${this.experienceData.rooms?.length || 0} room(s)`,
    });
  }

  /**
   * Validate all references (triggerIds, itemIds, etc.)
   */
  private validateReferences(): void {
    const allItemIds = new Set<string>();
    const allTriggerIds = new Set<string>();

    // Collect all IDs
    this.experienceData.rooms?.forEach((room: any) => {
      this.collectItemIds(room.items || [], allItemIds);
    });

    this.experienceData.triggers?.forEach((trigger: any) => {
      allTriggerIds.add(trigger.id);
    });

    // Check trigger references in items
    this.experienceData.rooms?.forEach((room: any) => {
      this.validateItemReferences(room.items || [], allTriggerIds, allItemIds);
    });

    // Check key associations
    this.experienceData.keys?.forEach((key: any) => {
      if (key.associatedTriggerId && key.associatedTriggerId !== 'none' && !allTriggerIds.has(key.associatedTriggerId)) {
        this.errors.push({
          type: 'error',
          category: 'references',
          message: `Key "${key.id}" references non-existent trigger: ${key.associatedTriggerId}`,
        });
      }
    });
  }

  /**
   * Collect all item IDs recursively
   */
  private collectItemIds(items: any[], idSet: Set<string>): void {
    items.forEach((item: any) => {
      idSet.add(item.id);
      if (item.containedItems) {
        this.collectItemIds(item.containedItems, idSet);
      }
      if (item.surfaceItems) {
        this.collectItemIds(item.surfaceItems, idSet);
      }
    });
  }

  /**
   * Validate item references
   */
  private validateItemReferences(items: any[], triggerIds: Set<string>, itemIds: Set<string>): void {
    items.forEach((item: any) => {
      if (item.lockTriggerId && !triggerIds.has(item.lockTriggerId)) {
        this.errors.push({
          type: 'error',
          category: 'references',
          message: `Item "${item.id}" references non-existent trigger: ${item.lockTriggerId}`,
        });
      }

      if (item.examineTrigger && !triggerIds.has(item.examineTrigger)) {
        this.errors.push({
          type: 'error',
          category: 'references',
          message: `Item "${item.id}" references non-existent examination trigger: ${item.examineTrigger}`,
        });
      }

      // Check if item has lockTriggerId but isn't marked as locked
      if (item.lockTriggerId && item.isLocked !== true) {
        this.errors.push({
          type: 'error',
          category: 'configuration',
          message: `Item "${item.id}" has lockTriggerId "${item.lockTriggerId}" but isLocked is not true`,
        });
      }

      // Recurse
      if (item.containedItems) {
        this.validateItemReferences(item.containedItems, triggerIds, itemIds);
      }
      if (item.surfaceItems) {
        this.validateItemReferences(item.surfaceItems, triggerIds, itemIds);
      }
    });
  }

  /**
   * Validate completion criteria
   */
  private validateCompletionCriteria(): void {
    if (!this.experienceData.completionCriteria || this.experienceData.completionCriteria.length === 0) {
      this.warnings.push({
        type: 'warning',
        category: 'completion',
        message: 'No completion criteria defined',
      });
      return;
    }

    this.experienceData.completionCriteria.forEach((criteria: any) => {
      if (criteria.type === 'trigger_activated') {
        const trigger = this.experienceData.triggers?.find((t: any) => t.id === criteria.triggerId);
        if (!trigger) {
          this.errors.push({
            type: 'error',
            category: 'completion',
            message: `Completion criteria references non-existent trigger: ${criteria.triggerId}`,
          });
        }
      }
    });
  }

  /**
   * Analyze what items/triggers are reachable from the starting state
   */
  private analyzeReachability(graph: DependencyGraph): ReachabilityAnalysis {
    const reachableItems = new Set<string>();
    const reachableTriggers = new Set<string>();
    const accessPath = new Map<string, string[]>();

    // Start with items in the room that are unlocked
    const queue: Array<{ itemId: string; path: string[] }> = [];

    graph.items.forEach((item, id) => {
      if (item.location === 'room' && !item.isLocked) {
        reachableItems.add(id);
        queue.push({ itemId: id, path: [id] });
        accessPath.set(id, [id]);
      }
    });

    // Iterative reachability analysis - keep going until no new items found
    const availableKeys = new Set<string>();
    const hasClues = new Set<string>(); // Track which clues we've found
    let foundNewItems = true;
    let iteration = 0;

    while (foundNewItems && iteration < 10) {
      iteration++;
      foundNewItems = false;
      const startingReachableCount = reachableItems.size;
      const startingKeyCount = availableKeys.size;
      const processedInThisIteration = new Set<string>();

      // Process all reachable items
      reachableItems.forEach(itemId => {
        if (processedInThisIteration.has(itemId)) return;
        processedInThisIteration.add(itemId);

        const item = graph.items.get(itemId);
        if (!item) return;

        // If this item is portable, check if it's a key
        if (item.isPortable) {
          const key = Array.from(graph.keys.values()).find(k => k.id === itemId || k.location === itemId);
          if (key && !availableKeys.has(key.id)) {
            availableKeys.add(key.id);

            // If this is a clue for a keypad, mark that we have it
            if (key.associatedTriggerId) {
              hasClues.add(key.associatedTriggerId);
            }
          }
        }

        // Check if examination triggers reveal clues
        if (item.examineTrigger) {
          const examTrigger = Array.from(graph.triggers.values()).find(t => t.id === item.examineTrigger);
          if (examTrigger) {
            reachableTriggers.add(examTrigger.id);
            hasClues.add(examTrigger.id);
          }
        }

        // Check contained items
        item.containedItems.forEach(containedId => {
          if (reachableItems.has(containedId)) return; // Already reachable

          const containedItem = graph.items.get(containedId);
          if (!containedItem) return;

          // Check if we can access this contained item
          if (!containedItem.isLocked) {
            reachableItems.add(containedId);
            const newPath = [...(accessPath.get(itemId) || [itemId]), containedId];
            accessPath.set(containedId, newPath);
          } else if (containedItem.lockTriggerId) {
            // Check if we have the key
            const trigger = graph.triggers.get(containedItem.lockTriggerId);
            if (trigger && trigger.requiredKey && availableKeys.has(trigger.requiredKey)) {
              reachableItems.add(containedId);
              reachableTriggers.add(trigger.id);
              const newPath = [...(accessPath.get(itemId) || [itemId]), `[unlock with ${trigger.requiredKey}]`, containedId];
              accessPath.set(containedId, newPath);
            }
          }
        });
      });

      // Check if we found new items or keys in this iteration
      if (reachableItems.size > startingReachableCount || availableKeys.size > startingKeyCount) {
        foundNewItems = true;
      }
    }

    // After processing all items, check keypad triggers
    // Keypad locks are reachable if we've found the clues/code
    graph.triggers.forEach((trigger, id) => {
      if (trigger.type === 'KeypadLock') {
        // For now, assume keypad locks are reachable if we have any clues
        // or if the door/item with the keypad is accessible
        const relatedKeys = Array.from(graph.keys.values()).filter(
          k => k.associatedTriggerId === id
        );

        // Check if related keys/clues are accessible
        // A key is accessible if:
        // 1. It's in availableKeys (already picked up), OR
        // 2. The item that holds it is reachable, OR
        // 3. We have examination triggers that provide clues
        const hasAccessToClues = relatedKeys.some(k => {
          // Check if key itself is available
          if (availableKeys.has(k.id)) return true;

          // Check if the item mentioned in key's acquiredFrom is reachable
          const keyItem = graph.items.get(k.id);
          if (keyItem && reachableItems.has(k.id)) return true;

          // Check if location container has item we can reach
          // The key location might be a container, and the actual item ID might be different
          // Look for any reachable item whose keyId matches this key
          const itemWithKey = Array.from(graph.items.values()).find(
            item => item.isPortable && reachableItems.has(item.id) && item.keyId === k.id
          );
          if (itemWithKey) return true;

          return false;
        });

        // If we have access to any clue for this keypad, mark it as reachable
        if (hasAccessToClues || hasClues.has(id)) {
          reachableTriggers.add(id);
        }
      }
    });

    // Find unreachable items
    const unreachableItems = new Set<string>();
    graph.items.forEach((item, id) => {
      if (!reachableItems.has(id)) {
        unreachableItems.add(id);
      }
    });

    const unreachableTriggers = new Set<string>();
    graph.triggers.forEach((trigger, id) => {
      if (!reachableTriggers.has(id)) {
        unreachableTriggers.add(id);
      }
    });

    return {
      reachableItems,
      reachableTriggers,
      unreachableItems,
      unreachableTriggers,
      accessPath,
    };
  }

  /**
   * Validate reachability of completion criteria
   */
  private validateReachability(reachability: ReachabilityAnalysis): void {
    // Check if completion criteria are reachable
    this.experienceData.completionCriteria?.forEach((criteria: any) => {
      if (criteria.type === 'trigger_activated') {
        if (!reachability.reachableTriggers.has(criteria.triggerId)) {
          this.errors.push({
            type: 'error',
            category: 'reachability',
            message: `Completion requires trigger "${criteria.triggerId}" but it is not reachable`,
            details: { triggerId: criteria.triggerId },
          });
        }
      }
    });

    // Report unreachable items
    if (reachability.unreachableItems.size > 0) {
      reachability.unreachableItems.forEach(itemId => {
        this.warnings.push({
          type: 'warning',
          category: 'reachability',
          message: `Item "${itemId}" is unreachable (may be locked or in inaccessible container)`,
        });
      });
    }
  }

  /**
   * Check for circular dependencies
   */
  private checkCircularDependencies(graph: DependencyGraph): void {
    // Check if any key is locked behind a door/container that requires that same key
    graph.keys.forEach((key, keyId) => {
      if (key.location && key.location !== 'room') {
        const container = graph.items.get(key.location);
        if (container && container.isLocked && container.lockTriggerId) {
          const trigger = graph.triggers.get(container.lockTriggerId);
          if (trigger && trigger.requiredKey === keyId) {
            this.errors.push({
              type: 'error',
              category: 'circular_dependency',
              message: `Circular dependency: Key "${keyId}" is locked in container that requires the same key`,
              details: { keyId, containerId: key.location, triggerId: container.lockTriggerId },
            });
          }
        }
      }
    });
  }

  /**
   * Validate puzzle clues for code-based locks
   */
  private validatePuzzleClues(graph: DependencyGraph): void {
    graph.triggers.forEach((trigger, id) => {
      if (trigger.type === 'KeypadLock' && trigger.code) {
        // Find clues that reference this trigger
        const relatedKeys = Array.from(graph.keys.values()).filter(
          k => k.associatedTriggerId === id
        );

        if (relatedKeys.length === 0) {
          this.warnings.push({
            type: 'warning',
            category: 'puzzle_clues',
            message: `Keypad lock "${id}" has code "${trigger.code}" but no clues/keys found`,
          });
        } else {
          this.info.push({
            type: 'info',
            category: 'puzzle_clues',
            message: `Keypad lock "${id}" has ${relatedKeys.length} clue(s)`,
          });
        }
      }
    });
  }

  /**
   * Print validation report to console
   */
  printReport(report: ValidationReport): void {
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Experience: ${this.experienceData.name} (${report.experienceId})`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (report.isValid) {
      console.log('✅ VALIDATION PASSED - Experience is completable!\n');
    } else {
      console.log('❌ VALIDATION FAILED - Issues found!\n');
    }

    // Print errors
    if (report.errors.length > 0) {
      console.log(`🔴 ERRORS (${report.errors.length}):`);
      report.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. [${err.category}] ${err.message}`);
        if (err.details) {
          console.log(`     Details: ${JSON.stringify(err.details)}`);
        }
      });
      console.log('');
    }

    // Print warnings
    if (report.warnings.length > 0) {
      console.log(`⚠️  WARNINGS (${report.warnings.length}):`);
      report.warnings.forEach((warn, i) => {
        console.log(`  ${i + 1}. [${warn.category}] ${warn.message}`);
      });
      console.log('');
    }

    // Print info
    if (report.info.length > 0) {
      console.log(`ℹ️  INFO (${report.info.length}):`);
      report.info.forEach((info, i) => {
        console.log(`  ${i + 1}. [${info.category}] ${info.message}`);
      });
      console.log('');
    }

    // Print reachability summary
    console.log('📊 REACHABILITY ANALYSIS:');
    console.log(`  Reachable Items: ${report.reachabilityAnalysis.reachableItems.size}`);
    console.log(`  Unreachable Items: ${report.reachabilityAnalysis.unreachableItems.size}`);
    console.log(`  Reachable Triggers: ${report.reachabilityAnalysis.reachableTriggers.size}`);
    console.log('');

    console.log('═══════════════════════════════════════════════════════════\n');
  }
}
