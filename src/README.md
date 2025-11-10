# Escape Room System - Implementation

A complete TypeScript implementation of the object-oriented escape room game system with state management, validation, and persistence.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Experience                        │
│  - Rooms, Triggers, Keys, Global State             │
└────────────┬──────────────────────────┬────────────┘
             │                          │
   ┌─────────▼──────────┐    ┌──────────▼─────────┐
   │  ExperienceManager │    │    StateManager    │
   │  - Load/Save       │    │  - Actions         │
   │  - Persistence     │    │  - Events          │
   └────────────────────┘    │  - History         │
                             └────────────────────┘
```

## Directory Structure

```
src/
├── models/
│   ├── Key.ts              # Key system (Physical, Digital, etc.)
│   ├── Trigger.ts          # Trigger system (Locks, Puzzles)
│   ├── Item.ts             # Item system (Furniture, Containers)
│   ├── Room.ts             # Room container
│   ├── Experience.ts       # Top-level experience
│   └── index.ts            # Exports
│
├── services/
│   ├── ExperienceManager.ts  # Load/Save experiences
│   ├── StateManager.ts       # State management & actions
│   └── index.ts              # Exports
│
├── utils/
│   ├── validators.ts        # Validation utilities
│   └── index.ts             # Exports
│
└── README.md                # This file
```

## Core Classes

### Models

#### **Key** (Abstract Base Class)
Base class for all key types. Keys are objects or information that unlock triggers.

**Subclasses:**
- `PhysicalKey` - Traditional metal keys
- `NumericCode` - PIN codes and combinations
- `ClueKey` - Hints and information

**Key Features:**
- Acquisition tracking (from where, when)
- Red herring support
- Consumption logic
- Theme overrides

#### **Trigger** (Abstract Base Class)
Base class for all trigger mechanisms. Triggers are puzzles/locks that must be solved.

**Subclasses:**
- `KeypadLock` - Numeric code entry
- `PadLock` - Requires physical key
- `ExaminationTrigger` - Activated by examining

**Key Features:**
- Condition checking
- Reward distribution
- Success/failure messages
- Attempt tracking

#### **Item** (Abstract Base Class)
Base class for all room objects. Items are things in rooms that players interact with.

**Subclasses:**
- `InactiveItem` - Decorative only
- `InteractiveItem` - Can be interacted with
- `Desk` - Specialized furniture
- `Cabinet` - Specialized container

**Key Features:**
- Nested items (containers within containers)
- Lock states
- Trigger associations
- Portable/fixed

#### **Room**
Container for items and connections to other rooms.

**Key Features:**
- Item management
- Room connections (doors, passages)
- Lighting and atmosphere
- Visit tracking

#### **Experience**
Top-level container for the entire escape room game.

**Key Features:**
- Multiple rooms
- Global state tracking
- Completion criteria
- Turn management

### Services

#### **ExperienceManager**
Service for loading, saving, and managing experiences.

**Methods:**
- `loadExperience(json)` - Load from JSON data
- `saveProgress()` - Save to AsyncStorage
- `loadProgress(id)` - Load saved game
- `deleteSave(id)` - Delete saved game
- `exportState()` - Export as JSON string
- `importState(json)` - Import from JSON
- `resetExperience()` - Reset to initial state

#### **StateManager**
Service for managing game state and player actions.

**Methods:**
- `examineItem(itemId)` - Examine an item
- `openContainer(containerId)` - Open a container
- `takeItem(itemId, containerId?)` - Take an item
- `useKey(keyId, triggerId)` - Use a key on a trigger
- `enterCode(triggerId, code)` - Enter a code
- `changeRoom(roomId)` - Move to another room
- `subscribe(event, callback)` - Subscribe to events
- `getStatistics()` - Get game stats
- `getStateHistory()` - Get action history

**Events:**
- `stateChange` - Any state change
- `itemExamined` - Item examined
- `containerOpened` - Container opened
- `itemTaken` - Item taken
- `keyUsed` - Key used on trigger
- `codeEntered` - Code entered on keypad
- `roomChanged` - Room changed

### Utilities

#### **ExperienceValidator**
Validates experience structure and completability.

**Methods:**
- `validateExperience(experience)` - Full validation
- `validateRoom(room)` - Validate room
- `validateItem(item)` - Validate item
- `validateTrigger(trigger)` - Validate trigger
- `validateKey(key)` - Validate key
- `checkCircularDependencies()` - Find circular refs
- `validateCompletability()` - Check if completable

#### **StateUpdateValidator**
Validates individual player actions before execution.

**Methods:**
- `canExamineItem(item)` - Check if examinable
- `canOpenContainer(item)` - Check if openable
- `canTakeItem(item)` - Check if takeable
- `canUseKey(key, trigger)` - Check if key works
- `canEnterRoom(room, fromRoom)` - Check if accessible

## Usage

### Basic Setup

```typescript
import { experienceManager, stateManager } from './services';

