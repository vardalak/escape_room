# Escape Room Game - Concepts

## Trigger Mechanism System Design

### Overview
The core gameplay loop revolves around a flexible, object-oriented trigger system where players interact with various mechanisms to unlock progression chains. The system should be highly reusable across different rooms and themes while maintaining extensibility for specialized behaviors.

---

## Core Architecture

### Base Trigger Class
All triggers inherit from a base `Trigger` class with the following structure:

```typescript
abstract class Trigger {
  id: string
  name: string
  description: string
  isActivated: boolean
  isVisible: boolean
  requiredItems: string[]  // IDs of items needed to interact
  connectedTriggers: string[]  // IDs of triggers this one activates
  rewards: Reward[]  // What the player gets when activated
  hints: Hint[]  // Available hints for this trigger

  abstract checkCondition(): boolean
  abstract activate(): void
  abstract getInteractionPrompt(): string
}
```

---

## Trigger Types

### 1. **Lock-Based Triggers**
Physical or digital locks requiring specific input patterns or keys.

#### **KeypadLock**
- **Parameters:**
  - `code: string` - The correct code to unlock
  - `codeLength: number` - Number of digits required
  - `allowedAttempts: number` - Max attempts before lockout (optional)
  - `hintsOnFailure: boolean` - Show hints after failed attempts

- **Example Use Cases:**
  - Safe combination
  - Door access code
  - Security panel override

#### **PadLock**
- **Parameters:**
  - `requiredKey: string` - ID of physical key item needed
  - `keyType: string` - brass, iron, magnetic, skeleton, etc.

- **Example Use Cases:**
  - Locked drawer
  - Chained gate
  - Storage box

#### **ComboLock**
- **Parameters:**
  - `combination: number[]` - Array of numbers (e.g., [15, 23, 8])
  - `dialCount: number` - Number of dials (1-4 typically)
  - `minValue: number` - Minimum dial value
  - `maxValue: number` - Maximum dial value

- **Example Use Cases:**
  - Briefcase lock
  - Locker combination
  - Vault entrance

#### **WordLock**
- **Parameters:**
  - `solution: string` - The correct word
  - `letterCount: number` - Length of word
  - `letterOptions: string[][]` - Available letters per position (optional)
  - `caseSensitive: boolean`

- **Example Use Cases:**
  - Suitcase with letter dials
  - Puzzle box with word cipher
  - Encoded message lock

#### **MagneticLock**
- **Parameters:**
  - `requiredMagnet: string` - Specific magnetic key/card ID
  - `polarity: string` - north, south, or neutral
  - `strength: number` - Required magnetic strength

- **Example Use Cases:**
  - Electromagnetic door seal
  - Hidden compartment trigger
  - Security badge reader

#### **PatternLock**
- **Parameters:**
  - `pattern: number[][]` - Grid-based pattern (e.g., smartphone unlock)
  - `gridSize: {rows: number, cols: number}`
  - `allowRepeats: boolean`

- **Example Use Cases:**
  - Touch screen security
  - Symbol combination puzzle
  - Connect-the-dots mechanism

---

### 2. **Turn-Based Triggers**
Time or turn-dependent mechanisms that activate based on game progression.

#### **TurnCountTrigger**
- **Parameters:**
  - `triggerTurn: number` - Specific turn to activate
  - `exactTurn: boolean` - Must be exact turn vs minimum turn
  - `warningTurns: number[]` - Turns to show warnings before activation

- **Example Use Cases:**
  - Time bomb countdown
  - Scheduled event (guard rounds)
  - Poison gas release timer

#### **RecurringTurnTrigger**
- **Parameters:**
  - `frequency: number` - Activate every N turns
  - `startTurn: number` - When to begin counting
  - `endTurn: number` - When to stop (optional)
  - `offset: number` - Turn offset from start

- **Example Use Cases:**
  - Periodic hint system
  - Recurring power outage
  - Guard patrol pattern

#### **TurnRangeTrigger**
- **Parameters:**
  - `minTurn: number` - Earliest activation
  - `maxTurn: number` - Latest activation
  - `requiredActions: string[]` - Must complete within window

- **Example Use Cases:**
  - Escape deadline pressure
  - Limited time opportunities
  - Event windows

---

### 3. **Interaction-Based Triggers**
Requires specific player actions or interactions.

#### **PhoneExtensionTrigger**
- **Parameters:**
  - `correctExtension: string` - Phone number or extension
  - `responseAudio: string` - Audio file to play on success
  - `wrongNumberResponses: string[]` - Random responses for wrong numbers
  - `requiresDialTone: boolean` - Need to activate phone first

- **Example Use Cases:**
  - Call for help/hints
  - Access code delivery via recording
  - Story progression through conversations

#### **MediaPlayerTrigger**
- **Parameters:**
  - `mediaType: string` - cassette, CD, vinyl, USB, floppy, VHS
  - `correctMedia: string` - ID of correct media item
  - `playbackEffect: string` - What happens during playback
  - `requiresPower: boolean` - Needs electricity trigger first

- **Example Use Cases:**
  - Recorded message with clues
  - Music with cipher pattern
  - Video with visual puzzle

#### **SwitchCombinationTrigger**
- **Parameters:**
  - `switchCount: number` - Number of switches
  - `correctPattern: boolean[]` - Array of on/off states
  - `orderMatters: boolean` - Sequence vs final state
  - `resetOnError: boolean` - Reset all if one is wrong

- **Example Use Cases:**
  - Circuit breaker puzzle
  - Light pattern matching
  - Binary code input

#### **TerminalCommandTrigger**
- **Parameters:**
  - `correctCommand: string` - Exact command or regex pattern
  - `requiresLogin: boolean` - Need credentials first
  - `username: string` - Login username
  - `password: string` - Login password
  - `outputMessage: string` - Response on success
  - `availableCommands: string[]` - Commands that give feedback

- **Example Use Cases:**
  - Computer hacking puzzle
  - Database query challenge
  - System override sequence

#### **ItemCombinationTrigger**
- **Parameters:**
  - `requiredItems: string[]` - IDs of items to combine
  - `combinationOrder: boolean` - Order matters
  - `consumesItems: boolean` - Items used up on success
  - `resultingItem: string` - New item created (optional)

- **Example Use Cases:**
  - Chemical mixing puzzle
  - Tool assembly
  - Recipe completion

#### **SequenceActionTrigger**
- **Parameters:**
  - `actionSequence: string[]` - Ordered list of action IDs
  - `allowInterruption: boolean` - Can do other things between steps
  - `timeoutTurns: number` - Reset if not completed in time
  - `showProgress: boolean` - Display sequence progress

- **Example Use Cases:**
  - Ritual or ceremony steps
  - Multi-stage puzzle solving
  - Complex mechanism operation

---

### 4. **Environmental Triggers**
Activated by examining or manipulating the environment.

#### **ExaminationTrigger**
- **Parameters:**
  - `objectId: string` - What needs to be examined
  - `requiredPerception: number` - Skill check value
  - `revealsInformation: boolean` - Shows hidden data
  - `onceOnly: boolean` - Can only trigger once

- **Example Use Cases:**
  - Hidden message discovery
  - Secret compartment reveal
  - Clue identification

#### **ProximityTrigger**
- **Parameters:**
  - `triggerLocation: string` - Room or area ID
  - `requiredItem: string` - Must have specific item
  - `activationRadius: number` - How close player must be

- **Example Use Cases:**
  - Automatic door opener with key card
  - Metal detector activation
  - Motion sensor puzzle

---

## Reward System

### Reward Types
Each trigger can grant multiple rewards on activation:

#### **AccessReward**
- `unlocksDoor: string` - Door/passage ID
- `revealsRoom: string` - Hidden room becomes visible
- `grantsPermission: string` - Access level granted

#### **ItemReward**
- `itemId: string` - Item to grant player
- `quantity: number` - How many
- `itemLocation: string` - Where it appears (inventory vs world)

