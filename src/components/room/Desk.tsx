import React from 'react';
import { G, Rect, Circle, Line, Path } from 'react-native-svg';

interface DeskProps {
  transform?: string;
}

export default function Desk({ transform }: DeskProps) {
  return (
    <G transform={transform} originX={256} originY={256}>
      {/* Front view of desk */}

      {/* Desk body */}
      <Rect
        x="50"
        y="150"
        width="412"
        height="280"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="3"
      />

      {/* Desk top (slight depth) */}
      <Rect
        x="40"
        y="140"
        width="432"
        height="20"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Wood grain on top */}
      <Line x1="40" y1="145" x2="472" y2="145" stroke="#654321" strokeWidth="0.5" opacity="0.3" />
      <Line x1="40" y1="155" x2="472" y2="155" stroke="#654321" strokeWidth="0.5" opacity="0.3" />

      {/* Drawer 1 (Top) */}
      <Rect
        x="80"
        y="180"
        width="160"
        height="60"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
        rx="3"
      />
      <Circle cx="160" cy="210" r="6" fill="#444444" />
      <Line x1="80" y1="185" x2="240" y2="185" stroke="#654321" strokeWidth="1" opacity="0.4" />

      {/* Drawer 2 (Middle) */}
      <Rect
        x="80"
        y="250"
        width="160"
        height="60"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
        rx="3"
      />
      <Circle cx="160" cy="280" r="6" fill="#444444" />
      <Line x1="80" y1="255" x2="240" y2="255" stroke="#654321" strokeWidth="1" opacity="0.4" />

      {/* Drawer 3 (Bottom) - LOCKED */}
      <Rect
        x="80"
        y="320"
        width="160"
        height="60"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
        rx="3"
      />
      <Circle cx="160" cy="350" r="6" fill="#444444" />
      <Line x1="80" y1="325" x2="240" y2="325" stroke="#654321" strokeWidth="1" opacity="0.4" />

      {/* Lock on drawer 3 */}
      <Rect x="195" y="345" width="12" height="14" fill="#C0C0C0" stroke="#808080" strokeWidth="1.5" rx="2" />
      <Path
        d="M 198 345 Q 198 340 201 340 Q 204 340 204 345"
        fill="none"
        stroke="#808080"
        strokeWidth="2"
      />

      {/* Right side panel (depth) */}
      <Rect
        x="280"
        y="170"
        width="172"
        height="250"
        fill="#7D451A"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Legs (simple rectangles) */}
      <Rect x="60" y="430" width="30" height="60" fill="#654321" stroke="#4A3210" strokeWidth="2" />
      <Rect x="422" y="430" width="30" height="60" fill="#654321" stroke="#4A3210" strokeWidth="2" />

      {/* Shadow */}
      <Rect x="40" y="490" width="432" height="8" fill="#000000" opacity="0.15" rx="4" />
    </G>
  );
}
