# Usage Example - Escape Room System

This document demonstrates how to use the object handler classes to load and manage an escape room experience.

## Basic Setup

```typescript
import { experienceManager } from './src/services/ExperienceManager';
import { stateManager } from './src/services/StateManager';
import { ExperienceValidator } from './src/utils/validators';

// Load the Training Basement experience
const trainingBasementData = require('./experiences/training_basement/experience.json');
```

## Loading an Experience

```typescript
// Load the experience
const experience = await experienceManager.loadExperience(trainingBasementData);

// Validate the experience
const validationResult = ExperienceValidator.validateExperience(experience);
if (!validationResult.valid) {
  console.error('Experience validation failed:', validationResult.errors);
  return;
}

// Set up the state manager
stateManager.setExperience(experience);

// Start the game
experience.startGame();
```

## Game Loop Example

```typescript
// Subscribe to state changes
stateManager.subscribe('stateChange', (change) => {
  console.log(`State changed: ${change.description}`);
});

stateManager.subscribe('itemExamined', ({ itemId, description }) => {
  console.log(`Examined: ${description}`);
});

stateManager.subscribe('keyUsed', ({ keyId, triggerId, result }) => {
  if (result.success) {
    console.log('Trigger activated successfully!');
  }
});

// Example gameplay sequence
async function playGame() {
  // 1. Examine the poster
  const examineResult = stateManager.examineItem('motivational_poster');
  console.log(examineResult.description);
  // Output: "A poster with bold text: 'START HERE'..."

  // 2. Open the filing cabinet
  const openResult = stateManager.openContainer('filing_cabinet_top');
  if (openResult.success) {
    console.log(`Found ${openResult.items?.length} items`);
  }

  // 3. Take the brass key
  const takeResult = stateManager.takeItem('brass_key', 'filing_cabinet_top');
  if (takeResult.success) {
    console.log(`Acquired: ${takeResult.key?.name}`);
  }

  // 4. Use the brass key on the desk drawer
  const useKeyResult = stateManager.useKey('brass_key', 'desk_middle_drawer_lock');
  if (useKeyResult.success) {
    console.log('Drawer unlocked!');
  }

  // 5. Open the desk drawer
  const drawerResult = stateManager.openContainer('desk_drawer_middle');
  console.log(`Found: ${drawerResult.items?.map(i => i.name).join(', ')}`);

  // 6. Take the partial code note
  stateManager.takeItem('partial_code_note', 'desk_drawer_middle');

  // 7. Examine the lamp
  const lampResult = stateManager.examineItem('desk_lamp');
  console.log(lampResult.description);
  // Output: "...you notice numbers etched into the base: '1-7'"

  // 8. Enter the complete code
  const codeResult = stateManager.enterCode('exit_door_keypad', '4217');
  if (codeResult.success) {
    console.log('Exit door unlocked! You escaped!');
    experience.completeGame();
  }

  // Get statistics
  const stats = stateManager.getStatistics();
  console.log('Game Statistics:', stats);
  // Output: { turnCount: 8, keysAcquired: 3, playTime: 125, ... }
}
```

## Saving and Loading Progress

```typescript
// Save progress
await experienceManager.saveProgress();

// Check if a save exists
const hasSave = await experienceManager.hasSave('training_basement');

// Load saved progress
if (hasSave) {
  await experienceManager.loadProgress('training_basement');
  console.log('Progress loaded!');
}

// Delete a save
await experienceManager.deleteSave('training_basement');
```

## Querying Game State

```typescript
// Get current room
const currentRoom = experience.getCurrentRoom();
console.log(`You are in: ${currentRoom?.name}`);

// Get visible items
const visibleItems = currentRoom?.getVisibleItems();
console.log('You can see:', visibleItems?.map(i => i.name).join(', '));

// Get acquired keys
const keys = experience.getAcquiredKeys();
console.log('Your keys:', keys.map(k => k.name).join(', '));

// Get activated triggers
const activatedTriggers = experience.globalState.triggersActivated;
console.log(`Activated ${activatedTriggers.length} triggers`);

// Get state history
const history = stateManager.getStateHistory();
history.forEach(change => {
  console.log(`Turn ${change.turn}: ${change.description}`);
});
```

## Validating Actions Before Execution

