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

      {/* Title text */}
      <Text
        x="128"
        y="70"
        fontFamily="Arial Black, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        WELCOME
      </Text>

      {/* Main instructions */}
      <Text x="128" y="115" fontFamily="Arial, sans-serif" fontSize="13" fill="#333333" textAnchor="middle">
        Your goal: Escape
      </Text>
      <Text x="128" y="135" fontFamily="Arial, sans-serif" fontSize="13" fill="#333333" textAnchor="middle">
        through the exit door.
      </Text>
      <Text x="128" y="160" fontFamily="Arial, sans-serif" fontSize="12" fill="#555555" textAnchor="middle">
        Search for clues and keys.
      </Text>
      <Text x="128" y="178" fontFamily="Arial, sans-serif" fontSize="12" fill="#555555" textAnchor="middle">
        Examine objects carefully -
      </Text>
      <Text x="128" y="196" fontFamily="Arial, sans-serif" fontSize="12" fill="#555555" textAnchor="middle">
        some hide secrets.
      </Text>
      <Text x="128" y="220" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" fill="#4A90E2" textAnchor="middle">
        Good luck!
      </Text>

      {/* Shadow (depth effect) */}
      <Rect x="13" y="13" width="236" height="236" fill="none" stroke="#000000" strokeWidth="3" opacity="0.1" transform="translate(3, 3)" />
    </G>
  );
}
