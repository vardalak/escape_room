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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RoomViewProps {
  onObjectTap?: (objectId: string) => void;
}

// Defined inline below with objects array

export default function RoomView({ onObjectTap }: RoomViewProps) {
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

  // Object positions in 2D rectangular room
  // Wall area: x=50 to x=950, y=50 to y=800
  // Floor area: x=50 to x=950, y=800 to y=950
  // All objects use originX/originY to center their transform at the viewBox center
  // So hitboxes should just use the full viewBox dimensions since that's what's being transformed
  interface ObjectPosition {
    id: string;
    x: number;
    y: number;
    scale: number;
    width: number;      // SVG viewBox size (used for rendering AND hitbox)
    height: number;     // SVG viewBox size (used for rendering AND hitbox)
  }

  const objects: ObjectPosition[] = [
    // Wall objects (mounted on back wall) - these are BEHIND floor objects
    { id: 'poster', x: 200, y: 220, scale: 0.65, width: 256, height: 256 },
    { id: 'vent', x: 180, y: 480, scale: 0.55, width: 256, height: 256 },  // Moved up and left
    { id: 'exit_door', x: 650, y: 360, scale: 0.65, width: 512, height: 512 },

    // Floor objects (in front of wall) - these are IN FRONT
    { id: 'filing_cabinet', x: 700, y: 650, scale: 0.48, width: 512, height: 512 },  // Moved down slightly
    { id: 'desk', x: 350, y: 650, scale: 0.48, width: 512, height: 512 },  // Moved right and down
  ];

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

    console.log('Tap at:', { locationX, locationY, svgX, svgY, scale: currentScale, pan: currentPan });

    // Check if tap is within any object bounds
    // Objects are transformed with originX/originY at their viewBox center
    // So the hitbox should use the full viewBox dimensions centered at (x, y)
    // Check in REVERSE order (front to back) so floor objects (front) are checked first
    // Order in array: wall objects first, then floor objects
    // So reverse iteration checks floor objects first (they're in front)
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      // Use full viewBox dimensions for hitbox
      const halfWidth = (obj.width * obj.scale) / 2;
      const halfHeight = (obj.height * obj.scale) / 2;

      const objLeft = obj.x - halfWidth;
      const objRight = obj.x + halfWidth;
      const objTop = obj.y - halfHeight;
      const objBottom = obj.y + halfHeight;

      console.log(`Checking ${obj.id}:`, {
        bounds: { left: objLeft, right: objRight, top: objTop, bottom: objBottom },
        tapPoint: { svgX, svgY }
      });

      if (
        svgX >= objLeft &&
        svgX <= objRight &&
        svgY >= objTop &&
        svgY <= objBottom
      ) {
        console.log(`HIT: ${obj.id}`);
        onObjectTap?.(obj.id);
        return;
      }
    }
    console.log('No object hit');
  };

  // Render individual object based on ID
  const renderObject = (obj: ObjectPosition) => {
    // Transform: translate to position, then scale from center
    // To scale from center, we translate by -half dimensions, scale, then translate back
    const centerX = obj.width / 2;
    const centerY = obj.height / 2;
    const transform = `translate(${obj.x - centerX * obj.scale}, ${obj.y - centerY * obj.scale}) scale(${obj.scale})`;

    switch (obj.id) {
      case 'desk':
        return <Desk key={obj.id} transform={transform} />;
      case 'filing_cabinet':
        return <FilingCabinet key={obj.id} transform={transform} />;
      case 'poster':
        return <Poster key={obj.id} transform={transform} />;
      case 'exit_door':
        return <ExitDoor key={obj.id} transform={transform} />;
      case 'vent':
        return <Vent key={obj.id} transform={transform} />;
      default:
        return null;
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
