# 2D Room Viewer - Implementation Guide

## Overview
This document describes the current implementation of the 2D side-view room viewer interface. The room is rendered as a simple rectangular layout with a back wall and floor, with objects displayed from front/side views for easy interaction.

---

## Design Philosophy

### Simple 2D Approach
- **No perspective calculations** - Everything is positioned with simple X/Y coordinates
- **Front-view objects** - All items rendered straight-on (no isometric angles)
- **Rectangular hitboxes** - Easy tap detection with simple bounding box math
- **SVG-based graphics** - Scalable, code-generated artwork

### Room Layout
```
┌─────────────────────────────────────┐
│          Back Wall (grey)           │ y=50-800
│  [poster]  [vent]     [exit door]   │
│                                     │
├─────────────────────────────────────┤ y=800 (floor line)
│            Floor (dark grey)        │ y=800-950
│      [desk]         [filing cab]    │
└─────────────────────────────────────┘
  x=50                            x=950
```

---

## Current Implementation Status

### ✅ Phase 1: Complete - Static Room Display

#### 1.1 SVG Assets Created
All assets are code-generated SVG components:

**Room Background** (`src/components/room/RoomBackground.tsx`)
- Simple rectangular wall (900×750)
- Floor area (900×150)
- Grid paneling for visual interest
- ViewBox: 1000×1000

**Objects** (All with front-view perspective):

1. **Desk** (`src/components/room/Desk.tsx`)
   - Size: 512×512 viewBox
   - Front view with 3 drawers on left
   - Side panel on right for depth
   - Bottom drawer locked (visible padlock)
   - Simple rectangular legs
   - Shadow for depth

2. **Filing Cabinet** (`src/components/room/FilingCabinet.tsx`)
   - Size: 512×512 viewBox
   - Front view with 2 large drawers
   - Labels: "A-M" (top), "N-Z" (bottom)
   - Bottom drawer unlocked (green open lock indicator)
   - Side edge for depth
   - Metal texture lines

3. **Exit Door** (`src/components/room/ExitDoor.tsx`)
   - Size: 512×512 viewBox
   - Front view with decorative panels
   - Functional keypad on right (3×4 button grid)
   - Digital display screen
   - Red locked indicator light
   - "EXIT" sign above
   - Door handle on left

4. **Poster** (`src/components/room/Poster.tsx`)
   - Size: 256×256 viewBox
   - Flat front view
   - Blue banner with "START HERE"
   - Red arrow pointing down
   - Motivational quote
   - **Hidden clue**: "4217" in decorative circles (very low opacity)

5. **Vent** (`src/components/room/Vent.tsx`)
   - Size: 256×256 viewBox
   - Front view with horizontal slats
   - Screw holes in corners with cross-head details
   - **Hidden clue**: Paper visible showing "42--" between slats

#### 1.2 Room Component Structure

**Main Component** (`src/components/RoomView.tsx`)
```typescript
interface RoomViewProps {
  onObjectTap?: (objectId: string) => void;
}

// Manages:
// - Pan and zoom gestures (two-finger)
// - Tap detection (single finger)
// - Object positioning
// - Render coordination
```

**Component Structure**
```
src/components/
├── RoomView.tsx          # Main container with gestures
└── room/
    ├── RoomBackground.tsx
    ├── Desk.tsx
    ├── FilingCabinet.tsx
    ├── Poster.tsx
    ├── ExitDoor.tsx
    └── Vent.tsx
```

#### 1.3 Coordinate System

**Simple 2D Positioning**
```typescript
interface ObjectPosition {
  id: string;
  x: number;      // Center X position (50-950)
  y: number;      // Center Y position (50-950)
  scale: number;  // Size multiplier (0.4-0.7)
  width: number;  // Base width (256 or 512)
  height: number; // Base height (256 or 512)
}
```

**Room Boundaries**
- Wall area: x=50 to x=950, y=50 to y=800
- Floor area: x=50 to x=950, y=800 to y=950
- Total viewBox: 1000×1000

