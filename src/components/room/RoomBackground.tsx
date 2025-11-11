import React from 'react';
import { G, Rect, Line } from 'react-native-svg';

export default function RoomBackground() {
  return (
    <G>
      {/* Simple rectangular room - side view */}

      {/* Floor */}
      <Rect
        x="50"
        y="800"
        width="900"
        height="150"
        fill="#666666"
        stroke="#444444"
        strokeWidth="2"
      />

      {/* Floor tiles */}
      <Line x1="50" y1="850" x2="950" y2="850" stroke="#555555" strokeWidth="1" />
      <Line x1="50" y1="900" x2="950" y2="900" stroke="#555555" strokeWidth="1" />
      <Line x1="300" y1="800" x2="300" y2="950" stroke="#555555" strokeWidth="1" />
      <Line x1="500" y1="800" x2="500" y2="950" stroke="#555555" strokeWidth="1" />
      <Line x1="700" y1="800" x2="700" y2="950" stroke="#555555" strokeWidth="1" />

      {/* Back wall */}
      <Rect
        x="50"
        y="50"
        width="900"
        height="750"
        fill="#888888"
        stroke="#666666"
        strokeWidth="3"
      />

      {/* Wall paneling lines (horizontal) */}
      <Line x1="50" y1="250" x2="950" y2="250" stroke="#777777" strokeWidth="1" />
      <Line x1="50" y1="450" x2="950" y2="450" stroke="#777777" strokeWidth="1" />
      <Line x1="50" y1="650" x2="950" y2="650" stroke="#777777" strokeWidth="1" />

      {/* Wall paneling lines (vertical) */}
      <Line x1="300" y1="50" x2="300" y2="800" stroke="#777777" strokeWidth="1" />
      <Line x1="500" y1="50" x2="500" y2="800" stroke="#777777" strokeWidth="1" />
      <Line x1="700" y1="50" x2="700" y2="800" stroke="#777777" strokeWidth="1" />

      {/* Shadow at floor junction */}
      <Rect
        x="50"
        y="790"
        width="900"
        height="10"
        fill="#000000"
        opacity="0.2"
      />
    </G>
  );
}
