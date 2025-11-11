import React from 'react';
import { G, Rect, Circle, Line, Text } from 'react-native-svg';

interface VentProps {
  transform?: string;
}

export default function Vent({ transform }: VentProps) {
  return (
    <G transform={transform} originX={128} originY={128}>
      {/* Simple front view vent */}

      {/* Outer frame */}
      <Rect
        x="10"
        y="70"
        width="236"
        height="116"
        fill="#8A8A8A"
        stroke="#5A5A5A"
        strokeWidth="4"
        rx="3"
      />

      {/* Inner recess (dark) */}
      <Rect
        x="20"
        y="80"
        width="216"
        height="96"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />

      {/* Horizontal slats (simple rectangles) */}
      <Rect x="25" y="90" width="206" height="12" fill="#6A6A6A" stroke="#4A4A4A" strokeWidth="1" rx="1" />
      <Rect x="25" y="108" width="206" height="12" fill="#6A6A6A" stroke="#4A4A4A" strokeWidth="1" rx="1" />
      <Rect x="25" y="126" width="206" height="12" fill="#6A6A6A" stroke="#4A4A4A" strokeWidth="1" rx="1" />
      <Rect x="25" y="144" width="206" height="12" fill="#6A6A6A" stroke="#4A4A4A" strokeWidth="1" rx="1" />
      <Rect x="25" y="162" width="206" height="12" fill="#6A6A6A" stroke="#4A4A4A" strokeWidth="1" rx="1" />

      {/* Screw holes in corners */}
      <Circle cx="25" cy="85" r="4" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5" />
      <Circle cx="231" cy="85" r="4" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5" />
      <Circle cx="25" cy="171" r="4" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5" />
      <Circle cx="231" cy="171" r="4" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Screw cross details */}
      <Line x1="22" y1="85" x2="28" y2="85" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="25" y1="82" x2="25" y2="88" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="228" y1="85" x2="234" y2="85" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="231" y1="82" x2="231" y2="88" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="22" y1="171" x2="28" y2="171" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="25" y1="168" x2="25" y2="174" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="228" y1="171" x2="234" y2="171" stroke="#4A4A4A" strokeWidth="1" />
      <Line x1="231" y1="168" x2="231" y2="174" stroke="#4A4A4A" strokeWidth="1" />

      {/* Hidden clue: Paper showing "42--" visible between slats */}
      <G opacity="0.7">
        <Rect x="110" y="129" width="36" height="8" fill="#F5F5DC" rx="1" />
        <Text x="114" y="136" fontFamily="monospace" fontSize="7" fill="#333333" fontWeight="bold">
          42--
        </Text>
      </G>

      {/* Shadow (depth) */}
      <Rect x="13" y="73" width="236" height="116" fill="none" stroke="#000000" strokeWidth="2" opacity="0.1" transform="translate(2, 2)" />
    </G>
  );
}
