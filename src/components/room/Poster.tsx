import React from 'react';
import { G, Rect, Text, Line, Polygon, Circle } from 'react-native-svg';

interface PosterProps {
  transform?: string;
}

export default function Poster({ transform }: PosterProps) {
  return (
    <G transform={transform} originX={128} originY={128}>
      {/* Simple front view poster */}

      {/* Poster frame */}
      <Rect
        x="10"
        y="10"
        width="236"
        height="236"
        fill="#FFFFFF"
        stroke="#333333"
        strokeWidth="4"
        rx="3"
      />

      {/* Inner matting */}
      <Rect
        x="20"
        y="20"
        width="216"
        height="216"
        fill="#F5F5F5"
        stroke="#666666"
        strokeWidth="1"
      />

      {/* Decorative banner */}
      <Rect
        x="30"
        y="40"
        width="196"
        height="50"
        fill="#4A90E2"
        stroke="#2E5C8A"
        strokeWidth="2"
        rx="6"
      />

      {/* START HERE text */}
      <Text
        x="128"
        y="73"
        fontFamily="Arial Black, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        START HERE
      </Text>

      {/* Arrow */}
      <Line x1="128" y1="100" x2="128" y2="140" stroke="#E74C3C" strokeWidth="5" />
      <Polygon points="128,140 118,125 138,125" fill="#E74C3C" />

      {/* Quote */}
      <Text x="128" y="170" fontFamily="Georgia, serif" fontSize="16" fontStyle="italic" fill="#555555" textAnchor="middle">
        Every escape
      </Text>
      <Text x="128" y="192" fontFamily="Georgia, serif" fontSize="16" fontStyle="italic" fill="#555555" textAnchor="middle">
        begins with a
      </Text>
      <Text x="128" y="214" fontFamily="Georgia, serif" fontSize="16" fontStyle="italic" fill="#555555" textAnchor="middle">
        single clue...
      </Text>

      {/* Hidden code "4217" */}
      <G opacity="0.15">
        <Text x="50" y="118" fontFamily="monospace" fontSize="10" fill="#333333">4</Text>
        <Text x="128" y="118" fontFamily="monospace" fontSize="10" fill="#333333">2</Text>
        <Text x="180" y="118" fontFamily="monospace" fontSize="10" fill="#333333">1</Text>
        <Text x="206" y="118" fontFamily="monospace" fontSize="10" fill="#333333">7</Text>
      </G>

      {/* Decorative circles */}
      <Circle cx="50" cy="118" r="8" fill="none" stroke="#E0E0E0" strokeWidth="1.5" />
      <Circle cx="128" cy="118" r="8" fill="none" stroke="#E0E0E0" strokeWidth="1.5" />
      <Circle cx="180" cy="118" r="8" fill="none" stroke="#E0E0E0" strokeWidth="1.5" />
      <Circle cx="206" cy="118" r="8" fill="none" stroke="#E0E0E0" strokeWidth="1.5" />

      {/* Shadow (depth effect) */}
      <Rect x="13" y="13" width="236" height="236" fill="none" stroke="#000000" strokeWidth="3" opacity="0.1" transform="translate(3, 3)" />
    </G>
  );
}