#### **InformationReward**
- `dataType: string` - hint, clue, code, map, pattern
- `content: string` - The actual information
- `mediaType: string` - text, image, audio, video
- `revealLocation: string` - Where info is displayed

#### **MediaReward**
- `mediaFile: string` - Audio/video file to play
- `autoPlay: boolean` - Starts automatically
- `skippable: boolean` - Can player skip it

#### **TriggerReward**
- `activatesTriggers: string[]` - IDs of triggers to enable
- `deactivatesTriggers: string[]` - IDs of triggers to disable
- `chainsToTrigger: string` - Immediately activates another trigger

---

## Trigger Chaining System

### Chain Types

#### **Sequential Chain**
Triggers must be activated in specific order:
```
Trigger A → Trigger B → Trigger C → Reward
```

#### **Parallel Chain**
Multiple triggers must all be activated (any order):
```
Trigger A ↘
Trigger B → Reward
Trigger C ↗
```

#### **Conditional Chain**
Different paths based on conditions:
```
Trigger A → [if condition X] → Trigger B → Reward 1
          → [if condition Y] → Trigger C → Reward 2
```

#### **Recursive Chain**
Triggers that enable more triggers in cascading fashion:
```
Trigger A → Reward (enables Trigger B, C)
Trigger B → Reward (enables Trigger D, E)
```

### Chain State Management
- **ChainProgress:** Track which triggers in a chain are complete
- **ChainReset:** Conditions that reset chain progress
- **ChainAlternatives:** Multiple valid solution paths
- **ChainDependencies:** Triggers that require others to be available

---

## Reusability & Theming

### Theme-Independent Properties
The base trigger logic remains constant across themes:
- Activation logic
- Validation rules
- Chain management
- Reward distribution

### Theme-Specific Customization
Each room/theme provides:
- **name:** Display name for the trigger
- **description:** Flavor text describing the mechanism
- **visualAssets:** Images/icons for the trigger
- **audioFeedback:** Sounds for interactions
- **successMessage:** Themed success text
- **failureMessage:** Themed failure text

### Example: KeypadLock Across Themes

**Spy Theme:**
```typescript
{
  type: "KeypadLock",
  name: "Security Terminal",
  description: "A sleek digital keypad guards the intel room",
  code: "1337",
  successMessage: "Access granted. Welcome, Agent."
}
```

**Horror Theme:**
```typescript
{
  type: "KeypadLock",
  name: "Asylum Door Lock",
  description: "Blood-stained numbers glow faintly in the dark",
  code: "1337",
  successMessage: "The door creaks open... what horrors lie beyond?"
}
```

**Sci-Fi Theme:**
```typescript
{
  type: "KeypadLock",
  name: "Airlock Override",
  description: "Holographic keypad controls the ship's airlock",
  code: "1337",
  successMessage: "Airlock sequence initiated. Pressurization complete."
}
```

---

## Advanced Features

### Hint System Integration
- **turnBasedHints:** Unlock hints after X turns
- **attemptBasedHints:** Show hints after failed attempts
- **progressiveHints:** Increasingly specific hints over time
- **hintCost:** Optional cost system (points, items, etc.)

### Dynamic Difficulty
- **attemptTracking:** Monitor player struggles
- **autoAdjustment:** Slightly modify difficulty based on performance
- **skillBasedUnlocks:** Reward clever thinking with shortcuts

### Puzzle Variety Mechanisms
- **Randomization:** Generate different codes/patterns per playthrough
- **RedHerrings:** False clues and dummy triggers
- **MultiSolution:** Multiple valid solution paths
- **HiddenOptional:** Secret triggers for completionists

---

## Example: Complex Trigger Chain Scenario

**"The Safe House" Puzzle:**

1. **ExaminationTrigger (Painting)** → Reveals UV light pattern
2. **ItemCombinationTrigger (Battery + Flashlight)** → Creates UV flashlight
3. **ProximityTrigger (Wall with UV flashlight)** → Reveals code: "ECHO"
4. **WordLock (Filing Cabinet)** with code "ECHO" → Grants key
5. **PadLock (Desk drawer)** with key → Grants cassette tape
6. **MediaPlayerTrigger (Tape player)** with cassette → Plays recording with numbers
7. **KeypadLock (Safe)** with numbers from recording → **Final Reward:** Documents + Exit key

This chain demonstrates:
- Sequential progression
- Item dependency
- Multiple trigger types
- Information revelation
- Physical and digital locks
- Media-based clues

---

## Implementation Considerations

### State Persistence
- Save trigger activation states
- Track chain progress
- Store player attempts and failures
- Preserve timer/turn counts

### Validation & Testing
- Ensure no unwinnable states
- Test all chain permutations
- Verify item dependencies
- Check for sequence-breaking exploits

### Player Feedback
- Clear interaction prompts
- Obvious success/failure states
- Progress indicators for complex chains
- Helpful error messages

### Performance
- Lazy loading of trigger logic
- Efficient state checks
- Minimal re-rendering on state changes
- Optimized chain evaluation

---

## Future Extensions

- **Multiplayer coordination triggers:** Requires multiple players to activate simultaneously
- **Asymmetric information triggers:** Different players see different clues
- **Real-time external triggers:** Integration with physical IoT devices
- **Procedural generation:** AI-generated trigger chains based on difficulty curve
- **Narrative branching:** Triggers that affect story outcomes
- **Meta-puzzles:** Triggers spanning multiple rooms/sessions

---

# Room & Item System Design

## Room Architecture

### Base Room Class
Rooms are containers for the game experience, containing items, triggers, and navigation connections.

```typescript
class Room {
  id: string
  name: string
  theme: string
  difficulty: DifficultyLevel  // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  parentExperience: string  // ID of the experience this room belongs to
  shortDescription: string  // Brief room summary (1-2 sentences)
  longDescription: string  // Detailed atmospheric description

  items: Item[]  // All objects in the room
  connectedRooms: RoomConnection[]  // Doors/passages to other rooms
  ambientAudio: string  // Background sound file
  lightingState: LightingCondition  // DARK, DIM, NORMAL, BRIGHT, FLICKERING

  isLocked: boolean
  isHidden: boolean  // Not visible until revealed
  isVisited: boolean
  turnEntered: number  // Track when player entered

  getVisibleItems(): Item[]
  getInteractiveItems(): Item[]
  getAvailableExits(): RoomConnection[]
}
```

### Difficulty Levels
```typescript
enum DifficultyLevel {
  BEGINNER = "beginner",        // 1-2 simple puzzles, clear hints
  INTERMEDIATE = "intermediate", // 3-5 puzzles, moderate complexity
  ADVANCED = "advanced",         // 5-8 puzzles, chaining required
  EXPERT = "expert"              // 10+ puzzles, complex chains, red herrings
}
```

### Room Connection
Doors and passages between rooms:
```typescript
class RoomConnection {
  id: string
  connectedRoomId: string
  direction: string  // "north", "south", "east", "west", "up", "down"
  name: string  // "Steel Door", "Hidden Passage", "Ventilation Shaft"
  description: string

  isLocked: boolean
  isHidden: boolean
  requiredTrigger: string  // Trigger ID that unlocks this connection

  canTraverse(): boolean
  getDescription(): string
}
```

---

## Experience Structure

### Multi-Room Experiences
An experience is a collection of rooms that form a complete escape scenario:

```typescript
class Experience {
  id: string
  name: string
  theme: string
  difficulty: DifficultyLevel
  estimatedDuration: number  // Minutes to complete

  rooms: Room[]
  startingRoomId: string
  finalRoomId: string

  storyIntro: string  // Opening narrative
  storyOutro: string  // Completion narrative

  globalState: ExperienceState  // Shared state across all rooms
  completionCriteria: CompletionRule[]
}
```