// Load experience
const data = require('../experiences/training_basement/experience.json');
const experience = await experienceManager.loadExperience(data);
stateManager.setExperience(experience);
experience.startGame();
```

### Player Actions

```typescript
// Examine an item
const result = stateManager.examineItem('poster');
console.log(result.description);

// Take an item
const takeResult = stateManager.takeItem('brass_key', 'filing_cabinet');
if (takeResult.success) {
  console.log('Got key:', takeResult.key?.name);
}

// Use a key
const useResult = stateManager.useKey('brass_key', 'desk_lock');
if (useResult.success) {
  console.log('Unlocked!');
}

// Enter a code
const codeResult = stateManager.enterCode('exit_door', '4217');
if (codeResult.success) {
  console.log('Door opened!');
}
```

### Event Handling

```typescript
// Subscribe to events
stateManager.subscribe('stateChange', (change) => {
  console.log(`${change.description}`);
});

stateManager.subscribe('keyUsed', ({ keyId, triggerId, result }) => {
  if (result.success) {
    console.log('Success!');
  }
});
```

### Saving Progress

```typescript
// Save
await experienceManager.saveProgress();

// Load
await experienceManager.loadProgress('training_basement');

// Delete
await experienceManager.deleteSave('training_basement');
```

## JSON Data Format

Experiences are defined in JSON files following this structure:

```json
{
  "experience": {
    "id": "training_basement",
    "name": "Training Basement",
    "difficulty": "BEGINNER",
    "rooms": [...],
    "triggers": [...],
    "keys": [...],
    "globalState": {...}
  }
}
```

See `experiences/training_basement/experience.json` for a complete example.

## Type Definitions

All classes are fully typed with TypeScript. Key types:

```typescript
// Enums
KeyType, KeyCategory, TriggerType, ItemCategory
DifficultyLevel, LightingCondition

// Interfaces
KeyConfig, TriggerConfig, ItemConfig, RoomConfig, ExperienceConfig
ValidationResult, StateChange, GameAction

// Classes
Key, Trigger, Item, Room, Experience
ExperienceManager, StateManager
```

## Extensibility

The system is designed for easy extension:

### Adding New Key Types

```typescript
export class BiometricKey extends Key {
  biometricType: string;

  constructor(config) {
    super({...config, type: KeyType.PHYSICAL_KEY});
    this.biometricType = config.biometricType;
  }

  canActivateTrigger(triggerId: string): boolean {
    // Custom logic
    return this.associatedTriggerId === triggerId;
  }
}
```

### Adding New Trigger Types

```typescript
export class VoiceRecognitionTrigger extends Trigger {
  requiredPhrase: string;

  constructor(config) {
    super({...config, type: TriggerType.VOICE_RECOGNITION});
    this.requiredPhrase = config.requiredPhrase;
  }

  checkCondition(input: string): boolean {
    return input.toLowerCase() === this.requiredPhrase.toLowerCase();
  }
}
```

### Adding New Item Types

```typescript
export class ComputerTerminal extends InteractiveItem {
  files: string[];
  powerState: boolean;

  constructor(config) {
    super(config);
    this.files = config.files || [];
    this.powerState = false;
  }

  powerOn() {
    this.powerState = true;
  }
}
```

## Testing

To test the implementation:

1. Load an experience
2. Validate it
3. Run through game actions
4. Check state changes
5. Save and load progress

```typescript
import { experienceManager, stateManager } from './services';
import { ExperienceValidator } from './utils';

async function test() {
  const data = require('../experiences/training_basement/experience.json');
  const exp = await experienceManager.loadExperience(data);

  // Validate
  const validation = ExperienceValidator.validateExperience(exp);
  console.assert(validation.valid, 'Validation failed');

  // Test gameplay
  stateManager.setExperience(exp);
  exp.startGame();

  const result = stateManager.examineItem('motivational_poster');
  console.assert(result.success, 'Examine failed');

  // Test save/load
  await experienceManager.saveProgress();
  const hasSave = await experienceManager.hasSave(exp.id);
  console.assert(hasSave, 'Save failed');
}
```

## Performance Considerations

- **Lazy Loading**: Items and triggers are only initialized when needed
- **State History**: Limited to last 100 changes (configurable)
- **Event System**: Efficient pub/sub with automatic cleanup
- **JSON Parsing**: Done once on load, cached in memory
- **Nested Search**: Optimized recursive item finding

## Best Practices

1. **Always validate** experiences before loading
2. **Subscribe to events** for UI updates
3. **Use validators** before actions to provide better UX
4. **Save frequently** to prevent data loss
5. **Clear history** periodically for long games
6. **Test trigger chains** to avoid deadlocks
7. **Provide hints** for complex puzzles

## Future Enhancements

Potential additions to the system:

- [ ] Undo/redo functionality
- [ ] Multiplayer support
- [ ] Real-time sync with server
- [ ] Procedural generation
- [ ] Achievement system
- [ ] Hint system with cost
- [ ] Timer challenges
- [ ] Leaderboards

## License

Part of the Escape Room project. See main LICENSE file.