```typescript
import { StateUpdateValidator } from './src/utils/validators';

// Check if an item can be examined
const item = currentRoom.findItem('desk_lamp');
if (item) {
  const validation = StateUpdateValidator.canExamineItem(item);
  if (validation.valid) {
    stateManager.examineItem('desk_lamp');
  } else {
    console.error('Cannot examine:', validation.errors);
  }
}

// Check if a key can be used
const key = experience.getKey('brass_key');
const trigger = experience.getTrigger('desk_middle_drawer_lock');
if (key && trigger) {
  const validation = StateUpdateValidator.canUseKey(key, trigger);
  if (validation.valid) {
    stateManager.useKey('brass_key', 'desk_middle_drawer_lock');
  } else {
    console.error('Cannot use key:', validation.errors);
  }
}
```

## React Component Integration Example

```typescript
import React, { useEffect, useState } from 'react';
import { experienceManager, stateManager } from '../services';

const GameScreen = () => {
  const [experience, setExperience] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load experience
    const loadGame = async () => {
      const data = require('../experiences/training_basement/experience.json');
      const exp = await experienceManager.loadExperience(data);
      stateManager.setExperience(exp);
      exp.startGame();
      setExperience(exp);
      setCurrentRoom(exp.getCurrentRoom());
    };

    loadGame();

    // Subscribe to state changes
    const unsubscribe = stateManager.subscribe('stateChange', (change) => {
      setMessage(change.description);
      setCurrentRoom(experience?.getCurrentRoom() || null);
    });

    return () => unsubscribe();
  }, []);

  const handleExamine = (itemId) => {
    const result = stateManager.examineItem(itemId);
    if (result.success) {
      setMessage(result.description);
    }
  };

  const handleTake = (itemId, containerId) => {
    const result = stateManager.takeItem(itemId, containerId);
    setMessage(result.message);
  };

  const handleEnterCode = (triggerId, code) => {
    const result = stateManager.enterCode(triggerId, code);
    setMessage(result.message);

    if (result.success && experience?.checkCompletion()) {
      experience.completeGame();
      setMessage('Congratulations! You escaped!');
    }
  };

  return (
    <View>
      <Text>{currentRoom?.name}</Text>
      <Text>{currentRoom?.longDescription}</Text>
      <Text>{message}</Text>

      {currentRoom?.getVisibleItems().map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleExamine(item.id)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

## Export/Import Experience State

```typescript
// Export current state as JSON
const stateJson = experienceManager.exportState();
console.log('Exported state:', stateJson);

// Save to file or send to server
await fetch('https://api.example.com/save', {
  method: 'POST',
  body: stateJson,
  headers: { 'Content-Type': 'application/json' }
});

// Import state from JSON
const imported = await fetch('https://api.example.com/load');
const stateData = await imported.text();
await experienceManager.importState(stateData);
```

## Complete Walkthrough Example

```typescript
async function completeTrainingBasement() {
  // Load and start
  const data = require('./experiences/training_basement/experience.json');
  const experience = await experienceManager.loadExperience(data);
  stateManager.setExperience(experience);
  experience.startGame();

  console.log(experience.storyIntro);

  // Step 1: Examine poster
  stateManager.examineItem('motivational_poster');

  // Step 2: Get brass key
  stateManager.openContainer('filing_cabinet_top');
  stateManager.takeItem('brass_key', 'filing_cabinet_top');

  // Step 3: Unlock desk drawer
  stateManager.useKey('brass_key', 'desk_middle_drawer_lock');

  // Step 4: Get partial code
  stateManager.openContainer('desk_drawer_middle');
  stateManager.takeItem('partial_code_note', 'desk_drawer_middle');

  // Step 5: Examine lamp for remaining digits
  stateManager.examineItem('desk_lamp');

  // Step 6: Enter complete code
  const result = stateManager.enterCode('exit_door_keypad', '4217');

  if (result.success) {
    experience.completeGame();
    console.log(experience.storyOutro);

    const stats = stateManager.getStatistics();
    console.log(`Completed in ${stats.turnCount} turns`);
    console.log(`Play time: ${stats.playTime} seconds`);

    // Save completion
    await experienceManager.saveProgress();
  }
}
```

## Key Concepts

### Models
- **Experience**: Top-level container for the entire escape room
- **Room**: Contains items, connections, and metadata
- **Item**: Objects that can be examined, opened, or taken
- **Trigger**: Mechanisms that unlock progression (locks, puzzles, etc.)
- **Key**: Objects or information that activate triggers

### Services
- **ExperienceManager**: Loads experiences from JSON, saves/loads progress
- **StateManager**: Tracks state changes, handles player actions, emits events

### Utilities
- **ExperienceValidator**: Validates experience structure and completability
- **StateUpdateValidator**: Validates individual player actions before execution

### State Flow
```
Load Experience → Validate → Start Game
    ↓
Player Action → StateManager → Update State → Emit Events
    ↓
Check Completion → Save Progress
```