**Example Experience Structure:**
```
"The Heist" (Spy Theme)
├── Room 1: Lobby (BEGINNER)
├── Room 2: Security Office (INTERMEDIATE)
├── Room 3: Server Room (ADVANCED)
└── Room 4: Vault (EXPERT)
```

---

## Item System

### Base Item Class
Everything in a room is an item - both decorative and interactive.

```typescript
abstract class Item {
  id: string
  name: string
  description: string  // What player sees when examining
  category: ItemCategory

  isVisible: boolean
  isInteractive: boolean
  isExaminable: boolean
  isPortable: boolean  // Can be picked up

  position: {x: number, y: number}  // Position in room (for UI)
  visualAsset: string  // Image/sprite path

  triggers: Trigger[]  // Attached trigger mechanisms
  containedItems: Item[]  // Items inside this item (drawers, etc.)

  examine(): string
  interact(): InteractionResult
  getAvailableActions(): Action[]
}
```

### Item Categories
```typescript
enum ItemCategory {
  FURNITURE = "furniture",      // Desks, chairs, tables
  CONTAINER = "container",      // Drawers, boxes, cabinets
  DEVICE = "device",            // Computers, phones, TVs
  LOCK_MECHANISM = "lock",      // Safes, padlocks, keypads
  DOOR = "door",                // Connections between rooms
  DECORATIVE = "decorative",    // Posters, paintings, plants
  TOOL = "tool",                // Keys, screwdrivers, flashlights
  DOCUMENT = "document",        // Papers, notes, maps
  MEDIA = "media",              // Tapes, CDs, USB drives
  ELECTRICAL = "electrical",    // Switches, circuit panels
  SECURITY = "security"         // Cameras, sensors, alarms
}
```

---

## Inactive vs Interactive Items

### InactiveItem (Decorative)
Pure flavor objects with no gameplay function:

```typescript
class InactiveItem extends Item {
  constructor() {
    super()
    this.isInteractive = false
    this.triggers = []
  }

  // Only provides description
  // Can contain clues or red herrings in description text
}
```

**Examples:**
- **Poster:** "A faded movie poster for 'The Maltese Falcon' hangs crooked on the wall."
- **Plant:** "A wilted fern sits in the corner, its leaves brown and dry."
- **Coffee Mug:** "An empty mug with the logo 'World's Best Boss' sits on the desk."
- **Red Herring Poster:** "A poster showing 'The 12 Elements' - but only 11 are visible."

### InteractiveItem
Objects with attached triggers and gameplay mechanics:

```typescript
class InteractiveItem extends Item {
  triggers: Trigger[]
  state: ItemState  // Custom state object per item type

  constructor() {
    super()
    this.isInteractive = true
  }

  interact(): InteractionResult {
    // Check trigger conditions
    // Update state
    // Return feedback to player
  }
}
```

---

## Reusable Item Templates

### Base Item Templates
Generic items that can be extended with parameters:

#### **Desk Template**
```typescript
class Desk extends InteractiveItem {
  drawerCount: number
  hasLock: boolean
  surfaceItems: Item[]  // Items on top of desk

  constructor(config: DeskConfig) {
    super()
    this.drawerCount = config.drawerCount || 2
    this.hasLock = config.hasLock || false

    // Automatically create drawer sub-items
    for (let i = 0; i < this.drawerCount; i++) {
      this.containedItems.push(new Drawer({
        id: `${this.id}_drawer_${i}`,
        position: i
      }))
    }
  }
}
```

**Usage Examples:**
```typescript
// Simple 2-drawer desk
new Desk({
  id: "office_desk",
  name: "Executive Desk",
  description: "A mahogany desk with brass handles",
  drawerCount: 2,
  hasLock: false
})

// Complex 3-drawer desk with lock
new Desk({
  id: "secure_desk",
  name: "Security Chief's Desk",
  description: "A reinforced steel desk with a keypad lock",
  drawerCount: 3,
  hasLock: true,
  triggers: [new KeypadLock({code: "7245"})]
})
```

#### **Cabinet Template**
```typescript
class Cabinet extends InteractiveItem {
  shelfCount: number
  doorCount: number
  lockType: string  // none, key, combination, electronic
  materialType: string  // wood, metal, glass

  constructor(config: CabinetConfig) {
    super()
    this.shelfCount = config.shelfCount || 3
    this.doorCount = config.doorCount || 2
    this.lockType = config.lockType || "none"

    // Create shelves
    for (let i = 0; i < this.shelfCount; i++) {
      this.containedItems.push(new Shelf({
        id: `${this.id}_shelf_${i}`,
        position: i
      }))
    }
  }
}
```

#### **Computer Terminal Template**
```typescript
class ComputerTerminal extends InteractiveItem {
  requiresPassword: boolean
  username: string
  password: string
  operatingSystem: string  // DOS, Unix, Windows, Custom
  availableFiles: DigitalFile[]
  availablePrograms: Program[]

  powerState: boolean
  loginState: boolean

  constructor(config: TerminalConfig) {
    super()
    this.requiresPassword = config.requiresPassword
    this.operatingSystem = config.operatingSystem || "DOS"
    this.powerState = false
    this.loginState = false
  }

  powerOn(): void
  login(user: string, pass: string): boolean
  executeCommand(command: string): string
}
```

#### **Safe Template**
```typescript
class Safe extends InteractiveItem {
  lockType: string  // keypad, combination, biometric, key
  size: string  // small, medium, large
  material: string  // steel, titanium, reinforced

  contentItems: Item[]
  isOpen: boolean

  constructor(config: SafeConfig) {
    super()
    this.lockType = config.lockType
    this.size = config.size || "medium"
    this.isOpen = false

    // Attach appropriate lock trigger
    switch(this.lockType) {
      case "keypad":
        this.triggers.push(new KeypadLock(config.lockConfig))
        break
      case "combination":
        this.triggers.push(new ComboLock(config.lockConfig))
        break
      // etc.
    }
  }
}
```

---

## Item Extension System

### Parameterized Variations
Same base class with different configurations:

```typescript
// Base definition
const baseDesk = {
  category: ItemCategory.FURNITURE,
  isPortable: false,
  isExaminable: true
}

// Simple Desk (2 drawers)
const simpleDeskConfig = {
  ...baseDesk,
  drawerCount: 2,
  hasLock: false,
  surfaceItems: []
}

// Secure Desk (3 drawers with lock)
const secureDeskConfig = {
  ...baseDesk,
  drawerCount: 3,
  hasLock: true,
  lockType: "keypad",
  surfaceItems: ["phone", "lamp"]
}

// Executive Desk (4 drawers, multiple locks)
const executiveDeskConfig = {
  ...baseDesk,
  drawerCount: 4,
  hasLock: true,
  lockType: "key",
  secretCompartment: true,
  surfaceItems: ["computer", "phone", "photo_frame"]
}
```

### Specialized Subclasses
For unique functionality beyond configuration:

```typescript
class SecretCompartmentDesk extends Desk {
  secretCompartment: HiddenCompartment
  revealTrigger: ExaminationTrigger

  constructor(config: SecretDeskConfig) {
    super(config)

    // Add hidden compartment that's revealed by examination
    this.secretCompartment = new HiddenCompartment({
      id: `${this.id}_secret`,
      revealCondition: "examine_bottom"
    })

    this.revealTrigger = new ExaminationTrigger({
      objectId: this.id,
      revealsInformation: true,
      onceOnly: true
    })
  }

  // Override examine to check for secret
  examine(): string {
    let desc = super.examine()

    if (this.revealTrigger.checkCondition()) {
      desc += "\n\nWait... there's a hidden panel underneath!"
      this.secretCompartment.isVisible = true
    }

    return desc
  }
}
```

---

## Complex Item Examples

