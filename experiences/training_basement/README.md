# Training Basement - Escape Room Experience

## Overview
**Difficulty:** BEGINNER
**Estimated Duration:** 10-15 minutes
**Theme:** Tutorial/Training
**Rooms:** 1

## Story

You wake up in a dimly lit basement. The door at the top of the stairs is locked. This appears to be some kind of training facility - there are notes and hints scattered around. Someone wants you to learn how to escape. Time to put your puzzle-solving skills to the test.

## Room Description

### The Basement
A small, concrete basement with fluorescent lighting. The room is sparsely furnished with basic items. A metal door at the top of the stairs is your only way out. The air smells musty, and you can hear the hum of the ventilation system.

## Walkthrough

### Initial State
- Player starts in the basement
- Can see: desk, filing cabinet, poster on wall, exit door (locked)
- Objective: Find the code to unlock the exit door

### Solution Path

1. **Examine the poster**
   - A motivational poster that says "START HERE" with an arrow pointing down
   - Reveals a clue: "The filing cabinet holds the first key"

2. **Open the top drawer of the filing cabinet** (unlocked)
   - Find a brass key inside

3. **Use the brass key on the desk's locked drawer**
   - Opens the middle drawer
   - Find a note inside with partial code: "Exit code starts with: 4-2-_-_"

4. **Examine the desk lamp**
   - Notice it has numbers etched on the base: "1-7"
   - These are the missing numbers for the exit code

5. **Combine the information**
   - Full code is: 4-2-1-7

6. **Enter code 4217 into the exit door keypad**
   - Door unlocks
   - Escape successful!

## Puzzles

### Puzzle 1: Find the Physical Key
- **Type:** Examination + Container
- **Difficulty:** Very Easy
- **Solution:** Examine poster for hint, open filing cabinet, retrieve key

### Puzzle 2: Unlock the Desk Drawer
- **Type:** Physical Lock
- **Difficulty:** Very Easy
- **Solution:** Use brass key on desk drawer

### Puzzle 3: Decode the Exit Code
- **Type:** Information Assembly
- **Difficulty:** Easy
- **Solution:** Combine partial code from note with numbers from lamp

### Puzzle 4: Exit the Room
- **Type:** Keypad Lock
- **Difficulty:** Very Easy
- **Solution:** Enter 4-2-1-7 on exit door keypad

## Learning Objectives

This training room teaches players:
1. How to **examine** items for clues
2. How to **open containers** to find items
3. How to **use keys** on locks
4. How to **combine information** from multiple sources
5. How to **enter codes** on keypads

## Items

### Interactive Items
1. **Desk** - 3 drawers (top unlocked, middle locked, bottom empty)
2. **Filing Cabinet** - 2 drawers (top unlocked with key inside, bottom empty)
3. **Desk Lamp** - Has numbers etched on base
4. **Exit Door** - Locked with keypad (code: 4217)
5. **Motivational Poster** - Contains hint about filing cabinet

### Decorative Items
1. **Ventilation Grate** - Just for atmosphere
2. **Concrete Floor** - No interaction
3. **Fluorescent Lights** - No interaction

## Keys

1. **Brass Key** - Opens desk middle drawer (Physical Key)
2. **Partial Code Note** - Contains "4-2-_-_" (Numeric Code)
3. **Lamp Numbers** - Contains "1-7" (Clue)
4. **Poster Hint** - Directs to filing cabinet (Clue)

## Triggers

1. **Examine Poster Trigger** - Reveals hint about filing cabinet
2. **Filing Cabinet Top Drawer** - Contains brass key (no trigger needed)
3. **Desk Middle Drawer Lock** - Requires brass key (PadLock trigger)
4. **Examine Lamp Trigger** - Reveals numbers on base
5. **Exit Door Keypad** - Requires code 4217 (KeypadLock trigger)

## Trigger Chain

```
START
  ↓
Examine Poster → Hint: "Check filing cabinet"
  ↓
Open Filing Cabinet Top Drawer → Brass Key acquired
  ↓
Use Brass Key on Desk Middle Drawer → Opens drawer
  ↓
Read Note in Drawer → Partial Code: "4-2-_-_"
  ↓
Examine Desk Lamp → Numbers: "1-7"
  ↓
Combine Information → Full Code: "4-2-1-7"
  ↓
Enter Code on Exit Door → Door Unlocks
  ↓
EXIT SUCCESS
```

## Red Herrings

- **Bottom drawer of filing cabinet** - Empty, teaches players not everything contains items
- **Bottom drawer of desk** - Empty
- **Ventilation grate** - Looks interesting but can't be interacted with

## Completion Criteria

- Exit door is unlocked
- Player moves through exit door
- Success message: "Congratulations! You've completed the training. You're ready for the real challenges ahead."

## Design Notes

This is an intentionally simple experience designed to:
- Introduce core game mechanics
- Build player confidence
- Establish the pattern of examination → item collection → lock solving
- Teach information combining
- Be completable in under 15 minutes even for new players
