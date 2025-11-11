import React from 'react';
import { G, Rect, Text, Line, Circle } from 'react-native-svg';

interface WantedPosterProps {
  transform?: string;
}

export default function WantedPoster({ transform }: WantedPosterProps) {
  return (
    <G transform={transform}>
      {/* Cork board background */}
      <Rect
        x="32"
        y="32"
        width="192"
        height="192"
        fill="#8B7355"
        stroke="#6B5345"
        strokeWidth="3"
      />

      {/* Cork texture */}
      <Rect x="40" y="40" width="4" height="4" fill="#7B6345" opacity="0.5" />
      <Rect x="70" y="55" width="3" height="3" fill="#7B6345" opacity="0.5" />
      <Rect x="110" y="48" width="4" height="4" fill="#7B6345" opacity="0.5" />
      <Rect x="150" y="60" width="3" height="3" fill="#7B6345" opacity="0.5" />
      <Rect x="60" y="90" width="4" height="4" fill="#7B6345" opacity="0.5" />
      <Rect x="130" y="100" width="3" height="3" fill="#7B6345" opacity="0.5" />
      <Rect x="80" y="140" width="4" height="4" fill="#7B6345" opacity="0.5" />
      <Rect x="170" y="130" width="3" height="3" fill="#7B6345" opacity="0.5" />

      {/* Main wanted poster (top center) */}
      <Rect
        x="64"
        y="48"
        width="128"
        height="88"
        fill="#F5E6D3"
        stroke="#2A2A2A"
        strokeWidth="2"
      />

      {/* Pushpin */}
      <Circle cx="128" cy="48" r="4" fill="#8B4513" stroke="#654321" strokeWidth="1" />

      {/* WANTED text */}
      <Text
        x="128"
        y="70"
        fontFamily="serif"
        fontSize="20"
        fontWeight="bold"
        fill="#8B0000"
        textAnchor="middle"
      >
        WANTED
      </Text>

      {/* Decorative line */}
      <Line x1="70" y1="75" x2="186" y2="75" stroke="#2A2A2A" strokeWidth="1" />

      {/* Silhouette placeholder */}
      <Rect
        x="86"
        y="82"
        width="84"
        height="40"
        fill="#2A2A2A"
        opacity="0.3"
      />

      {/* Reward text */}
      <Text
        x="128"
        y="132"
        fontFamily="serif"
        fontSize="10"
        fontWeight="bold"
        fill="#2A2A2A"
        textAnchor="middle"
      >
        $500 REWARD
      </Text>

      {/* Additional posters (overlapping, partially visible) */}
      {/* Left poster */}
      <Rect
        x="40"
        y="150"
        width="72"
        height="56"
        fill="#E8D8C8"
        stroke="#2A2A2A"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <Circle cx="76" cy="150" r="3" fill="#8B4513" />
      <Text
        x="76"
        y="168"
        fontFamily="serif"
        fontSize="12"
        fontWeight="bold"
        fill="#8B0000"
        textAnchor="middle"
      >
        WANTED
      </Text>

      {/* Right poster */}
      <Rect
        x="144"
        y="155"
        width="72"
        height="56"
        fill="#DDD8C8"
        stroke="#2A2A2A"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <Circle cx="180" cy="155" r="3" fill="#8B4513" />
      <Text
        x="180"
        y="173"
        fontFamily="serif"
        fontSize="12"
        fontWeight="bold"
        fill="#8B0000"
        textAnchor="middle"
      >
        WANTED
      </Text>
    </G>
  );
}
