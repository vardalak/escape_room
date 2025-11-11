# Isometric Room Viewer - Implementation Guide

## Overview
This document provides a structured implementation plan for the isometric room viewer interface. The approach is designed for incremental development, allowing basic functionality to be visible and testable quickly, with enhancements added progressively.

---

## Implementation Philosophy

### Incremental Delivery Strategy
```
Phase 1: Static Room Display
  ↓ (working display, no interaction)
Phase 2: Basic Selection
  ↓ (can select objects)
Phase 3: Zoom & Pan
  ↓ (can navigate room)
Phase 4: Object Interactions
  ↓ (can interact with triggers)
Phase 5: Polish & Effects
  ↓ (animations, particles, sounds)
```

Each phase delivers **visible, testable functionality** before moving to the next.

---

## Phase 1: Static Room Display

**Goal:** Display Training Basement in isometric view with all objects visible and positioned correctly.

### 1.1 Asset Preparation (SVG-First Approach)

**Note:** We'll start with SVG graphics that can be generated as code. This allows for:
- Immediate implementation (no waiting for art)
- Infinite scalability (no pixelation when zooming)
- Easy modification (just edit the code)
- Small file sizes (~10-50KB vs 200KB+ for PNG)

- [ ] Create asset directory structure
  ```
  /assets/rooms/training_basement/
    /svg/
      - room_background.svg
      - desk.svg
      - filing_cabinet.svg
      - poster.svg
      - exit_door.svg
      - vent.svg
  ```

