/**
 * Helper utilities for working with Experience data dynamically
 */

import { Experience } from '../models/Experience';
import { Room } from '../models/Room';
import { Item } from '../models/Item';

/**
 * Get displayable items from a room (only visible, interactive items)
 */
export function getRoomDisplayItems(room: Room): Item[] {
  return room.items.filter(item => item.isVisible && item.isInteractive);
}

/**
 * Get examination details for an item
 */
export function getItemExaminationData(item: Item, inventory: any[], experience?: Experience) {
  const data: any = {
    name: item.name,
    description: item.description,
    actions: [],
  };

  // Check if this item has an examination trigger
  if (item.examineTrigger && experience) {
    const trigger = experience.getTrigger(item.examineTrigger);
    if (trigger && !trigger.isActivated) {
      data.actions.push({
        id: 'examine_trigger',
        label: 'Examine closely',
        triggerId: item.examineTrigger,
      });
    }
  } else if (item.isExaminable && item.category !== 'DOOR' && item.category !== 'CONTAINER' && item.category !== 'FURNITURE') {
    // Add generic examination action (but not for doors/containers/furniture - they have specific actions)
    data.actions.push({
      id: 'examine',
      label: 'Examine closely',
    });
  }

  // Container actions (but not for furniture - furniture has drawer-specific actions)
  if (item.category === 'CONTAINER' && item.category !== 'FURNITURE') {
    if (item.isLocked) {
      // Check if this is a keypad lock
      const trigger = item.lockTriggerId && experience ? experience.getTrigger(item.lockTriggerId) : null;
      const isKeypadLock = trigger && (trigger as any).type === 'KeypadLock';

      if (isKeypadLock) {
        // Keypad locks can always be attempted
        data.actions.push({
          id: 'unlock',
          label: 'Unlock',
          disabled: false,
          triggerId: item.lockTriggerId,
        });
      } else {
        // Check if player has the physical key
        const hasKey = item.lockTriggerId ? checkHasKeyForTrigger(item.lockTriggerId, inventory) : false;

        if (hasKey) {
          data.actions.push({
            id: 'unlock',
            label: 'Unlock',
            disabled: false,
          });
        } else {
          data.actions.push({
            id: 'try_open',
            label: 'Try to open (locked)',
            disabled: true,
          });
        }
      }
    } else {
      data.actions.push({
        id: 'open',
        label: 'Open',
      });
    }
  }

  // Furniture with drawers - show drawer access (replaces generic container actions)
  if (item.category === 'FURNITURE' && item.containedItems && item.containedItems.length > 0) {
    // Add actions for each drawer/compartment
    item.containedItems.forEach((drawer: any, index: number) => {
      if (drawer.isLocked) {
        // Check if this is a keypad lock
        const trigger = drawer.lockTriggerId && experience ? experience.getTrigger(drawer.lockTriggerId) : null;
        const isKeypadLock = trigger && (trigger as any).type === 'KeypadLock';

        if (isKeypadLock) {
          // Keypad locks can always be attempted
          data.actions.push({
            id: `unlock_drawer_${drawer.id}`,
            label: `Unlock ${drawer.name}`,
            drawerId: drawer.id,
            triggerId: drawer.lockTriggerId,
          });
        } else {
          // Check if player has the physical key
          const hasKey = drawer.lockTriggerId ? checkHasKeyForTrigger(drawer.lockTriggerId, inventory) : false;
          if (hasKey) {
            data.actions.push({
              id: `unlock_drawer_${drawer.id}`,
              label: `Unlock ${drawer.name}`,
              drawerId: drawer.id,
            });
          } else {
            data.actions.push({
              id: `check_drawer_${drawer.id}`,
              label: `Check ${drawer.name} (locked)`,
              drawerId: drawer.id,
            });
          }
        }
      } else {
        data.actions.push({
          id: `open_drawer_${drawer.id}`,
          label: `Open ${drawer.name}`,
          drawerId: drawer.id,
        });
      }
    });
  }

  // Door actions
  if (item.category === 'DOOR') {
    if (item.isLocked) {
      const hasKey = item.lockTriggerId ? checkHasKeyForTrigger(item.lockTriggerId, inventory) : false;

      // Check if this is a keypad lock
      if (item.lockTriggerId && (item.lockTriggerId.includes('keypad') || item.lockTriggerId.includes('code'))) {
        data.actions.push({
          id: 'enter_code',
          label: 'Enter code on keypad',
          triggerId: item.lockTriggerId,
        });
      } else if (hasKey) {
        data.actions.push({
          id: 'unlock_door',
          label: 'Unlock door',
        });
      } else {
        data.actions.push({
          id: 'examine_lock',
          label: 'Examine lock',
        });
      }
    } else {
      // Door is unlocked, can go through
      if ((item as any).leadsTo) {
        data.actions.push({
          id: 'go_through_door',
          label: 'Go through door',
          leadsTo: (item as any).leadsTo,
        });
      }
      data.actions.push({
        id: 'examine',
        label: 'Examine door',
      });
    }
  }

  // Portable items
  if (item.isPortable) {
    data.actions.push({
      id: 'take',
      label: 'Take item',
    });
  }

  // Items with surface items
  if (item.surfaceItems && item.surfaceItems.length > 0) {
    data.actions.push({
      id: 'search_surface',
      label: 'Search surface',
    });
  }

  return data;
}