### Example 1: Multi-Component Desk
```typescript
const detectiveDesk = new Desk({
  id: "detective_desk",
  name: "Detective's Desk",
  description: "A worn wooden desk covered in case files and coffee stains",
  theme: "noir",
  drawerCount: 3,
  hasLock: true,

  // Drawer configurations
  drawers: [
    {
      id: "drawer_top",
      name: "Top Drawer",
      description: "Contains scattered pens and paperclips",
      isLocked: false,
      containedItems: ["pen", "paperclip", "red_herring_note"]
    },
    {
      id: "drawer_middle",
      name: "Middle Drawer",
      description: "A locked drawer with a small keyhole",
      isLocked: true,
      triggers: [new PadLock({requiredKey: "brass_key"})],
      containedItems: ["case_file", "photograph"]
    },
    {
      id: "drawer_bottom",
      name: "Bottom Drawer",
      description: "Deep drawer with a combination lock",
      isLocked: true,
      triggers: [new ComboLock({combination: [15, 23, 8]})],
      containedItems: ["revolver", "bullets", "evidence_bag"]
    }
  ],

  // Items on desk surface
  surfaceItems: [
    new InactiveItem({
      id: "coffee_mug",
      name: "Cold Coffee",
      description: "A half-empty mug of stale coffee"
    }),
    new InteractiveItem({
      id: "desk_phone",
      name: "Rotary Phone",
      description: "An old black rotary phone",
      triggers: [new PhoneExtensionTrigger({correctExtension: "4-7-2"})]
    }),
    new InactiveItem({
      id: "desk_lamp",
      name: "Desk Lamp",
      description: "A green banker's lamp, currently off"
    })
  ]
})
```

### Example 2: Circuit Panel
```typescript
const circuitPanel = new InteractiveItem({
  id: "breaker_panel",
  name: "Circuit Breaker Panel",
  description: "A metal panel with 8 breaker switches labeled A through H",
  category: ItemCategory.ELECTRICAL,

  triggers: [
    new SwitchCombinationTrigger({
      switchCount: 8,
      correctPattern: [true, false, true, true, false, false, true, false], // A, C, D, G on
      orderMatters: false,
      resetOnError: false,
      rewards: [
        new AccessReward({activatesTriggers: ["power_system"]}),
        new MediaReward({mediaFile: "power_on.mp3"})
      ]
    })
  ]
})
```

### Example 3: Bookshelf with Hidden Passage
```typescript
const bookshelf = new InteractiveItem({
  id: "library_bookshelf",
  name: "Antique Bookshelf",
  description: "A towering bookshelf filled with dusty tomes",
  category: ItemCategory.FURNITURE,

  containedItems: [
    new InactiveItem({
      id: "book_001",
      name: "War and Peace",
      description: "A thick book you'll never read"
    }),
    new InteractiveItem({
      id: "book_secret",
      name: "The Complete Works of Shakespeare",
      description: "Seems lighter than it should be...",
      triggers: [
        new ExaminationTrigger({
          objectId: "book_secret",
          revealsInformation: true,
          rewards: [
            new InformationReward({
              dataType: "clue",
              content: "The book is hollow! Inside is a lever."
            }),
            new AccessReward({activatesTriggers: ["bookshelf_passage"]})
          ]
        })
      ]
    })
    // ... more books
  ],

  triggers: [
    new SequenceActionTrigger({
      id: "bookshelf_passage",
      actionSequence: ["pull_shakespeare", "push_bookshelf"],
      rewards: [
        new AccessReward({revealsRoom: "hidden_study"})
      ]
    })
  ]
})
```

---

## Item-Room Integration

### Room Population
How items are added to rooms:

```typescript
const spyOffice = new Room({
  id: "spy_office",
  name: "Handler's Office",
  theme: "spy",
  difficulty: DifficultyLevel.INTERMEDIATE,
  parentExperience: "cold_war_heist",
  shortDescription: "A pristine office with Cold War era decor",
  longDescription: "The office is immaculate, almost suspiciously so. A large mahogany desk dominates the center, flanked by filing cabinets. A world map covers one wall, marked with colored pins. The air smells of cigarette smoke and paranoia.",

  items: [
    detectiveDesk,       // Interactive - multiple triggers
    circuitPanel,        // Interactive - switch puzzle
    bookshelf,           // Interactive - hidden passage

    // Decorative items
    new InactiveItem({
      id: "world_map",
      name: "World Map",
      description: "Pins mark various locations. Some patterns seem significant... or maybe not."  // Red herring
    }),
    new InactiveItem({
      id: "ashtray",
      name: "Ashtray",
      description: "Full of cigarette butts. The brand is 'Lucky Strike'."  // Clue: "Lucky" = hint
    })
  ],

  connectedRooms: [
    new RoomConnection({
      connectedRoomId: "hallway",
      direction: "south",
      name: "Office Door",
      isLocked: false
    }),
    new RoomConnection({
      connectedRoomId: "hidden_study",
      direction: "north",
      name: "Secret Passage",
      isHidden: true,
      requiredTrigger: "bookshelf_passage"
    })
  ]
})
```

---

## Reusability Strategy

### 1. Template Library
Create a library of base templates:

```
/templates
  /furniture
    - desk.ts (base desk class)
    - chair.ts
    - cabinet.ts
    - bookshelf.ts
  /devices
    - computer.ts
    - phone.ts
    - tv.ts
    - media_player.ts
  /locks
    - safe.ts
    - lock_box.ts
    - door.ts
  /decorative
    - poster.ts
    - plant.ts
    - art.ts
```

### 2. Theme Variants
Same template, different theming:

```typescript
// Spy theme desk
const spyDesk = createDesk({
  theme: "spy",
  name: "Handler's Desk",
  description: "Sleek metal desk with encrypted files",
  drawerCount: 3
})

// Horror theme desk
const horrorDesk = createDesk({
  theme: "horror",
  name: "Surgeon's Table",
  description: "Blood-stained medical table with rusty drawers",
  drawerCount: 3
})

// Same structure, different narrative!
```

### 3. Configuration-Driven Items
JSON/YAML configuration for rapid room creation:

```yaml
items:
  - type: Desk
    id: lab_desk
    name: "Research Desk"
    description: "A sterile white desk covered in lab notes"
    drawerCount: 2
    hasLock: true
    lockType: keypad
    lockCode: "2358"
    containedItems:
      - type: Document
        id: lab_notes
        content: "Experiment 47: Success!"

  - type: ComputerTerminal
    id: lab_computer
    requiresPassword: true
    username: "scientist"
    password: "fibonacci"
    files:
      - name: "project_x.txt"
        content: "The code is hidden in plain sight"
```

---

## Performance Considerations

### Lazy Item Loading
- Only load interactive items fully
- Decorative items use lightweight instances
- Defer trigger initialization until needed

### Item Pooling
- Reuse common item instances across rooms
- Share descriptions and assets
- Instance-specific state only

### State Optimization
- Track only changed item states
- Compress save data
- Diff-based state updates

---

## Summary

The Room & Item system provides:

1. **Hierarchical Structure:** Experience → Room → Item → Trigger
2. **Flexibility:** Inactive (decorative) vs Interactive (gameplay) items
3. **Reusability:** Template-based items with configurable parameters
4. **Extensibility:** Base classes can be extended for specialized behavior
5. **Theme-Agnostic:** Same items work across different themes with string swaps
6. **Rich Interactions:** Items can contain other items, have multiple triggers, and chain effects
7. **Red Herrings:** Decorative items can mislead players
8. **Scalability:** Easy to add new room types and item categories

This system allows designers to rapidly create new rooms by combining reusable item templates with unique configurations, maintaining consistency while enabling creativity.

---

# Key System Design

## Overview
Keys are the core progression mechanic - objects or information that unlock triggers. They can be physical items, digital codes, patterns, or abstract concepts. The system must be highly flexible to accommodate everything from traditional brass keys to complex data sequences.

---

## Base Key Class

