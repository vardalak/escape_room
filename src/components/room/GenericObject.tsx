import React from 'react';
import { G, Rect, Text, Circle } from 'react-native-svg';

interface GenericObjectProps {
  transform?: string;
  label?: string;
  color?: string;
}

export default function GenericObject({ transform, label = '?', color = '#888888' }: GenericObjectProps) {
  return (
    <G transform={transform}>
      {/* Simple box placeholder */}
      <Rect
        x="64"
        y="64"
        width="128"
        height="128"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="3"
        rx="8"
      />

      {/* Interactive indicator */}
      <Circle
        cx="128"
        cy="128"
        r="40"
        fill="rgba(74, 144, 226, 0.3)"
        stroke="#4A90E2"
        strokeWidth="2"
      />

      {/* Label */}
      <Text
        x="128"
        y="140"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fill="#FFFFFF"
        textAnchor="middle"
        fontWeight="bold"
      >
        {label.substring(0, 3).toUpperCase()}
      </Text>
    </G>
  );
}
