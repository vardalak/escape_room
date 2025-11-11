import React from 'react';
import { G, Rect, Circle, Ellipse, Path } from 'react-native-svg';

interface HorseProps {
  transform?: string;
}

export default function Horse({ transform }: HorseProps) {
  return (
    <G transform={transform}>
      {/* Body */}
      <Ellipse
        cx="200"
        cy="280"
        rx="100"
        ry="80"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="3"
      />

      {/* Neck */}
      <Rect
        x="260"
        y="200"
        width="40"
        height="100"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
        transform="rotate(-30 280 250)"
      />

      {/* Head */}
      <Ellipse
        cx="300"
        cy="170"
        rx="30"
        ry="40"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Ear */}
      <Path
        d="M 295 140 L 290 125 L 300 130 Z"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="1"
      />

      {/* Eye */}
      <Circle cx="310" cy="165" r="4" fill="#000000" />

      {/* Mane */}
      <Path
        d="M 285 150 Q 275 160 280 180 Q 285 200 280 220"
        stroke="#654321"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Legs - front left */}
      <Rect
        x="230"
        y="320"
        width="20"
        height="80"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Legs - front right */}
      <Rect
        x="260"
        y="320"
        width="20"
        height="80"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Legs - back left */}
      <Rect
        x="140"
        y="320"
        width="20"
        height="80"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Legs - back right */}
      <Rect
        x="170"
        y="320"
        width="20"
        height="80"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Hooves */}
      <Rect x="230" y="395" width="20" height="10" fill="#2A2A2A" />
      <Rect x="260" y="395" width="20" height="10" fill="#2A2A2A" />
      <Rect x="140" y="395" width="20" height="10" fill="#2A2A2A" />
      <Rect x="170" y="395" width="20" height="10" fill="#2A2A2A" />

      {/* Tail */}
      <Path
        d="M 110 270 Q 60 280 50 320 Q 55 340 70 350"
        stroke="#654321"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />

      {/* Shadow */}
      <Ellipse
        cx="200"
        cy="405"
        rx="110"
        ry="15"
        fill="#000000"
        opacity="0.2"
      />
    </G>
  );
}