```typescript
abstract class Key {
  id: string
  name: string
  description: string
  type: KeyType  // Maps to trigger types

  roomId: string  // Which room this key belongs to
  associatedTriggerId: string  // Which trigger this key activates

  isAcquired: boolean  // Has player obtained this key?
  isRedHerring: boolean  // Looks useful but isn't actually needed
  isHidden: boolean  // Not visible until revealed
  isConsumed: boolean  // Used up after activation (default: false)

  acquiredFrom: string  // Item ID or Trigger ID that granted this key
  acquiredTurn: number  // When was it acquired?

  visualAsset: string  // Icon/image for inventory
  category: KeyCategory

  // Optional overrides for thematic customization
  nameOverride?: string  // Custom display name
  descriptionOverride?: string  // Custom examination text

  abstract canActivateTrigger(triggerId: string): boolean
  abstract getUsageHint(): string
  abstract validateAgainstTrigger(trigger: Trigger): boolean
}
```

---

## Key Types & Categories

### KeyType Enum
Maps directly to trigger types:

```typescript
enum KeyType {
  // Physical Keys
  PHYSICAL_KEY = "physical_key",           // Traditional keys
  MAGNETIC_CARD = "magnetic_card",         // Keycards, badges
  TOOL = "tool",                           // Screwdrivers, lockpicks

  // Digital/Code Keys
  NUMERIC_CODE = "numeric_code",           // PIN codes, combinations
  WORD_CODE = "word_code",                 // Passwords, phrases
  PATTERN = "pattern",                     // Visual or sequential patterns
  COMMAND_SEQUENCE = "command_sequence",   // Terminal commands

  // Information Keys
  CLUE = "clue",                           // Hints about solutions
  MAP = "map",                             // Spatial information
  DOCUMENT = "document",                   // Papers with info

  // Media Keys
  MEDIA_ITEM = "media_item",               // Tapes, CDs, USB drives
  AUDIO_RECORDING = "audio_recording",     // Voice recordings

  // Abstract Keys
  PERMISSION = "permission",               // Access rights
  KNOWLEDGE = "knowledge",                 // Learned information
  SEQUENCE_STEP = "sequence_step"          // Part of multi-step solution
}
```

### KeyCategory Enum
Organizational grouping:

```typescript
enum KeyCategory {
  PHYSICAL = "physical",      // Tangible objects
  DIGITAL = "digital",        // Electronic/computational
  INFORMATION = "information", // Knowledge-based
  MEDIA = "media",            // Audio/video/data storage
  ABSTRACT = "abstract"       // Non-physical concepts
}
```

---

## Physical Key Types

### PhysicalKey
Traditional metal keys for locks:

```typescript
class PhysicalKey extends Key {
  keyMaterial: string  // brass, iron, steel, silver
  keyShape: string     // standard, skeleton, magnetic, custom
  keySize: string      // small, medium, large
  hasTag: boolean      // Key tag with label?
  tagText: string      // What's written on tag

  constructor(config: PhysicalKeyConfig) {
    super()
    this.type = KeyType.PHYSICAL_KEY
    this.category = KeyCategory.PHYSICAL
    this.keyMaterial = config.keyMaterial || "brass"
    this.keyShape = config.keyShape || "standard"
    this.isConsumed = false  // Physical keys aren't consumed
  }

  canActivateTrigger(triggerId: string): boolean {
    return this.associatedTriggerId === triggerId
  }
}
```

**Examples:**
```typescript
// Simple brass key
new PhysicalKey({
  id: "brass_key_001",
  name: "Brass Key",
  description: "A small brass key with intricate teeth",
  associatedTriggerId: "desk_drawer_lock",
  keyMaterial: "brass",
  keyShape: "standard"
})

// Tagged key with hint
new PhysicalKey({
  id: "tagged_key",
  name: "Tagged Key",
  description: "An iron key with a yellowed tag",
  associatedTriggerId: "filing_cabinet",
  keyMaterial: "iron",
  hasTag: true,
  tagText: "Archives - Level 3",
  nameOverride: "Archives Key"
})

// Red herring key
new PhysicalKey({
  id: "rusty_key",
  name: "Rusty Key",
  description: "An old, rusted key that looks like it hasn't been used in years",
  associatedTriggerId: "none",
  isRedHerring: true,
  keyMaterial: "iron"
})
```

### MagneticCard
Electronic keycards:

```typescript
class MagneticCard extends Key {
  cardLevel: string    // security clearance level
  cardColor: string    // visual identification
  cardNumber: string   // ID number printed on card
  isActive: boolean    // Can be deactivated/reactivated
  accessAreas: string[] // Which triggers this card works on

  constructor(config: MagneticCardConfig) {
    super()
    this.type = KeyType.MAGNETIC_CARD
    this.category = KeyCategory.PHYSICAL
    this.isActive = true
  }

  canActivateTrigger(triggerId: string): boolean {
    return this.isActive && this.accessAreas.includes(triggerId)
  }
}
```

**Examples:**
```typescript
// Security badge
new MagneticCard({
  id: "security_badge",
  name: "Security Badge",
  description: "A white keycard with 'LEVEL 2 ACCESS' printed in red",
  cardLevel: "2",
  cardColor: "white",
  cardNumber: "S-2147",
  accessAreas: ["door_lab", "door_office", "elevator"]
})

// Expired badge (red herring)
new MagneticCard({
  id: "expired_badge",
  name: "Old Badge",
  description: "A yellowed keycard with 'EXPIRED' stamped across it",
  isRedHerring: true,
  isActive: false,
  cardLevel: "1"
})
```

### ToolKey
Items used to manipulate mechanisms:

```typescript
class ToolKey extends Key {
  toolType: string     // screwdriver, wrench, lockpick, crowbar
  condition: string    // pristine, worn, damaged
  specialized: boolean // Works only on specific triggers

  constructor(config: ToolKeyConfig) {
    super()
    this.type = KeyType.TOOL
    this.category = KeyCategory.PHYSICAL
  }
}
```

**Examples:**
```typescript
// Flathead screwdriver
new ToolKey({
  id: "screwdriver",
  name: "Screwdriver",
  description: "A flathead screwdriver with a red handle",
  toolType: "screwdriver",
  associatedTriggerId: "vent_cover",
  specialized: true
})

// Universal lockpick set
new ToolKey({
  id: "lockpick_set",
  name: "Lockpick Set",
  description: "A leather case containing various lockpicks",
  toolType: "lockpick",
  specialized: false,  // Can open multiple locks
  nameOverride: "Professional Lockpicks"
})
```

---

## Digital/Code Key Types

### NumericCode
PIN codes and number combinations:

```typescript
class NumericCode extends Key {
  code: string         // The actual code
  codeLength: number   // Number of digits
  codeHint: string     // Optional clue about the code
  isPartial: boolean   // Only part of the full code

  constructor(config: NumericCodeConfig) {
    super()
    this.type = KeyType.NUMERIC_CODE
    this.category = KeyCategory.DIGITAL
    this.isConsumed = false  // Codes can be reused
  }

  validateAgainstTrigger(trigger: Trigger): boolean {
    if (trigger instanceof KeypadLock || trigger instanceof ComboLock) {
      return trigger.checkCode(this.code)
    }
    return false
  }
}
```

**Examples:**
```typescript
// Complete code
new NumericCode({
  id: "safe_code",
  name: "Safe Combination",
  description: "A slip of paper with numbers: 7-24-91",
  code: "72491",
  codeLength: 5,
  associatedTriggerId: "wall_safe"
})

// Partial code (needs combination)
new NumericCode({
  id: "partial_code_1",
  name: "Torn Paper (Upper Half)",
  description: "Half a torn note showing: '3_ - _8'",
  code: "3?-?8",
  isPartial: true,
  codeHint: "Need to find the other half"
})

// Hidden code in description (puzzle)
new NumericCode({
  id: "phone_number",
  name: "Business Card",
  description: "Dr. Smith's card. Phone: 555-1337. Office hours: 9-5",
  code: "1337",
  codeHint: "The important number might not be obvious",
  associatedTriggerId: "doctor_safe"
})
```

