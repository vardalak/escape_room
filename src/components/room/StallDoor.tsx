import React from 'react';
import { G, Rect, Line, Path } from 'react-native-svg';

interface StallDoorProps {
  transform?: string;
}

export default function StallDoor({ transform }: StallDoorProps) {
  return (
    <G transform={transform} originX={256} originY={256}>
      {/* Door frame */}
      <Rect
        x="50"
        y="80"
        width="412"
        height="380"
        fill="#7D5A3C"
        stroke="#5A3828"
        strokeWidth="4"
      />

      {/* Upper half - horizontal slats */}
      <Rect
        x="65"
        y="95"
        width="382"
        height="180"
        fill="#8B6F47"
        stroke="#6B5537"
        strokeWidth="2"
      />

      {/* Horizontal slats (you can see through) */}
      <Line x1="65" y1="110" x2="447" y2="110" stroke="#4A3828" strokeWidth="3" />
      <Rect x="65" y="115" width="382" height="15" fill="#000000" opacity="0.2" />

      <Line x1="65" y1="145" x2="447" y2="145" stroke="#4A3828" strokeWidth="3" />
      <Rect x="65" y="150" width="382" height="15" fill="#000000" opacity="0.2" />

      <Line x1="65" y1="180" x2="447" y2="180" stroke="#4A3828" strokeWidth="3" />
      <Rect x="65" y="185" width="382" height="15" fill="#000000" opacity="0.2" />

      <Line x1="65" y1="215" x2="447" y2="215" stroke="#4A3828" strokeWidth="3" />
      <Rect x="65" y="220" width="382" height="15" fill="#000000" opacity="0.2" />

      <Line x1="65" y1="250" x2="447" y2="250" stroke="#4A3828" strokeWidth="3" />

      {/* Lower half - solid planks */}
      <Rect
        x="65"
        y="280"
        width="382"
        height="170"
        fill="#8B6F47"
        stroke="#6B5537"
        strokeWidth="2"
      />

      {/* Vertical plank lines */}
      <Line x1="130" y1="280" x2="130" y2="450" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="195" y1="280" x2="195" y2="450" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="256" y1="280" x2="256" y2="450" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="317" y1="280" x2="317" y2="450" stroke="#6B5537" strokeWidth="2" opacity="0.4" />
      <Line x1="382" y1="280" x2="382" y2="450" stroke="#6B5537" strokeWidth="2" opacity="0.4" />

      {/* Cross brace on lower half */}
      <Rect
        x="75"
        y="340"
        width="362"
        height="12"
        fill="#6B5537"
        stroke="#4A3828"
        strokeWidth="2"
      />

      {/* Iron hinges (left side) */}
      <Rect
        x="45"
        y="150"
        width="30"
        height="40"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
        rx="2"
      />

      <Rect
        x="45"
        y="370"
        width="30"
        height="40"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
        rx="2"
      />

      {/* Door latch (right side) */}
      <Rect
        x="430"
        y="290"
        width="35"
        height="15"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
        rx="2"
      />

      {/* Horse silhouette visible through slats (simple shapes) */}
      <Path
        d="M 150 140 Q 180 135 200 140 L 200 170 Q 195 180 190 180 Q 185 175 180 175 L 180 145 Z"
        fill="#2A2A2A"
        opacity="0.3"
      />

      <Path
        d="M 280 150 Q 310 145 330 150 L 330 180 Q 325 190 320 190 Q 315 185 310 185 L 310 155 Z"
        fill="#2A2A2A"
        opacity="0.3"
      />

      {/* Wood grain details */}
      <Line x1="100" y1="320" x2="115" y2="325" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />
      <Line x1="220" y1="380" x2="235" y2="375" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />
      <Line x1="340" y1="400" x2="355" y2="405" stroke="#7B6F47" strokeWidth="1" opacity="0.3" />

      {/* Shadow at base */}
      <Rect
        x="50"
        y="460"
        width="412"
        height="8"
        fill="#000000"
        opacity="0.2"
        rx="2"
      />
    </G>
  );
}
