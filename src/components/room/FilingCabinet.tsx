import React from 'react';
import { G, Rect, Line, Text, Path } from 'react-native-svg';

interface FilingCabinetProps {
  transform?: string;
}

export default function FilingCabinet({ transform }: FilingCabinetProps) {
  return (
    <G transform={transform} originX={256} originY={256}>
      {/* Front view of filing cabinet */}

      {/* Cabinet body */}
      <Rect
        x="150"
        y="100"
        width="212"
        height="380"
        fill="#A8A8A8"
        stroke="#808080"
        strokeWidth="3"
      />

      {/* Top edge (depth) */}
      <Rect
        x="145"
        y="95"
        width="222"
        height="10"
        fill="#B8B8B8"
        stroke="#909090"
        strokeWidth="2"
      />

      {/* Side edge (depth) */}
      <Rect
        x="362"
        y="100"
        width="15"
        height="380"
        fill="#909090"
        stroke="#707070"
        strokeWidth="2"
      />

      {/* Drawer 1 (Top) */}
      <Rect
        x="160"
        y="120"
        width="192"
        height="170"
        fill="#C0C0C0"
        stroke="#909090"
        strokeWidth="2"
        rx="2"
      />

      {/* Drawer 1 Handle */}
      <Rect x="240" y="190" width="50" height="12" fill="#606060" stroke="#404040" strokeWidth="1.5" rx="3" />

      {/* Drawer 1 Label */}
      <Rect x="230" y="150" width="70" height="25" fill="#FFFFFF" stroke="#909090" strokeWidth="1.5" rx="2" />
      <Text
        x="265"
        y="167"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fill="#333333"
        textAnchor="middle"
      >
        A-M
      </Text>

      {/* Unlocked indicator on TOP drawer (open lock - green) */}
      <G transform="translate(310, 185)">
        <Rect x="0" y="5" width="14" height="14" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" rx="2" />
        <Path d="M 3 5 Q 3 0 7 0 Q 11 0 11 3" fill="none" stroke="#2E7D32" strokeWidth="2" />
      </G>

      {/* Drawer 2 (Bottom) - LOCKED */}
      <Rect
        x="160"
        y="300"
        width="192"
        height="170"
        fill="#C0C0C0"
        stroke="#909090"
        strokeWidth="2"
        rx="2"
      />

      {/* Drawer 2 Handle */}
      <Rect x="240" y="370" width="50" height="12" fill="#606060" stroke="#404040" strokeWidth="1.5" rx="3" />

      {/* Drawer 2 Label */}
      <Rect x="230" y="330" width="70" height="25" fill="#FFFFFF" stroke="#909090" strokeWidth="1.5" rx="2" />
      <Text
        x="265"
        y="347"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fill="#333333"
        textAnchor="middle"
      >
        N-Z
      </Text>

      {/* Locked indicator on BOTTOM drawer (closed lock - red) */}
      <G transform="translate(310, 365)">
        <Rect x="0" y="5" width="14" height="14" fill="#F44336" stroke="#C62828" strokeWidth="2" rx="2" />
        <Path d="M 3 5 Q 3 0 7 0 Q 11 0 11 5" fill="none" stroke="#C62828" strokeWidth="2" />
      </G>

      {/* Metal texture lines on drawers */}
      <Line x1="165" y1="140" x2="347" y2="140" stroke="#D0D0D0" strokeWidth="0.5" opacity="0.4" />
      <Line x1="165" y1="250" x2="347" y2="250" stroke="#A0A0A0" strokeWidth="0.5" opacity="0.3" />
      <Line x1="165" y1="320" x2="347" y2="320" stroke="#D0D0D0" strokeWidth="0.5" opacity="0.4" />
      <Line x1="165" y1="430" x2="347" y2="430" stroke="#A0A0A0" strokeWidth="0.5" opacity="0.3" />

      {/* Shadow */}
      <Rect x="145" y="480" width="222" height="6" fill="#000000" opacity="0.2" rx="3" />
    </G>
  );
}