### WordCode
Text-based passwords and phrases:

```typescript
class WordCode extends Key {
  word: string           // The password/phrase
  caseSensitive: boolean
  isPhrase: boolean      // Multi-word phrase
  languageHint: string   // Latin, cipher, English, etc.

  constructor(config: WordCodeConfig) {
    super()
    this.type = KeyType.WORD_CODE
    this.category = KeyCategory.DIGITAL
    this.caseSensitive = config.caseSensitive || false
  }

  validateAgainstTrigger(trigger: Trigger): boolean {
    if (trigger instanceof WordLock || trigger instanceof TerminalCommandTrigger) {
      return trigger.checkWord(this.word, this.caseSensitive)
    }
    return false
  }
}
```

**Examples:**
```typescript
// Simple password
new WordCode({
  id: "computer_password",
  name: "Sticky Note",
  description: "A yellow sticky note with 'Password: FALCON' written on it",
  word: "FALCON",
  caseSensitive: false,
  associatedTriggerId: "lab_computer"
})

// Cipher word (puzzle required)
new WordCode({
  id: "cipher_word",
  name: "Encrypted Message",
  description: "A note with strange symbols that might spell something",
  word: "CIPHER",
  languageHint: "Caesar cipher, shift 3",
  nameOverride: "Mysterious Note"
})

// Multi-word phrase
new WordCode({
  id: "passphrase",
  name: "Ancient Inscription",
  description: "Carved into stone: 'Only the worthy may pass'",
  word: "worthy may pass",
  isPhrase: true,
  caseSensitive: false,
  associatedTriggerId: "tomb_door"
})
```

### PatternKey
Visual or sequential patterns:

```typescript
class PatternKey extends Key {
  pattern: any          // Structure depends on pattern type
  patternType: string   // grid, sequence, color, symbol
  patternSize: {width: number, height: number}
  visualRepresentation: string  // Image or ASCII art

  constructor(config: PatternKeyConfig) {
    super()
    this.type = KeyType.PATTERN
    this.category = KeyCategory.INFORMATION
  }
}
```

**Examples:**
```typescript
// Grid pattern (phone unlock style)
new PatternKey({
  id: "phone_pattern",
  name: "Sketch on Notepad",
  description: "A drawing showing dots connected in a pattern",
  pattern: [[0,0], [1,1], [2,2], [2,0]],
  patternType: "grid",
  patternSize: {width: 3, height: 3},
  associatedTriggerId: "tablet_lock",
  visualRepresentation: "•--•--•\n|  X  |\n•--•--•\n|  X  |\n•--•--•"
})

// Color sequence
new PatternKey({
  id: "color_sequence",
  name: "Stained Glass Window",
  description: "The colored glass shows a pattern: Red, Blue, Blue, Yellow, Red",
  pattern: ["red", "blue", "blue", "yellow", "red"],
  patternType: "color",
  associatedTriggerId: "colored_switches"
})

// Symbol pattern
new PatternKey({
  id: "symbol_pattern",
  name: "Ancient Tablet",
  description: "Four symbols carved in sequence: Moon, Sun, Star, Eye",
  pattern: ["moon", "sun", "star", "eye"],
  patternType: "symbol",
  associatedTriggerId: "symbol_lock"
})
```

### CommandSequence
Terminal/computer commands:

```typescript
class CommandSequence extends Key {
  commands: string[]     // Array of commands in order
  requiresOrder: boolean // Must be executed in sequence
  requiresLogin: boolean // Needs credentials first

  constructor(config: CommandSequenceConfig) {
    super()
    this.type = KeyType.COMMAND_SEQUENCE
    this.category = KeyCategory.DIGITAL
  }
}
```

**Examples:**
```typescript
// Simple command
new CommandSequence({
  id: "unlock_command",
  name: "Crumpled Note",
  description: "A note reading: 'Run: unlock vault_door'",
  commands: ["unlock vault_door"],
  requiresOrder: false,
  associatedTriggerId: "mainframe_terminal"
})

// Multi-step sequence
new CommandSequence({
  id: "system_override",
  name: "Procedure Manual",
  description: "Emergency override procedure listed in steps",
  commands: [
    "sudo access",
    "cd /security",
    "disable_locks --all",
    "logout"
  ],
  requiresOrder: true,
  requiresLogin: true,
  associatedTriggerId: "security_terminal"
})
```

---

## Information Key Types

### ClueKey
Hints and information that help solve puzzles:

```typescript
class ClueKey extends Key {
  clueText: string       // The actual clue content
  clueType: string       // direct, cryptic, visual, audio
  relatedPuzzle: string  // Which puzzle this helps with
  clarityLevel: number   // 1-5, how obvious is the clue

  constructor(config: ClueKeyConfig) {
    super()
    this.type = KeyType.CLUE
    this.category = KeyCategory.INFORMATION
    this.isConsumed = false
  }
}
```

**Examples:**
```typescript
// Direct clue
new ClueKey({
  id: "safe_clue",
  name: "Diary Entry",
  description: "A diary page: 'I'll never forget the day we met: July 24, 1991'",
  clueText: "The date 7-24-91 might be important",
  clueType: "direct",
  clarityLevel: 4,
  relatedPuzzle: "wall_safe"
})

// Cryptic clue
new ClueKey({
  id: "cryptic_hint",
  name: "Riddle",
  description: "A paper with a riddle: 'I have keys but no locks. I have space but no room. You can enter, but can't go outside. What am I?'",
  clueText: "Answer: Keyboard. Look at keyboards in the room.",
  clueType: "cryptic",
  clarityLevel: 2,
  relatedPuzzle: "computer_puzzle"
})

// Visual clue
new ClueKey({
  id: "poster_clue",
  name: "Movie Poster",
  description: "A poster for 'The Usual Suspects' - the title is underlined",
  clueText: "The usual suspects might refer to common passwords",
  clueType: "visual",
  clarityLevel: 3,
  isRedHerring: false,
  relatedPuzzle: "login_terminal"
})

// Red herring clue
new ClueKey({
  id: "false_clue",
  name: "Mysterious Note",
  description: "A note saying 'The answer is always 42'",
  clueText: "This is intentionally misleading",
  isRedHerring: true,
  relatedPuzzle: "none"
})
```

### MapKey
Spatial information and navigation:

```typescript
class MapKey extends Key {
  mapType: string        // floor_plan, area_map, diagram
  revealedLocations: string[]  // Room/area IDs shown
  markedLocations: {[key: string]: string}  // Location: note
  isComplete: boolean    // Full map or partial

  constructor(config: MapKeyConfig) {
    super()
    this.type = KeyType.MAP
    this.category = KeyCategory.INFORMATION
  }
}
```

**Examples:**
```typescript
// Floor plan
new MapKey({
  id: "building_map",
  name: "Floor Plan",
  description: "A blueprint showing the building layout",
  mapType: "floor_plan",
  revealedLocations: ["lobby", "office", "vault", "server_room"],
  markedLocations: {
    "vault": "X marks the spot",
    "office": "Manager's office - code in desk?"
  },
  isComplete: true
})

// Partial map (puzzle piece)
new MapKey({
  id: "map_fragment",
  name: "Torn Map",
  description: "Half of a map showing some rooms",
  mapType: "area_map",
  revealedLocations: ["north_wing"],
  isComplete: false
})
```

### DocumentKey
Papers, files, and records:

```typescript
class DocumentKey extends Key {
  documentType: string   // note, letter, report, certificate
  content: string        // Full text content
  hasSignature: boolean
  signatureName: string
  hasStamp: boolean
  isOfficial: boolean

  constructor(config: DocumentKeyConfig) {
    super()
    this.type = KeyType.DOCUMENT
    this.category = KeyCategory.INFORMATION
  }
}
```