- [ ] Generate SVG for isometric room background
  - [ ] Create simple isometric room outline (walls, floor, ceiling)
  - [ ] Use basic geometric shapes
  - [ ] Colors: Floor (#666), Walls (#888), Ceiling (#AAA)
  - [ ] Size: 1000x1000 viewBox (scales to any display size)
  - [ ] SVG code will be provided

- [ ] Generate SVG for each object (simple isometric representations)
  - [ ] **Desk** - Brown rectangle with drawer lines (512x512 viewBox)
  - [ ] **Filing Cabinet** - Grey cabinet with 2 drawer outlines (512x512 viewBox)
  - [ ] **Poster** - Rectangle with text "START HERE" (256x256 viewBox)
  - [ ] **Exit Door** - Door shape with keypad (512x512 viewBox)
  - [ ] **Vent** - Grid pattern rectangle (256x256 viewBox)
  - [ ] All SVG code will be provided and ready to use

**Upgrade Path:** Later phases can replace individual SVGs with PNGs for hero objects if needed

### 1.2 Room Component Structure
- [ ] Create `IsometricRoomView` component
  ```typescript
  interface IsometricRoomViewProps {
    room: Room;
    onObjectTap?: (objectId: string) => void;
  }
  ```

- [ ] Create basic component file structure
  ```
  /src/components/IsometricRoom/
    - IsometricRoomView.tsx (main component)
    - RoomBackground.tsx (background layer)
    - RoomObject.tsx (individual object renderer)
    - types.ts (TypeScript interfaces)
    - styles.ts (component styles)
  ```

### 1.3 Basic Layout & Positioning
- [ ] Define coordinate system
  ```typescript
  interface RoomPosition {
    x: number;  // 0-1000 (room width units)
    y: number;  // 0-1000 (room height units)
    z: number;  // 0-100 (height/depth for layering)
  }
  ```

- [ ] Implement RoomBackground component
  - [ ] Display background image
  - [ ] Handle screen size scaling
  - [ ] Maintain aspect ratio

- [ ] Implement RoomObject component
  - [ ] Accept position and sprite props
  - [ ] Render sprite at calculated screen position
  - [ ] Handle z-index for proper layering

### 1.4 Object Positioning System
- [ ] Create position mapping utility
  ```typescript
  function roomToScreenCoordinates(
    roomPos: RoomPosition,
    screenSize: { width: number; height: number }
  ): { x: number; y: number; zIndex: number }
  ```

- [ ] Position all Training Basement objects
  - [ ] Desk at (300, 400, 10)
  - [ ] Filing cabinet at (600, 400, 10)
  - [ ] Poster at (200, 200, 50)
  - [ ] Exit door at (800, 100, 90)
  - [ ] Vent at (500, 100, 95)

### 1.5 First Visual Test
- [ ] Integrate IsometricRoomView into app navigation
- [ ] Load Training Basement experience
- [ ] Display room with all objects
- [ ] Verify all objects are visible and positioned correctly
- [ ] Test on multiple screen sizes (phone, tablet)

**Checkpoint:** You should see a static isometric room with all objects visible!

---

## Phase 2: Basic Selection System

**Goal:** Make objects tappable with visual feedback showing selection.

### 2.1 Touch Handling
- [ ] Add TouchableOpacity wrapper to RoomObject
  ```typescript
  <TouchableOpacity
    onPress={() => onObjectTap(object.id)}
    activeOpacity={0.7}
  >
    <Image source={object.sprite} />
  </TouchableOpacity>
  ```

- [ ] Implement selection state management
  ```typescript
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  ```

- [ ] Pass selection handler to child components

### 2.2 Visual Selection Feedback
- [ ] Create selection highlight component
  ```typescript
  interface SelectionHighlightProps {
    objectBounds: { width: number; height: number };
    isSelected: boolean;
  }
  ```

- [ ] Add glow effect for selected object
  - [ ] Yellow outline (3px)
  - [ ] Subtle drop shadow
  - [ ] Pulsing animation (optional for this phase)

- [ ] Dim unselected objects (opacity 0.6)

### 2.3 Object Info Display
- [ ] Create bottom info panel component
  ```typescript
  interface ObjectInfoPanelProps {
    object: Item | null;
    onInteract?: () => void;
    onExamine?: () => void;
  }
  ```

- [ ] Display selected object information
  - [ ] Object name
  - [ ] Brief description (1 line)
  - [ ] Available actions as buttons

### 2.4 Selection Test
- [ ] Tap each object to select it
- [ ] Verify visual feedback appears
- [ ] Verify info panel shows correct object
- [ ] Verify deselection works (tap background)

**Checkpoint:** You can now tap objects and see them highlight!

---

## Phase 3: Zoom & Pan Navigation

**Goal:** Allow pinch-to-zoom and two-finger panning around the room.

### 3.1 Gesture Handling Setup
- [ ] Install react-native-gesture-handler (if not already)
  ```bash
  npm install react-native-gesture-handler
  ```

- [ ] Wrap IsometricRoomView with GestureHandlerRootView

### 3.2 Zoom Implementation
- [ ] Add zoom state management
  ```typescript
  const [scale, setScale] = useState(1.0);
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2.0;
  ```

- [ ] Implement pinch gesture handler
  ```typescript
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = clamp(
        baseScale * event.scale,
        MIN_SCALE,
        MAX_SCALE
      );
      setScale(newScale);
    });
  ```

- [ ] Apply scale transform to room container

### 3.3 Pan Implementation
- [ ] Add pan offset state
  ```typescript
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  ```

- [ ] Implement pan gesture handler
  ```typescript
  const panGesture = Gesture.Pan()
    .minPointers(2)  // Require 2 fingers
    .onUpdate((event) => {
      setPanOffset({
        x: basePanOffset.x + event.translationX,
        y: basePanOffset.y + event.translationY
      });
    });
  ```

- [ ] Apply translation transform to room container

- [ ] Implement pan boundaries (prevent panning off-screen)

### 3.4 Combined Gesture Handling
- [ ] Compose pinch and pan gestures
  ```typescript
  const composed = Gesture.Simultaneous(pinchGesture, panGesture);
  ```

- [ ] Apply to GestureDetector wrapping room view

### 3.5 Auto-Zoom on Selection
- [ ] Implement animateToObject utility
  ```typescript
  function animateToObject(
    objectPosition: RoomPosition,
    targetScale: number = 1.5
  ): void
  ```

- [ ] Animate zoom to 1.5x when object selected
- [ ] Center selected object in viewport
- [ ] Smooth animation (300ms ease-out)

### 3.6 Reset View Button
- [ ] Add "Reset View" button to UI
- [ ] Implement reset function
  ```typescript
  function resetView(): void {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1.0 }),
      Animated.timing(panOffset.x, { toValue: 0 }),
      Animated.timing(panOffset.y, { toValue: 0 })
    ]).start();
  }
  ```

### 3.7 Navigation Test
- [ ] Test pinch zoom in/out
- [ ] Test two-finger pan in all directions
- [ ] Test auto-zoom when selecting object
- [ ] Test reset view button
- [ ] Verify transforms don't break touch targets

**Checkpoint:** You can now navigate around the room freely!

---

## Phase 4: Object Interactions

**Goal:** Connect object taps to trigger system and display interaction modals.

### 4.1 Interaction Modal Framework
- [ ] Create base InteractionModal component
  ```typescript
  interface InteractionModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  ```

- [ ] Style as full-screen overlay
  - [ ] Semi-transparent background (rgba(0,0,0,0.8))
  - [ ] Modal content centered
  - [ ] Close button (X) in top-right
  - [ ] Slide-up animation on open

### 4.2 Examine Interaction
- [ ] Create ExamineModal component
  ```typescript
  interface ExamineModalProps {
    item: Item;
    onClose: () => void;
  }
  ```

- [ ] Display item image (larger view)
- [ ] Display full description
- [ ] Show available actions

- [ ] Connect to StateManager
  ```typescript
  const handleExamine = (itemId: string) => {
    const result = stateManager.examineItem(itemId);
    // Show examination modal
  };
  ```

### 4.3 Container Interaction (Open Drawer/Cabinet)
- [ ] Create ContainerModal component
  ```typescript
  interface ContainerModalProps {
    container: Item;
    onTakeItem: (itemId: string) => void;
    onClose: () => void;
  }
  ```

- [ ] Display container name
- [ ] List contained items
- [ ] "Take" button for each item
- [ ] Empty state message

- [ ] Connect to StateManager
  ```typescript
  const handleOpenContainer = (containerId: string) => {
    const result = stateManager.openContainer(containerId);
    // Show container modal with items
  };
  ```

### 4.4 Lock Interaction
- [ ] Create LockModal component
  ```typescript
  interface LockModalProps {
    trigger: Trigger;
    availableKeys: Key[];
    onUseKey: (keyId: string) => void;
    onClose: () => void;
  }
  ```

- [ ] Display lock image/description
- [ ] List available keys from inventory
- [ ] "Use Key" buttons
- [ ] Feedback on success/failure

### 4.5 Keypad Interaction
- [ ] Create KeypadModal component
  ```typescript
  interface KeypadModalProps {
    trigger: KeypadLock;
    onSubmitCode: (code: string) => void;
    onClose: () => void;
  }
  ```

- [ ] Display numeric keypad (0-9)
- [ ] Code entry display (4 boxes)
- [ ] Clear and Submit buttons
- [ ] Attempts remaining counter
- [ ] Success/failure feedback

- [ ] Connect to StateManager
  ```typescript
  const handleEnterCode = (triggerId: string, code: string) => {
    const result = stateManager.enterCode(triggerId, code);
    // Show success/failure
  };
  ```

### 4.6 Action Button Logic
- [ ] Implement getAvailableActions utility
  ```typescript
  function getAvailableActions(item: Item): Action[] {
    const actions: Action[] = [];

    if (item.isExaminable) actions.push('examine');
    if (item.containedItems.length > 0) actions.push('open');
    if (item.isPortable) actions.push('take');
    if (item.isLocked) actions.push('unlock');

    return actions;
  }
  ```

- [ ] Display action buttons in ObjectInfoPanel
- [ ] Connect each button to appropriate modal

### 4.7 State Change Handling
- [ ] Subscribe to StateManager events
  ```typescript
  useEffect(() => {
    const unsubscribe = stateManager.subscribe('stateChange', (change) => {
      // Update UI based on state change
      // Refresh room view
      // Show toast notifications
    });
    return unsubscribe;
  }, []);
  ```

- [ ] Update object sprites on state change
  - [ ] Show open drawer sprite when drawer opened
  - [ ] Show unlocked door sprite when door unlocked
  - [ ] Remove objects when taken

### 4.8 Interaction Test
- [ ] Examine the poster (triggers examination)
- [ ] Open filing cabinet (shows contained items)
- [ ] Take brass key (adds to inventory)
- [ ] Use key on desk drawer (unlocks drawer)
- [ ] Enter code on exit door keypad (unlocks door)
- [ ] Verify state persists across navigation

**Checkpoint:** You can now fully interact with the Training Basement!

---

## Phase 5: Polish & Visual Effects

**Goal:** Add animations, particles, sound effects, and visual polish.

### 5.1 Object Hover Effects
- [ ] Add hover state to objects
  - [ ] Slight scale increase (1.05x) on touch start
  - [ ] Subtle glow when finger over object
  - [ ] Cursor change (if web support added)

### 5.2 Selection Animations
- [ ] Animate selection highlight
  - [ ] Pulse effect (scale 1.0 → 1.05 → 1.0)
  - [ ] Glow intensity fade in/out
  - [ ] Smooth color transition

- [ ] Animate auto-zoom
  - [ ] Ease-out curve for natural feel
  - [ ] 300ms duration
  - [ ] Slight bounce at end (optional)

### 5.3 Object State Transitions
- [ ] Animate drawer opening
  - [ ] Slide-out animation
  - [ ] Contained items fade in
  - [ ] Duration: 400ms

- [ ] Animate door unlocking
  - [ ] Lock icon disappears
  - [ ] Green checkmark appears briefly
  - [ ] Door sprite changes

- [ ] Animate item pickup
  - [ ] Item scales down and moves to inventory icon
  - [ ] Fade out from room
  - [ ] Duration: 600ms

### 5.4 Particle Effects
- [ ] Create particle system utility
  ```typescript
  interface ParticleConfig {
    position: { x: number; y: number };
    count: number;
    type: 'sparkle' | 'dust' | 'unlock';
  }
  ```

- [ ] Unlock sparkle effect
  - [ ] Trigger when lock opened
  - [ ] Yellow/gold particles
  - [ ] Burst pattern

- [ ] Examination sparkle
  - [ ] Subtle shimmer on important clues
  - [ ] Continuous gentle effect

- [ ] Success burst
  - [ ] Large celebratory effect
  - [ ] Multiple colors
  - [ ] Triggered on puzzle solve

### 5.5 Sound Effects
- [ ] Create sound manager utility
  ```typescript
  enum SoundEffect {
    TAP = 'tap.mp3',
    DRAWER_OPEN = 'drawer_open.mp3',
    KEY_USE = 'key_use.mp3',
    UNLOCK = 'unlock.mp3',
    KEYPAD_PRESS = 'keypad_press.mp3',
    SUCCESS = 'success.mp3',
    FAILURE = 'failure.mp3'
  }
  ```

- [ ] Add sound effects to actions
  - [ ] Tap object → TAP
  - [ ] Open container → DRAWER_OPEN
  - [ ] Use key → KEY_USE + UNLOCK
  - [ ] Keypad button → KEYPAD_PRESS
  - [ ] Code correct → SUCCESS
  - [ ] Code wrong → FAILURE

- [ ] Implement volume control
- [ ] Implement mute toggle

### 5.6 Visual Connection Lines
- [ ] Create ConnectionLine component
  ```typescript
  interface ConnectionLineProps {
    from: RoomPosition;
    to: RoomPosition;
    animated: boolean;
  }
  ```

- [ ] Draw lines between trigger and reward
  - [ ] Dashed line style
  - [ ] Arrow at end
  - [ ] Animated dash movement

- [ ] Show on trigger activation
  - [ ] Fade in line
  - [ ] Pulse destination object
  - [ ] Auto-hide after 2 seconds

### 5.7 Toast Notifications
- [ ] Create toast notification system
  ```typescript
  function showToast(
    message: string,
    type: 'info' | 'success' | 'error'
  ): void
  ```

- [ ] Display for state changes
  - [ ] "Key acquired!" (success)
  - [ ] "Drawer unlocked!" (success)
  - [ ] "Wrong code!" (error)
  - [ ] "Found a clue!" (info)

- [ ] Auto-dismiss after 3 seconds
- [ ] Queue multiple toasts
- [ ] Slide in from top

### 5.8 Loading States
- [ ] Add loading spinner for room load
- [ ] Skeleton UI for objects while loading
- [ ] Progress bar for large asset loads
- [ ] Smooth fade-in when ready

### 5.9 Polish Test
- [ ] Verify all animations are smooth
- [ ] Test sound effects work correctly
- [ ] Verify particle effects don't lag
- [ ] Test on lower-end devices
- [ ] Adjust animation timing if needed

**Checkpoint:** The game now feels polished and professional!

---

## Phase 6: Inventory System

**Goal:** Display and manage player inventory with keys and items.

### 6.1 Inventory UI Component
- [ ] Create InventoryPanel component
  ```typescript
  interface InventoryPanelProps {
    keys: Key[];
    onSelectKey: (keyId: string) => void;
  }
  ```

- [ ] Design layout options
  - Option A: Sliding drawer from bottom
  - Option B: Persistent bar at top
  - Option C: Floating button that expands

- [ ] Implement chosen layout

### 6.2 Inventory Display
- [ ] Show acquired keys as icons
  - [ ] Grid or horizontal scroll
  - [ ] Key icon + name
  - [ ] Tap to view details

- [ ] Show key count badge
- [ ] Empty state message ("No items yet")

### 6.3 Key Detail View
- [ ] Create KeyDetailModal component
- [ ] Display key information
  - [ ] Large icon
  - [ ] Name and description
  - [ ] Associated trigger hint
  - [ ] "Use on selected object" button

### 6.4 Using Items from Inventory
- [ ] Implement "Use Key" flow
  ```typescript
  const handleUseKey = (keyId: string) => {
    if (!selectedObjectId) {
      showToast('Select an object first', 'info');
      return;
    }

    const result = stateManager.useKey(keyId, selectedObjectId);
    // Handle result
  };
  ```

- [ ] Highlight compatible objects when key selected
- [ ] Show "Invalid target" feedback

### 6.5 Inventory Integration Test
- [ ] Acquire multiple keys
- [ ] Open inventory
- [ ] Select key to view details
- [ ] Use key on correct object
- [ ] Try using key on wrong object

**Checkpoint:** Full inventory system working!

---

## Phase 7: UI/UX Refinements

**Goal:** Add quality-of-life features and polish the user experience.

### 7.1 Tutorial/Help System
- [ ] Create TutorialOverlay component
- [ ] Show on first room load
  - [ ] "Tap objects to select them"
  - [ ] "Pinch to zoom"
  - [ ] "Two fingers to pan"
  - [ ] "Tap Interact to solve puzzles"

- [ ] Add skip tutorial option
- [ ] Add help button to re-show

### 7.2 Hint System
- [ ] Create HintPanel component
- [ ] Implement hint levels
  ```typescript
  enum HintLevel {
    SUBTLE = 1,    // "Look around the room"
    MODERATE = 2,  // "Check the filing cabinet"
    OBVIOUS = 3    // "Open the top drawer"
  }
  ```

- [ ] Progressive hint reveal
  - [ ] First hint free
  - [ ] Subsequent hints cost "hint points" (optional)
  - [ ] Wait timer between hints (30s)

- [ ] Hint button in UI
- [ ] Connect to Experience hint data

### 7.3 Progress Indicators
- [ ] Create ProgressBar component
- [ ] Show completion percentage
  - [ ] Based on triggers activated
  - [ ] Update in real-time

- [ ] Show statistics
  - [ ] Turn count
  - [ ] Time elapsed
  - [ ] Hints used
  - [ ] Completion %

### 7.4 Settings Menu
- [ ] Create SettingsModal component
- [ ] Add settings options
  - [ ] Sound effects volume
  - [ ] Music volume (if added)
  - [ ] Vibration on/off
  - [ ] Reset progress
  - [ ] Exit to menu

### 7.5 Accessibility Features
- [ ] Add text size options
  - [ ] Small, Medium, Large, Extra Large

- [ ] Add high contrast mode
  - [ ] Increase outline thickness
  - [ ] Higher contrast colors

- [ ] Add screen reader support
  - [ ] Meaningful labels on all buttons
  - [ ] Descriptions for images
  - [ ] Navigation hints

### 7.6 Performance Optimization
- [ ] Implement object culling
  - [ ] Only render visible objects
  - [ ] Lazy load off-screen sprites

- [ ] Optimize re-renders
  - [ ] Memoize expensive components
  - [ ] Use React.memo for objects
  - [ ] Implement useMemo for calculations

- [ ] Implement asset preloading
  - [ ] Preload next room assets
  - [ ] Show loading screen during preload

### 7.7 Error Handling
- [ ] Add error boundary component
- [ ] Implement graceful fallbacks
  - [ ] Missing asset → show placeholder
  - [ ] Failed interaction → show error toast
  - [ ] State corruption → offer reset

- [ ] Add error reporting (optional)
  - [ ] Log to console
  - [ ] Send to analytics (with permission)

### 7.8 Save/Load Integration
- [ ] Auto-save on state change
  - [ ] Debounced (save after 2s of inactivity)
  - [ ] Save to AsyncStorage

- [ ] Load saved state on app launch
- [ ] Show "Continue" vs "New Game" options

**Checkpoint:** Professional, polished user experience!

---

## Phase 8: Multi-Room Support

**Goal:** Enable navigation between multiple rooms in an experience.

### 8.1 Room Transition System
- [ ] Create RoomTransition component
  ```typescript
  interface RoomTransitionProps {
    fromRoom: Room;
    toRoom: Room;
    onComplete: () => void;
  }
  ```

- [ ] Implement transition animations
  - Option A: Fade out/in
  - Option B: Slide left/right
  - Option C: Zoom out, pan, zoom in

### 8.2 Exit/Entrance Handling
- [ ] Detect when player taps exit door
- [ ] Check if door is unlocked
- [ ] Trigger room transition
- [ ] Load new room assets
- [ ] Update currentRoomId in state

### 8.3 Room History/Map
- [ ] Create RoomMapModal component (optional)
- [ ] Show visited rooms
- [ ] Show room connections
- [ ] Allow fast travel to visited rooms

### 8.4 Multi-Room Test
- [ ] Create second test room
- [ ] Connect to Training Basement via door
- [ ] Navigate from room 1 → room 2
- [ ] Verify state persists
- [ ] Navigate back to room 1
- [ ] Verify both rooms retain state

**Checkpoint:** Can navigate between multiple rooms!

---

## Component Architecture Summary

### Final Component Hierarchy
```
<App>
  <ExperienceManager>
    <GameScreen>
      <IsometricRoomView>
        <RoomBackground />
        <RoomObjectLayer>
          <RoomObject /> × N
          <SelectionHighlight />
          <ConnectionLines />
          <ParticleEffects />
        </RoomObjectLayer>
      </IsometricRoomView>

      <ObjectInfoPanel />
      <InventoryPanel />
      <ProgressBar />

      <InteractionModals>
        <ExamineModal />
        <ContainerModal />
        <KeypadModal />
        <LockModal />
      </InteractionModals>

      <UIOverlays>
        <TutorialOverlay />
        <HintPanel />
        <SettingsMenu />
        <ToastContainer />
      </UIOverlays>
    </GameScreen>
  </ExperienceManager>
</App>
```

---

## Data Flow Architecture

### State Management Flow
```
User Interaction
  ↓
Component Handler
  ↓
StateManager.action()
  ↓
Experience Model Update
  ↓
StateManager.emit('stateChange')
  ↓
React Component Re-render
  ↓
UI Updates
```

### Example: Opening a Drawer
```typescript
// 1. User taps drawer
<RoomObject onPress={() => handleSelectObject('desk_drawer_middle')} />

// 2. Component handler
const handleSelectObject = (objectId: string) => {
  setSelectedObjectId(objectId);

  // Auto-zoom to object
  animateToObject(object.position);
};

// 3. User taps "Open" button
<Button onPress={() => handleOpenContainer(selectedObjectId)} />

// 4. StateManager call
const handleOpenContainer = (containerId: string) => {
  const result = stateManager.openContainer(containerId);

  if (result.success) {
    setContainerModalVisible(true);
    setContainerItems(result.items);
  }
};

// 5. StateManager updates Experience
// 6. StateManager emits event
stateManager.emit('containerOpened', { containerId, items });

// 7. Component subscribes and updates
useEffect(() => {
  const unsubscribe = stateManager.subscribe('containerOpened', (data) => {
    // Refresh object sprite
    // Show items in modal
  });
  return unsubscribe;
}, []);
```

---

## Testing Checklist

### Functionality Tests
- [ ] All objects can be selected
- [ ] All interactions work (examine, open, take, use, enter code)
- [ ] State persists correctly
- [ ] Keys can be acquired and used
- [ ] Triggers activate correctly
- [ ] Room transitions work
- [ ] Inventory updates correctly
- [ ] Save/load works
- [ ] Hints display correctly

### Visual Tests
- [ ] Objects render at correct positions
- [ ] Z-ordering is correct (no layering bugs)
- [ ] Selection highlights work
- [ ] Animations are smooth (60fps)
- [ ] Modals display correctly
- [ ] UI scales on different screen sizes
- [ ] High contrast mode works

### Interaction Tests
- [ ] Pinch zoom is smooth
- [ ] Pan with two fingers works
- [ ] Auto-zoom on selection works
- [ ] Touch targets are appropriately sized
- [ ] No accidental taps
- [ ] Gestures don't conflict

### Performance Tests
- [ ] Room loads in < 2 seconds
- [ ] No frame drops during pan/zoom
- [ ] Animations maintain 60fps
- [ ] Memory usage is reasonable
- [ ] Battery drain is acceptable

### Edge Case Tests
- [ ] Very zoomed in (2.0x)
- [ ] Very zoomed out (0.5x)
- [ ] Small screen (iPhone SE)
- [ ] Large screen (iPad)
- [ ] Rapid tapping doesn't break state
- [ ] App backgrounding/foregrounding
- [ ] Low memory conditions

---

## Asset Creation Guidelines

### Isometric Art Style
- **Angle:** 45° (dimetric projection)
- **Light Source:** Top-left (consistent shadows)
- **Resolution:** 2x for retina displays
- **Format:** PNG with alpha channel
- **Color Palette:** Consistent across all rooms

### Object Sprite Specifications
```
Small objects (keys, notes):     128x128px
Medium objects (chairs, boxes):   256x256px
Large objects (desks, cabinets):  512x512px
Very large (doors, walls):        512x768px

All sprites:
- Transparent background
- Drop shadow baked in
- Outline for clarity (optional)
- Multiple states as separate files
```

### Naming Conventions
```
{room}_{object}_{state}.png

Examples:
training_basement_desk_closed.png
training_basement_desk_drawer1_open.png
training_basement_desk_drawer2_open.png
training_basement_door_locked.png
training_basement_door_unlocked.png
```

---

## Performance Targets

### Load Times
- Initial room load: < 2 seconds
- Asset preload: < 1 second per room
- Modal open: < 100ms
- State save: < 200ms

### Frame Rates
- Idle: 60fps
- Pan/zoom: 60fps (allow 30fps on low-end)
- Animations: 60fps
- Particle effects: 30fps acceptable

### Memory Usage
- Per room: < 100MB
- Total app: < 200MB
- Acceptable range on low-end devices

### Battery Impact
- Screen-on time: Normal (comparable to other games)
- Background: Minimal (no active processing)

---

## Development Order Summary

### Week 1: Core Display
1. Set up component structure
2. Load and display static room
3. Position all objects correctly
4. Make objects tappable
5. Add selection highlighting

### Week 2: Navigation & Interaction
6. Implement zoom and pan
7. Add auto-zoom to selected object
8. Create interaction modals
9. Connect to StateManager
10. Test basic gameplay loop

### Week 3: Polish & Features
11. Add animations and effects
12. Implement sound effects
13. Build inventory system
14. Add hints and help
15. Create settings menu

### Week 4: Multi-Room & Testing
16. Implement room transitions
17. Test with multiple rooms
18. Performance optimization
19. Bug fixes and polish
20. Final testing pass

---

## Success Criteria

The isometric room viewer is complete when:

✅ Player can see and navigate the entire room
✅ All objects can be selected and interacted with
✅ All trigger types work (locks, keypads, containers)
✅ Inventory system works
✅ State saves and loads correctly
✅ UI is responsive on all target devices
✅ Performance meets targets
✅ No critical bugs
✅ Training Basement is fully playable
✅ System works for any room (reusable)

---

## Next Steps After Implementation

Once the isometric viewer is complete:

1. Create additional test rooms
2. Add more trigger types (switch combinations, terminal commands)
3. Implement achievements/statistics
4. Add music and ambient sounds
5. Create room editor tool (optional)
6. Add multiplayer support (future)
7. Implement AR "Focus Mode" (future)

---

## Notes for Implementation

- **Start simple, add complexity:** Get basic functionality working first, then enhance
- **Test frequently:** After each phase, verify everything works before moving on
- **Placeholder art is fine:** Don't wait for final art to start coding
- **Reusability is key:** Build components that work for any room, not just Training Basement
- **State-driven UI:** All visuals should reflect state, not the other way around
- **Performance matters:** Test on real devices early and often

Good luck with implementation! 🚀
