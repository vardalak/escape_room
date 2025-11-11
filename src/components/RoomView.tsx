import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, { G } from 'react-native-svg';
import RoomBackground from './room/RoomBackground';
import Desk from './room/Desk';
import FilingCabinet from './room/FilingCabinet';
import Poster from './room/Poster';
import ExitDoor from './room/ExitDoor';
import Vent from './room/Vent';
import Brick from './room/Brick';
import Cot from './room/Cot';
import CellBars from './room/CellBars';
import GunRack from './room/GunRack';
import Horse from './room/Horse';
import SaddleBags from './room/SaddleBags';
import HayBales from './room/HayBales';
import Horseshoes from './room/Horseshoes';
import WaterTrough from './room/WaterTrough';
import GenericObject from './room/GenericObject';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RoomViewProps {
  onObjectTap?: (objectId: string) => void;
  roomId?: string;
  items?: any[];
}

// Room-specific object configurations
// TODO: These should eventually move into the experience JSON files to be fully data-driven
// Currently they define visual rendering properties (scale, width, height) for each item
const roomConfigurations: { [key: string]: any } = {
  'basement': {  // Training Basement
    objects: [
      { id: 'motivational_poster', x: 200, y: 220, scale: 0.65, width: 256, height: 256 },
      { id: 'ventilation_grate', x: 180, y: 480, scale: 0.55, width: 256, height: 256 },
      { id: 'exit_door', x: 650, y: 360, scale: 0.65, width: 512, height: 512 },
      { id: 'filing_cabinet', x: 700, y: 650, scale: 0.48, width: 512, height: 512 },
      { id: 'desk', x: 350, y: 650, scale: 0.48, width: 512, height: 512 },
    ],
  },
  'jail_cell': {  // Sheriff's Last Ride - Jail
    objects: [
      { id: 'cell_bars', x: 100, y: 600, scale: 0.5, width: 256, height: 512 },
      { id: 'jail_cot', x: 700, y: 600, scale: 0.5, width: 512, height: 256 },
      { id: 'brick_wall', x: 400, y: 450, scale: 0.55, width: 512, height: 512 },
      { id: 'loose_brick', x: 400, y: 480, scale: 0.35, width: 256, height: 256 },
      { id: 'cell_door', x: 250, y: 300, scale: 0.65, width: 512, height: 512 },
      { id: 'barred_window', x: 650, y: 200, scale: 0.4, width: 256, height: 256 },
    ],
  },
  'sheriffs_office': {  // Sheriff's Last Ride - Office
    objects: [
      { id: 'sheriffs_desk', x: 500, y: 650, scale: 0.48, width: 512, height: 512 },
      { id: 'wanted_posters', x: 200, y: 250, scale: 0.6, width: 256, height: 256 },
      { id: 'gun_rack', x: 600, y: 280, scale: 0.55, width: 256, height: 256 },
      { id: 'office_window', x: 150, y: 150, scale: 0.5, width: 256, height: 256 },
      { id: 'back_door', x: 800, y: 400, scale: 0.6, width: 512, height: 512 },
    ],
  },
  'stables': {  // Sheriff's Last Ride - Stables
    objects: [
      { id: 'horse', x: 550, y: 550, scale: 0.55, width: 512, height: 512 },
      { id: 'saddle_bags', x: 550, y: 580, scale: 0.35, width: 256, height: 256 },
      { id: 'hay_bales', x: 750, y: 700, scale: 0.45, width: 256, height: 256 },
      { id: 'horseshoes', x: 200, y: 250, scale: 0.4, width: 256, height: 256 },
      { id: 'water_trough', x: 300, y: 650, scale: 0.45, width: 512, height: 256 },
      { id: 'stable_doors', x: 800, y: 350, scale: 0.65, width: 512, height: 512 },
    ],
  },
};