**Examples:**
```typescript
// Official document
new DocumentKey({
  id: "authorization",
  name: "Authorization Form",
  description: "An official-looking document with a stamp",
  documentType: "certificate",
  content: "This document authorizes access to Sector 7. Authorization Code: ALPHA-9",
  hasSignature: true,
  signatureName: "Dr. Richardson",
  hasStamp: true,
  isOfficial: true,
  associatedTriggerId: "sector_7_door"
})

// Personal note
new DocumentKey({
  id: "love_letter",
  name: "Old Letter",
  description: "A yellowed love letter",
  documentType: "letter",
  content: "My dearest, meet me at our special place. Remember: Rose Garden, 1952.",
  hasSignature: true,
  signatureName: "Eleanor",
  isOfficial: false,
  relatedPuzzle: "combination_lock"  // "1952" is the combo
})
```

---

## Media Key Types

### MediaItemKey
Physical media storage:

```typescript
class MediaItemKey extends Key {
  mediaType: string      // cassette, cd, vinyl, usb, floppy, vhs
  mediaLabel: string     // What's written on the media
  mediaContent: string   // Audio/video file path
  requiresPlayer: string // Device needed to use this

  constructor(config: MediaItemKeyConfig) {
    super()
    this.type = KeyType.MEDIA_ITEM
    this.category = KeyCategory.MEDIA
  }
}
```

**Examples:**
```typescript
// Cassette tape
new MediaItemKey({
  id: "cassette_tape",
  name: "Audio Cassette",
  description: "A cassette labeled 'Interview Notes - CONFIDENTIAL'",
  mediaType: "cassette",
  mediaLabel: "Interview Notes",
  mediaContent: "audio/interview_recording.mp3",
  requiresPlayer: "tape_player",
  associatedTriggerId: "tape_player_trigger"
})

// USB drive
new MediaItemKey({
  id: "usb_drive",
  name: "USB Flash Drive",
  description: "A small black USB drive",
  mediaType: "usb",
  mediaLabel: "BACKUP",
  mediaContent: "data/encrypted_files.dat",
  requiresPlayer: "computer_terminal",
  associatedTriggerId: "computer_usb_port"
})

// Blank media (red herring)
new MediaItemKey({
  id: "blank_cd",
  name: "Blank CD",
  description: "An unmarked CD-R disc",
  mediaType: "cd",
  mediaLabel: "",
  isRedHerring: true,
  requiresPlayer: "cd_player"
})
```

### AudioRecording
Recorded messages and sounds:

```typescript
class AudioRecording extends Key {
  audioFile: string      // Path to audio file
  transcription: string  // Text version of audio
  speakerName: string    // Who's speaking
  audioLength: number    // Duration in seconds
  containsCode: boolean  // Does it contain a key code?

  constructor(config: AudioRecordingConfig) {
    super()
    this.type = KeyType.AUDIO_RECORDING
    this.category = KeyCategory.MEDIA
  }
}
```

**Examples:**
```typescript
// Voicemail with code
new AudioRecording({
  id: "voicemail",
  name: "Voicemail Message",
  description: "A saved voicemail on the phone",
  audioFile: "audio/voicemail_01.mp3",
  transcription: "Hi, it's Janet. The code for the storage unit is 4-7-9-2. Don't forget!",
  speakerName: "Janet",
  audioLength: 12,
  containsCode: true,
  associatedTriggerId: "storage_lock"
})

// Ambient recording (clue)
new AudioRecording({
  id: "music_box",
  name: "Music Box Melody",
  description: "A tune playing from the music box",
  audioFile: "audio/music_box.mp3",
  transcription: "The melody has 5 distinct notes in sequence",
  audioLength: 30,
  containsCode: false,
  relatedPuzzle: "piano_keys_puzzle"
})
```

---

## Abstract Key Types

### PermissionKey
Access rights and clearances:

```typescript
class PermissionKey extends Key {
  permissionLevel: number  // 1-10
  permissionType: string   // security, admin, guest
  grantedBy: string        // Who/what granted this
  expiresAfterTurns: number  // Optional time limit

  constructor(config: PermissionKeyConfig) {
    super()
    this.type = KeyType.PERMISSION
    this.category = KeyCategory.ABSTRACT
  }
}
```

**Examples:**
```typescript
// Security clearance
new PermissionKey({
  id: "clearance_level_3",
  name: "Level 3 Clearance",
  description: "You've been granted Level 3 security clearance",
  permissionLevel: 3,
  permissionType: "security",
  grantedBy: "security_terminal",
  associatedTriggerId: "high_security_doors"
})

// Temporary admin access
new PermissionKey({
  id: "temp_admin",
  name: "Admin Override",
  description: "Temporary administrator privileges (10 turns remaining)",
  permissionLevel: 10,
  permissionType: "admin",
  expiresAfterTurns: 10,
  grantedBy: "master_terminal"
})
```

### KnowledgeKey
Learned information or understanding:

```typescript
class KnowledgeKey extends Key {
  knowledgeType: string  // fact, procedure, secret
  learnedFrom: string    // Source of knowledge
  canBeForgotten: boolean

  constructor(config: KnowledgeKeyConfig) {
    super()
    this.type = KeyType.KNOWLEDGE
    this.category = KeyCategory.ABSTRACT
  }
}
```

**Examples:**
```typescript
// Learned fact
new KnowledgeKey({
  id: "morse_code_knowledge",
  name: "Morse Code Understanding",
  description: "You now understand how to read Morse code",
  knowledgeType: "skill",
  learnedFrom: "morse_code_chart",
  canBeForgotten: false,
  relatedPuzzle: "telegraph_machine"
})

// Secret knowledge
new KnowledgeKey({
  id: "secret_passage",
  name: "Secret Passage Location",
  description: "You now know there's a passage behind the bookshelf",
  knowledgeType: "secret",
  learnedFrom: "old_journal",
  associatedTriggerId: "bookshelf_secret"
})
```

### SequenceStepKey
Part of a multi-step solution:

```typescript
class SequenceStepKey extends Key {
  stepNumber: number     // Position in sequence
  totalSteps: number     // How many steps total
  sequenceId: string     // Which sequence this belongs to
  nextStepHint: string   // Hint about next step

  constructor(config: SequenceStepKeyConfig) {
    super()
    this.type = KeyType.SEQUENCE_STEP
    this.category = KeyCategory.ABSTRACT
  }
}
```

**Examples:**
```typescript
// Ritual step 1
new SequenceStepKey({
  id: "ritual_step_1",
  name: "First Ritual Step",
  description: "Light the candles from left to right",
  stepNumber: 1,
  totalSteps: 4,
  sequenceId: "unlock_ritual",
  nextStepHint: "After lighting, ring the bell"
})

// Ritual step 2
new SequenceStepKey({
  id: "ritual_step_2",
  name: "Second Ritual Step",
  description: "Ring the ceremonial bell three times",
  stepNumber: 2,
  totalSteps: 4,
  sequenceId: "unlock_ritual",
  nextStepHint: "Then recite the words on the altar"
})
```

---

## Red Herring Keys

### Creating Effective Red Herrings

Red herrings should be believable but ultimately useless:

```typescript
// Looks like a key but doesn't work anywhere
new PhysicalKey({
  id: "ornate_key",
  name: "Ornate Golden Key",
  description: "A beautiful golden key with intricate engravings. Surely this is important!",
  isRedHerring: true,
  keyMaterial: "gold",
  associatedTriggerId: "none"
})

// Code that goes nowhere
new NumericCode({
  id: "fake_code",
  name: "Written on Mirror",
  description: "Someone wrote '8-6-7-5-3-0-9' on the bathroom mirror",
  code: "8675309",  // Jenny's number!
  isRedHerring: true,
  codeHint: "Maybe it's a phone number?"
})

// Deck of cards (interesting but useless)
new MediaItemKey({
  id: "playing_cards",
  name: "Deck of Cards",
  description: "A worn deck of playing cards. The Ace of Spades is marked.",
  mediaType: "cards",
  isRedHerring: true,
  descriptionOverride: "You flip through the cards, but nothing seems unusual beyond the marked Ace."
})

// Cryptic note that means nothing
new ClueKey({
  id: "cryptic_nonsense",
  name: "Mysterious Poem",
  description: "A framed poem on the wall with certain words highlighted",
  clueText: "The highlighted words spell 'LOOK UNDER DESK' but there's nothing there",
  isRedHerring: true,
  clueType: "cryptic"
})
```

