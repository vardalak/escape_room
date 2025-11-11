import React from 'react';
import { G, Rect, Circle, Line } from 'react-native-svg';

interface WesternDoorProps {
  transform?: string;
}

export default function WesternDoor({ transform }: WesternDoorProps) {
  return (
    <G transform={transform} originX={106} originY={170}>
      {/* Door frame - weathered wood */}
      <Rect
        x="0"
        y="0"
        width="212"
        height="340"
        fill="#5A4A3A"
        stroke="#3A2A1A"
        strokeWidth="4"
      />

      {/* Door surface - vertical planks */}
      <Rect
        x="15"
        y="15"
        width="182"
        height="310"
        fill="#8B6F47"
        stroke="#6B5537"
        strokeWidth="3"
      />

      {/* Vertical wood planks (texture) */}
      <Line x1="50" y1="15" x2="50" y2="325" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="85" y1="15" x2="85" y2="325" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="120" y1="15" x2="120" y2="325" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="155" y1="15" x2="155" y2="325" stroke="#6B5537" strokeWidth="2" opacity="0.4" />

      {/* Horizontal support beams */}
      <Rect
        x="20"
        y="50"
        width="172"
        height="16"
        fill="#6B5537"
        stroke="#4A3828"
        strokeWidth="2"
      />
      <Rect
        x="20"
        y="160"
        width="172"
        height="16"
        fill="#6B5537"
        stroke="#4A3828"
        strokeWidth="2"
      />
      <Rect
        x="20"
        y="270"
        width="172"
        height="16"
        fill="#6B5537"
        stroke="#4A3828"
        strokeWidth="2"
      />

      {/* Iron hinges (left side) */}
      <Rect
        x="5"
        y="40"
        width="25"
        height="35"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
        rx="2"
      />
      <Circle cx="17" cy="57" r="4" fill="#1A1A1A" />

      <Rect
        x="5"
        y="260"
        width="25"
        height="35"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
        rx="2"
      />
      <Circle cx="17" cy="277" r="4" fill="#1A1A1A" />

      {/* Door handle with keyhole (right side) */}
      <Circle cx="180" cy="170" r="10" fill="#4A4A4A" stroke="#2A2A2A" strokeWidth="2" />
      <Rect
        x="190"
        y="165"
        width="20"
        height="10"
        fill="#5A5A5A"
        stroke="#2A2A2A"
        strokeWidth="1.5"
        rx="2"
      />

      {/* Keyhole */}
      <Circle cx="180" cy="170" r="3" fill="#1A1A1A" />
      <Rect x="178" y="170" width="4" height="8" fill="#1A1A1A" />

      {/* Wood grain details */}
      <Line x1="25" y1="90" x2="40" y2="95" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />
      <Line x1="60" y1="120" x2="75" y2="115" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />
      <Line x1="95" y1="200" x2="110" y2="205" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />
      <Line x1="130" y1="230" x2="145" y2="225" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />

      {/* Shadow at base */}
      <Rect
        x="0"
        y="340"
        width="212"
        height="8"
        fill="#000000"
        opacity="0.2"
        rx="2"
      />
    </G>
  );
}