**Current Object Positions**
```typescript
const objects: ObjectPosition[] = [
  // Wall-mounted objects
  { id: 'poster', x: 200, y: 220, scale: 0.65, width: 256, height: 256 },
  { id: 'vent', x: 200, y: 520, scale: 0.55, width: 256, height: 256 },
  { id: 'exit_door', x: 650, y: 360, scale: 0.65, width: 512, height: 512 },

  // Floor objects
  { id: 'filing_cabinet', x: 700, y: 600, scale: 0.48, width: 512, height: 512 },
  { id: 'desk', x: 280, y: 600, scale: 0.48, width: 512, height: 512 },
];
```

All objects are bounded within their respective areas (wall or floor).

#### 1.4 Rendering Pipeline

**SVG Rendering**
```tsx
<Svg width={1000} height={1000} viewBox="0 0 1000 1000">
  <RoomBackground />
  <G>
    {objects.map((obj) => renderObject(obj))}
  </G>
</Svg>
```

**Object Transform**
```typescript
const transform = `translate(${obj.x}, ${obj.y}) scale(${obj.scale})`;
```

Objects are centered at their (x, y) position and scaled uniformly.

---

### ✅ Phase 2: Complete - Basic Interaction

#### 2.1 Gesture Handling

**Two-Finger Gestures** (Pan and Zoom)
```typescript
// Pinch to zoom: 0.5x to 3x scale
// Pan: Two-finger drag
// Uses PanResponder API
```

**Single-Finger Tap** (Object Selection)
```typescript
// Tap detection with drag threshold (<10px movement)
// Converts screen coordinates to SVG coordinates
// Checks rectangular bounds for each object
// Triggers onObjectTap callback
```

#### 2.2 Hit Detection

**Bounding Box Calculation**
```typescript
// Objects are centered, so bounds are:
const halfWidth = (obj.width * obj.scale) / 2;
const halfHeight = (obj.height * obj.scale) / 2;

const objLeft = obj.x - halfWidth;
const objRight = obj.x + halfWidth;
const objTop = obj.y - halfHeight;
const objBottom = obj.y + halfHeight;
```

**Coordinate Transformation**
```typescript
// Convert tap location to SVG coordinates
const svgX = (locationX - currentPan.x) / currentScale;
const svgY = (locationY - currentPan.y) / currentScale;
```

**Z-Order Priority**
- Objects checked in reverse order (last rendered = front-most)
- Ensures foreground objects intercept taps first

#### 2.3 User Feedback

**Current Implementation**
```typescript
// Alert dialog shows tapped object name
Alert.alert('Object Tapped', `You tapped: ${objectName}`);
```

**App Header**
- Shows room name: "Training Basement - Escape Room"
- Instructions: "Use two fingers to pan and pinch to zoom"
- Displays selected object name

---

## Next Steps (Not Yet Implemented)

### Phase 3: Item Examination Modal

**Goal:** Show detailed view when object is tapped

- [ ] Create ExaminationModal component
  - [ ] Full-screen overlay
  - [ ] Close button (X in top corner)
  - [ ] Object name as header
  - [ ] Detailed description text
  - [ ] Available actions list

- [ ] Load object data from game state
  - [ ] Descriptions from JSON
  - [ ] Available actions based on state
  - [ ] Lock status, contents, etc.

- [ ] Handle modal state
  - [ ] Show/hide on tap
  - [ ] Disable room gestures when modal open
  - [ ] Animate modal entrance/exit

### Phase 4: Game State Integration

**Goal:** Connect to actual game logic

- [ ] Load experience from JSON
  ```typescript
  const experience = await experienceManager.loadExperience(trainingBasementData);
  stateManager.setExperience(experience);
  ```

- [ ] Sync object states
  - [ ] Update visuals based on state (locked/unlocked)
  - [ ] Show/hide objects dynamically
  - [ ] Reflect acquired items

- [ ] Implement actions
  - [ ] Open containers
  - [ ] Use keys on triggers
  - [ ] Enter codes on keypad
  - [ ] Examine for clues

### Phase 5: Polish & Enhancement

**Goal:** Professional game experience

- [ ] Animations
  - [ ] Modal slide-in/out
  - [ ] Object highlight on tap
  - [ ] Unlock animations
  - [ ] Item acquisition feedback

- [ ] Sound effects
  - [ ] Drawer opening
  - [ ] Keypad beeps
  - [ ] Lock clicks
  - [ ] Success/failure sounds