---

## Complex Key Examples

### Multi-Part Key System

Some puzzles require combining multiple keys:

```typescript
// Partial code 1
new NumericCode({
  id: "code_part_1",
  name: "Torn Note (Top)",
  description: "Top half of a torn paper: '4_ - __'",
  code: "4?-??",
  isPartial: true
})

// Partial code 2
new NumericCode({
  id: "code_part_2",
  name: "Torn Note (Bottom)",
  description: "Bottom half of a torn paper: '_ 7 - 9 2'",
  code: "?7-92",
  isPartial: true
})

// Combined they form: 47-92
```

### Transforming Keys

Keys that change based on other keys:

```typescript
// UV light reveals hidden text
new ToolKey({
  id: "uv_flashlight",
  name: "UV Flashlight",
  description: "A blacklight flashlight",
  toolType: "flashlight",
  // When used on certain items, reveals hidden keys
})

// Invisible ink note (becomes visible with UV)
new ClueKey({
  id: "invisible_note",
  name: "Blank Paper",
  description: "A piece of paper that appears blank",
  isHidden: true,  // Not revealed until UV light is used
  clueText: "Once revealed: 'The password is NIGHTWATCH'",
  relatedPuzzle: "security_terminal"
})
```

### Conditional Keys

Keys that only work under certain conditions:

```typescript
// Badge only works during certain turns (time-based)
new MagneticCard({
  id: "temp_badge",
  name: "Temporary Pass",
  description: "A visitor badge valid for 20 minutes",
  isActive: true,
  expiresAfterTurns: 20,
  accessAreas: ["visitor_area"]
})

// Key that requires another key to be used first
new PhysicalKey({
  id: "vault_key",
  name: "Vault Key",
  description: "The key to the vault, but it requires clearance",
  associatedTriggerId: "vault_door",
  requiredPermissions: ["clearance_level_3"]  // Need this permission first
})
```

---

## Key-Trigger Relationships

### One-to-One
Most common: one key opens one trigger

```typescript
Key: brass_key → Trigger: desk_drawer_lock
```

### One-to-Many
Master key opens multiple triggers

```typescript
Key: master_keycard → Triggers: [door_1, door_2, door_3, elevator]
```

### Many-to-One
Multiple keys required for one trigger

```typescript
Keys: [code_part_1, code_part_2, code_part_3] → Trigger: vault_combination
```

### Many-to-Many
Complex relationships

```typescript
Key: level_2_clearance → Triggers: [door_2a, door_2b, terminal_2]
Key: level_3_clearance → Triggers: [door_2a, door_2b, door_3, terminal_2, terminal_3]
```

---

## Key Acquisition Methods

### From Items (Containers)
```typescript
// Key found in drawer
{
  acquiredFrom: "desk_drawer_middle",
  acquiredTurn: 5
}
```

### From Triggers (Rewards)
```typescript
// Key granted after solving puzzle
{
  acquiredFrom: "circuit_puzzle_trigger",
  acquiredTurn: 12
}
```

### From Examination
```typescript
// Key discovered by examining item
{
  acquiredFrom: "examine_painting",
  acquiredTurn: 8
}
```

### From Combination
```typescript
// Key created by combining items
{
  acquiredFrom: "combine_battery_flashlight",
  acquiredTurn: 15
}
```

---

## Key Storage & Management

### Player Inventory
Keys the player is carrying:

```typescript
class PlayerInventory {
  physicalKeys: PhysicalKey[]
  digitalKeys: (NumericCode | WordCode | PatternKey)[]
  informationKeys: (ClueKey | MapKey | DocumentKey)[]
  mediaKeys: (MediaItemKey | AudioRecording)[]
  abstractKeys: (PermissionKey | KnowledgeKey)[]

  maxPhysicalItems: number  // Carrying capacity

  addKey(key: Key): boolean
  removeKey(keyId: string): boolean
  hasKey(keyId: string): boolean
  getKeysByType(type: KeyType): Key[]
  getKeysForTrigger(triggerId: string): Key[]
}
```

### Room Key Registry
Track which keys are available in each room:

```typescript
class RoomKeyRegistry {
  roomId: string
  availableKeys: Key[]        // Keys that can be found
  acquiredKeys: Key[]         // Keys player has found
  remainingKeys: Key[]        // Keys still hidden

  registerKey(key: Key): void
  markKeyAcquired(keyId: string): void
  getHiddenKeys(): Key[]
}
```

---

## Key Validation System

### Trigger-Key Matching

```typescript
class KeyValidator {
  static validateKey(key: Key, trigger: Trigger): ValidationResult {
    // Type matching
    if (!this.typesMatch(key.type, trigger.acceptedKeyTypes)) {
      return {valid: false, reason: "Wrong key type"}
    }

    // ID matching
    if (key.associatedTriggerId !== trigger.id) {
      return {valid: false, reason: "Key doesn't fit"}
    }

    // Condition checking
    if (trigger.requiresMultipleKeys && !this.hasAllRequiredKeys(trigger)) {
      return {valid: false, reason: "Missing other required keys"}
    }

    // Custom validation
    if (!key.validateAgainstTrigger(trigger)) {
      return {valid: false, reason: "Validation failed"}
    }

    return {valid: true}
  }
}
```

---

## Scalability & Extensibility

### Adding New Key Types

```typescript
// Custom key type example
class BiometricKey extends Key {
  biometricType: string  // fingerprint, retina, voice
  biometricData: string

  constructor(config: BiometricKeyConfig) {
    super()
    this.type = KeyType.PHYSICAL_KEY  // Or create new KeyType
    this.category = KeyCategory.PHYSICAL
  }

  canActivateTrigger(triggerId: string): boolean {
    // Custom validation logic
    return this.biometricData !== null &&
           this.associatedTriggerId === triggerId
  }
}
```

### Configuration-Driven Keys

```yaml
keys:
  - type: PhysicalKey
    id: office_key
    name: "Office Key"
    description: "A silver key labeled 'Manager'"
    keyMaterial: silver
    associatedTrigger: manager_office_door
    acquiredFrom: guard_desk_drawer

  - type: NumericCode
    id: safe_combo
    name: "Safe Code Note"
    description: "A post-it with numbers"
    code: "15-23-8"
    associatedTrigger: office_safe
    isPartial: false

  - type: ClueKey
    id: hint_001
    name: "Cryptic Message"
    description: "A note: 'The key is where you started'"
    clueText: "Check the entrance area"
    clueType: cryptic
    isRedHerring: false
    relatedPuzzle: entrance_puzzle
```

---

## Summary

The Key system provides:

1. **Flexible Type System:** Physical, Digital, Information, Media, and Abstract keys
2. **Extensibility:** Base class easily extended for specialized keys
3. **Red Herrings:** Built-in support for misleading keys
4. **Multi-Part Keys:** Keys can combine or transform
5. **Conditional Logic:** Keys work only under certain conditions
6. **Rich Metadata:** Descriptions, hints, acquisition tracking
7. **Validation:** Automated key-trigger matching
8. **Scalability:** Easy to add new key types and behaviors
9. **Theme-Agnostic:** Same structure works across all themes
10. **Inventory Management:** Organized storage and retrieval

Keys are the connective tissue between Items and Triggers, enabling the complex puzzle chains that make escape rooms engaging. The system scales from simple brass keys to complex multi-part codes, all while maintaining a consistent interface.

