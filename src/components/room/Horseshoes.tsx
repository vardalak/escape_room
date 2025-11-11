import React from 'react';
import { G, Path, Circle, Ellipse } from 'react-native-svg';

interface HorseshoesProps {
  transform?: string;
}

export default function Horseshoes({ transform }: HorseshoesProps) {
  return (
    <G transform={transform}>
      {/* First horseshoe */}
      <G>
        <Path
          d="M 80 100 Q 80 60 100 60 Q 120 60 120 100"
          stroke="#4A4A4A"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Nail holes */}
        <Circle cx="85" cy="95" r="3" fill="#2A2A2A" />
        <Circle cx="85" cy="75" r="3" fill="#2A2A2A" />
        <Circle cx="115" cy="95" r="3" fill="#2A2A2A" />
        <Circle cx="115" cy="75" r="3" fill="#2A2A2A" />
        {/* Highlight */}
        <Path
          d="M 82 100 Q 82 64 100 64 Q 118 64 118 100"
          stroke="#707070"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </G>

      {/* Second horseshoe (overlapping) */}
      <G>
        <Path
          d="M 110 120 Q 110 80 130 80 Q 150 80 150 120"
          stroke="#4A4A4A"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Nail holes */}
        <Circle cx="115" cy="115" r="3" fill="#2A2A2A" />
        <Circle cx="115" cy="95" r="3" fill="#2A2A2A" />
        <Circle cx="145" cy="115" r="3" fill="#2A2A2A" />
        <Circle cx="145" cy="95" r="3" fill="#2A2A2A" />
        {/* Highlight */}
        <Path
          d="M 112 120 Q 112 84 130 84 Q 148 84 148 120"
          stroke="#707070"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </G>

      {/* Third horseshoe */}
      <G>
        <Path
          d="M 140 140 Q 140 100 160 100 Q 180 100 180 140"
          stroke="#4A4A4A"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Nail holes */}
        <Circle cx="145" cy="135" r="3" fill="#2A2A2A" />
        <Circle cx="145" cy="115" r="3" fill="#2A2A2A" />
        <Circle cx="175" cy="135" r="3" fill="#2A2A2A" />
        <Circle cx="175" cy="115" r="3" fill="#2A2A2A" />
        {/* Highlight */}
        <Path
          d="M 142 140 Q 142 104 160 104 Q 178 104 178 140"
          stroke="#707070"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </G>

      {/* Shadow */}
      <Ellipse
        cx="130"
        cy="145"
        rx="60"
        ry="8"
        fill="#000000"
        opacity="0.2"
      />
    </G>
  );
}