- [ ] Visual effects
  - [ ] Glow on interactive objects
  - [ ] Particle effects for discoveries
  - [ ] Screen shake for failures

- [ ] UI improvements
  - [ ] Inventory display
  - [ ] Hint system
  - [ ] Progress indicators
  - [ ] Timer display

---

## Technical Architecture

### Key Technologies
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **react-native-svg** - Vector graphics rendering

### Performance Considerations
- SVG files are small (~10-50KB each)
- No complex calculations (simple 2D math)
- Efficient hit detection (reverse iteration)
- Minimal re-renders (gestures use refs)

### File Organization
```
src/
├── components/
│   ├── RoomView.tsx              # Main room container
│   └── room/
│       ├── RoomBackground.tsx    # Wall + floor
│       ├── Desk.tsx              # Front-view desk
│       ├── FilingCabinet.tsx     # Front-view cabinet
│       ├── ExitDoor.tsx          # Front-view door
│       ├── Poster.tsx            # Front-view poster
│       └── Vent.tsx              # Front-view vent
├── models/                        # Game logic (existing)
├── services/                      # State management (existing)
└── utils/                         # Validators (existing)

assets/rooms/training_basement/svg/  # Original SVG files
```

---

## Design Decisions

### Why 2D Instead of Isometric?

**Original Plan:** Isometric (45° angle) perspective
**Problem:** Complex coordinate calculations, difficult hitbox placement

**Solution:** Simple 2D side view
**Benefits:**
- ✅ Easy positioning (just X/Y)
- ✅ Simple rectangular hitboxes
- ✅ Front-facing objects (more detail visible)
- ✅ No perspective math needed
- ✅ Faster development

### Why Front-View Objects?

**Original Plan:** Isometric-angled object sprites
**Problem:** Hard to align, inconsistent hitboxes

**Solution:** Front/side view objects
**Benefits:**
- ✅ Hitbox matches visual bounds exactly
- ✅ More detail visible (faces directly at viewer)
- ✅ Easier to create and modify
- ✅ Consistent across all objects

---

## Testing Checklist

### Basic Display
- [x] Room background renders correctly
- [x] All 5 objects visible
- [x] Objects positioned within bounds
- [x] No clipping or overlap issues

### Gestures
- [x] Pinch to zoom (0.5x - 3x)
- [x] Two-finger pan
- [x] Single-finger tap detection
- [x] Tap alerts show correct object

### Visual Quality
- [x] SVG scaling is crisp
- [x] Colors and shading look good
- [x] Text is readable
- [x] Clues are visible but subtle

### Next to Test
- [ ] Modal opens on tap
- [ ] Game state updates visuals
- [ ] Actions work correctly
- [ ] Animations are smooth

---

## Known Issues & Limitations

### Current Limitations
1. No game logic connected (just visual display)
2. Taps only show alerts (no actual interaction)
3. No inventory system
4. No state persistence
5. Single room only (no navigation)

### Future Considerations
1. **Multi-room support** - How to transition between rooms?
2. **Responsive sizing** - Handle different screen sizes better
3. **Accessibility** - Screen reader support, larger tap targets
4. **Tutorial** - First-time user guidance

---

## Development Notes

### Adding New Objects
1. Create SVG component in `src/components/room/`
2. Use front-view perspective (not isometric)
3. Include depth through shading/side panels
4. Keep within 512×512 or 256×256 viewBox
5. Add to object array in RoomView.tsx
6. Position within room boundaries

### Modifying Room Layout
- Wall bounds: x=50-950, y=50-800
- Floor bounds: x=50-950, y=800-950
- Keep objects centered within areas
- Remember hitbox = center ± (size*scale)/2

### Performance Tips
- SVG components are React components (memoize if needed)
- Gestures use refs (no re-renders)
- Keep hitbox checks simple (early exit on hit)

---

## Conclusion

The 2D room viewer provides a simple, efficient foundation for the escape room game. The front-view approach makes positioning and interaction straightforward, allowing focus on game mechanics rather than complex rendering logic.

Next priority: **Phase 3 - Item Examination Modal** to enable actual gameplay interactions.