export default function RoomView({ onObjectTap, roomId = 'basement', items = [] }: RoomViewProps) {
  // Pan and zoom state
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [currentScale, setCurrentScale] = useState(1);
  const [currentPan, setCurrentPan] = useState({ x: 0, y: 0 });

  // Track gesture state
  const lastScale = useRef(1);
  const lastPan = useRef({ x: 0, y: 0 });
  const initialDistance = useRef(0);
  const tapStartPosition = useRef({ x: 0, y: 0 });
  const isTwoFingerGesture = useRef(false);

  // Store current filtered objects in a ref so handleTap always uses the latest
  const currentObjectsRef = useRef<any[]>([]);

  // Get objects for current room
  const roomConfig = roomConfigurations[roomId] || roomConfigurations['basement'];
  const allObjects = roomConfig.objects || [];

  // Filter objects based on item visibility from game state
  const objects = allObjects.filter(obj => {
    // Backwards compatibility: If items prop is not provided AND we're in training_basement, show all objects
    if ((!items || items.length === 0) && roomId === 'basement') {
      return true;
    }

    // If items prop is empty but we're NOT in training_basement, hide everything
    if (!items || items.length === 0) {
      return false;
    }

    // Find the corresponding item in the items prop
    const item = items.find(i => i.id === obj.id);

    // If item not found in the game state, don't show it (it doesn't exist in this room)
    if (!item) {
      return false;
    }

    // Only show if item is visible
    return item.isVisible === true;
  });

  // Update the ref with the current filtered objects
  currentObjectsRef.current = objects;

  // Calculate distance between two touches
  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Pan responder for handling gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2) {
          // Two-finger gesture - prepare for pinch zoom
          initialDistance.current = getDistance(touches);
          isTwoFingerGesture.current = true;
        } else {
          // Single finger - track start position for tap detection
          isTwoFingerGesture.current = false;
          tapStartPosition.current = {
            x: evt.nativeEvent.pageX,
            y: evt.nativeEvent.pageY,
          };
        }

        // Store last known values
        lastPan.current = currentPan;
        lastScale.current = currentScale;
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2) {
          // Two-finger pinch zoom
          const currentDistance = getDistance(touches);
          if (initialDistance.current > 0) {
            const scaleMultiplier = currentDistance / initialDistance.current;
            let newScale = lastScale.current * scaleMultiplier;

            // Clamp scale between 0.5x and 3x
            newScale = Math.max(0.5, Math.min(3, newScale));

            setCurrentScale(newScale);
            scale.setValue(newScale);
          }

          // Two-finger pan
          const newX = lastPan.current.x + gestureState.dx;
          const newY = lastPan.current.y + gestureState.dy;

          setCurrentPan({ x: newX, y: newY });
          pan.setValue({ x: newX, y: newY });
        } else if (touches.length === 1) {
          // Single-finger tap - we'll handle this on release
          // Don't pan on single finger to allow tap detection
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        // Check if this was a tap (minimal movement)
        const dragDistance = Math.sqrt(
          gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
        );

        // If it was a single finger gesture with minimal movement, treat as tap
        if (!isTwoFingerGesture.current && dragDistance < 10) {
          handleTap(evt);
        }

        // Update last known positions
        lastPan.current = currentPan;
        lastScale.current = currentScale;
        initialDistance.current = 0;
        isTwoFingerGesture.current = false;
      },
    })
  ).current;

  // Handle tap on objects
  const handleTap = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;

    // The SVG is 1000x1000 and fills the container which is centered on screen
    // locationX/Y are relative to the container, not the screen
    // We need to convert from container coordinates to SVG coordinates

    // Account for pan and zoom transformations
    const svgX = (locationX - currentPan.x) / currentScale;
    const svgY = (locationY - currentPan.y) / currentScale;

    // Use the ref to get the current filtered objects (not the closure value)
    const currentObjects = currentObjectsRef.current;

    // Check if tap is within any object bounds
    // Objects are transformed with originX/originY at their viewBox center
    // So the hitbox should use the full viewBox dimensions centered at (x, y)
    // Check in REVERSE order (front to back) so floor objects (front) are checked first
    // Order in array: wall objects first, then floor objects
    // So reverse iteration checks floor objects first (they're in front)
    for (let i = currentObjects.length - 1; i >= 0; i--) {
      const obj = currentObjects[i];
      // Use full viewBox dimensions for hitbox
      const halfWidth = (obj.width * obj.scale) / 2;
      const halfHeight = (obj.height * obj.scale) / 2;

      const objLeft = obj.x - halfWidth;
      const objRight = obj.x + halfWidth;
      const objTop = obj.y - halfHeight;
      const objBottom = obj.y + halfHeight;

      if (
        svgX >= objLeft &&
        svgX <= objRight &&
        svgY >= objTop &&
        svgY <= objBottom
      ) {
        onObjectTap?.(obj.id);
        return;
      }
    }
  };

  // Render individual object based on ID
  const renderObject = (obj: ObjectPosition) => {
    // Transform: translate to position, then scale from center
    // To scale from center, we translate by -half dimensions, scale, then translate back
    const centerX = obj.width / 2;
    const centerY = obj.height / 2;
    const transform = `translate(${obj.x - centerX * obj.scale}, ${obj.y - centerY * obj.scale}) scale(${obj.scale})`;

    // Try to match known SVG components
    switch (obj.id) {
      case 'desk':
      case 'sheriffs_desk':
        return <Desk key={obj.id} transform={transform} />;
      case 'filing_cabinet':
        return <FilingCabinet key={obj.id} transform={transform} />;
      case 'motivational_poster':
      case 'poster':
      case 'wanted_posters':
        return <Poster key={obj.id} transform={transform} />;
      case 'exit_door':
      case 'cell_door':
      case 'back_door':
      case 'stable_doors':
        return <ExitDoor key={obj.id} transform={transform} />;
      case 'ventilation_grate':
      case 'vent':
      case 'barred_window':
      case 'office_window':
        return <Vent key={obj.id} transform={transform} />;
      case 'loose_brick':
      case 'brick_wall':
        return <Brick key={obj.id} transform={transform} />;
      case 'jail_cot':
        return <Cot key={obj.id} transform={transform} />;
      case 'cell_bars':
        return <CellBars key={obj.id} transform={transform} />;
      case 'gun_rack':
        return <GunRack key={obj.id} transform={transform} />;
      case 'horse':
        return <Horse key={obj.id} transform={transform} />;
      case 'saddle_bags':
        return <SaddleBags key={obj.id} transform={transform} />;
      case 'hay_bales':
        return <HayBales key={obj.id} transform={transform} />;
      case 'horseshoes':
        return <Horseshoes key={obj.id} transform={transform} />;
      case 'water_trough':
        return <WaterTrough key={obj.id} transform={transform} />;
      default:
        // Use generic placeholder for objects without custom SVG
        return <GenericObject key={obj.id} transform={transform} label={obj.id} />;
    }
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.roomContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale },
            ],
          },
        ]}
      >
        <Svg width={1000} height={1000} viewBox="0 0 1000 1000">
          {/* Room background */}
          <RoomBackground />

          {/* Render all objects in z-order (back to front) */}
          <G>
            {objects.map((obj) => renderObject(obj))}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomContainer: {
    width: 1000,
    height: 1000,
  },
});