/**
 * Check if player has a key for a specific trigger
 */
function checkHasKeyForTrigger(triggerId: string, inventory: any[]): boolean {
  // This would need to look up the trigger and see what key it requires
  // For now, just check if any key in inventory matches common patterns
  return inventory.some(key => {
    return key.associatedTriggerId === triggerId;
  });
}

/**
 * Generate generic action handlers for common interactions
 */
export function handleGenericAction(
  actionId: string,
  itemId: string,
  room: Room,
  stateManagerCallbacks: {
    examineItem: (id: string) => any;
    openContainer: (id: string) => any;
    takeItem: (id: string, containerId?: string) => any;
    useKey: (keyId: string, triggerId: string) => any;
    enterCode: (triggerId: string, code: string) => any;
  },
  inventory: any[]
): { type: string; message?: string; openKeypad?: boolean; triggerId?: string } {
  const item = room.findItem(itemId);

  if (!item) {
    return { type: 'error', message: 'Item not found' };
  }

  // Handle drawer-specific actions
  if (actionId.startsWith('open_drawer_')) {
    const drawerId = actionId.replace('open_drawer_', '');
    const openResult = stateManagerCallbacks.openContainer(drawerId);
    if (openResult.success) {
      if (openResult.items && openResult.items.length > 0) {
        const itemNames = openResult.items.map((i: any) => i.name).join(', ');

        // Auto-take portable items
        openResult.items.forEach((foundItem: any) => {
          if (foundItem.isPortable) {
            stateManagerCallbacks.takeItem(foundItem.id, drawerId);
          }
        });

        return {
          type: 'alert',
          message: `You open the drawer and find: ${itemNames}`
        };
      } else {
        return {
          type: 'alert',
          message: `You open the drawer. It's empty.`
        };
      }
    }
    return { type: 'alert', message: 'Unable to open drawer.' };
  }

  if (actionId.startsWith('unlock_drawer_')) {
    const drawerId = actionId.replace('unlock_drawer_', '');
    const drawer = room.findItem(drawerId);
    if (drawer && drawer.lockTriggerId) {
      const key = inventory.find(k => k.associatedTriggerId === drawer.lockTriggerId);
      if (key) {
        const unlockResult = stateManagerCallbacks.useKey(key.id, drawer.lockTriggerId);
        if (unlockResult.success) {
          // Now try to open it
          const openResult = stateManagerCallbacks.openContainer(drawerId);
          if (openResult.success && openResult.items && openResult.items.length > 0) {
            const itemNames = openResult.items.map((i: any) => i.name).join(', ');

            // Auto-take portable items
            openResult.items.forEach((foundItem: any) => {
              if (foundItem.isPortable) {
                stateManagerCallbacks.takeItem(foundItem.id, drawerId);
              }
            });

            return {
              type: 'alert',
              message: `You unlock and open the drawer with the ${key.name}. Inside you find: ${itemNames}`
            };
          }
          return {
            type: 'alert',
            message: `You unlock the drawer with the ${key.name}. It's empty.`
          };
        }
      }
    }
    return { type: 'alert', message: 'Unable to unlock drawer.' };
  }

  if (actionId.startsWith('check_drawer_')) {
    return {
      type: 'alert',
      message: 'This drawer is locked. You need a key.'
    };
  }

  switch (actionId) {
    case 'examine_trigger':
      // This item has an examination trigger - activate it
      const triggerId = (item as any).examineTrigger;
      if (triggerId) {
        const triggerResult = stateManagerCallbacks.examineItem(itemId);

        // Extract the information from trigger rewards
        if (triggerResult.triggers && triggerResult.triggers.length > 0) {
          const trigger = triggerResult.triggers[0];
          if (trigger.rewards) {
            const infoReward = trigger.rewards.find((r: any) => r.type === 'InformationReward');
            if (infoReward && infoReward.content) {
              return {
                type: 'alert',
                message: infoReward.content
              };
            }
          }
        }

        // Fallback if no specific reward content
        return {
          type: 'alert',
          message: triggerResult.description || 'You examine the item more closely and notice something interesting.'
        };
      }
      return { type: 'alert', message: 'Nothing special to see.' };

    case 'examine':
      const examineResult = stateManagerCallbacks.examineItem(itemId);
      return {
        type: 'alert',
        message: item.description || 'You examine the item closely.'
      };

    case 'open':
      const openResult = stateManagerCallbacks.openContainer(itemId);
      if (openResult.success) {
        if (openResult.items && openResult.items.length > 0) {
          const itemNames = openResult.items.map((i: any) => i.name).join(', ');

          // Auto-take portable items
          openResult.items.forEach((foundItem: any) => {
            if (foundItem.isPortable) {
              stateManagerCallbacks.takeItem(foundItem.id, itemId);
            }
          });

          return {
            type: 'alert',
            message: `You open the ${item.name}. Inside you find: ${itemNames}`
          };
        } else {
          return {
            type: 'alert',
            message: `You open the ${item.name}. It's empty.`
          };
        }
      }
      return { type: 'alert', message: 'Unable to open.' };

    case 'take':
      const takeResult = stateManagerCallbacks.takeItem(itemId);
      if (takeResult.success) {
        return {
          type: 'alert',
          message: `You take the ${item.name}.`
        };
      }
      return { type: 'alert', message: takeResult.message || 'Unable to take item.' };

    case 'unlock':
      if (item.lockTriggerId) {
        // Find the key in inventory for this trigger
        const key = inventory.find(k => k.associatedTriggerId === item.lockTriggerId);
        if (key) {
          const unlockResult = stateManagerCallbacks.useKey(key.id, item.lockTriggerId);
          if (unlockResult.success) {
            return {
              type: 'alert',
              message: `You unlock the ${item.name} with the ${key.name}.`
            };
          }
        }
      }
      return { type: 'alert', message: 'Unable to unlock.' };

    case 'unlock_door':
      if (item.lockTriggerId) {
        const key = inventory.find(k => k.associatedTriggerId === item.lockTriggerId);
        if (key) {
          const unlockResult = stateManagerCallbacks.useKey(key.id, item.lockTriggerId);
          if (unlockResult.success) {
            return {
              type: 'alert',
              message: `The ${key.name} fits! The ${item.name} unlocks.`
            };
          }
        }
      }
      return { type: 'alert', message: 'You need a key to unlock this door.' };

    case 'enter_code':
      if (item.lockTriggerId) {
        return {
          type: 'keypad',
          openKeypad: true,
          triggerId: item.lockTriggerId
        };
      }
      return { type: 'alert', message: 'No keypad found.' };

    case 'examine_lock':
      return {
        type: 'alert',
        message: `The lock appears to need a key. ${item.description || ''}`
      };

    case 'try_open':
      return {
        type: 'alert',
        message: `The ${item.name} is locked.`
      };

    case 'search_surface':
      if (item.surfaceItems && item.surfaceItems.length > 0) {
        const surfaceItemNames = item.surfaceItems.map(i => i.name).join(', ');
        return {
          type: 'alert',
          message: `On the ${item.name} you see: ${surfaceItemNames}`
        };
      }
      return { type: 'alert', message: 'Nothing on the surface.' };

    case 'go_through_door':
      // Return a special type indicating room change is needed
      if ((item as any).leadsTo) {
        return {
          type: 'change_room',
          roomId: (item as any).leadsTo,
          message: `You go through the ${item.name}...`
        };
      }
      return { type: 'alert', message: 'This door doesn\'t lead anywhere.' };

    default:
      return { type: 'alert', message: `Action "${actionId}" not implemented yet.` };
  }
}
