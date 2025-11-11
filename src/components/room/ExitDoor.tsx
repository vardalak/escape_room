import React from 'react';
import { G, Rect, Circle, Text } from 'react-native-svg';

interface ExitDoorProps {
  transform?: string;
}

export default function ExitDoor({ transform }: ExitDoorProps) {
  return (
    <G transform={transform} originX={256} originY={256}>
      {/* Front view of door */}

      {/* Door frame */}
      <Rect
        x="100"
        y="50"
        width="312"
        height="450"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="4"
      />

      {/* Door surface */}
      <Rect
        x="120"
        y="70"
        width="272"
        height="410"
        fill="#7D4E3C"
        stroke="#5A3828"
        strokeWidth="3"
      />

      {/* Door panels (decorative) */}
      <Rect x="140" y="90" width="232" height="100" fill="#8B5A45" stroke="#5A3828" strokeWidth="2" rx="4" />
      <Rect x="140" y="210" width="232" height="100" fill="#8B5A45" stroke="#5A3828" strokeWidth="2" rx="4" />
      <Rect x="140" y="330" width="232" height="130" fill="#8B5A45" stroke="#5A3828" strokeWidth="2" rx="4" />

      {/* Door handle (left side) */}
      <Circle cx="145" cy="270" r="8" fill="#C0C0C0" stroke="#808080" strokeWidth="2" />
      <Rect x="155" y="265" width="25" height="10" fill="#A8A8A8" stroke="#808080" strokeWidth="1.5" rx="2" />

      {/* Keypad housing (right side of door) */}
      <Rect x="400" y="230" width="80" height="110" fill="#2C3E50" stroke="#1A252F" strokeWidth="3" rx="6" />

      {/* Keypad screen */}
      <Rect x="410" y="245" width="60" height="28" fill="#1E3A2F" stroke="#0F1F1A" strokeWidth="2" rx="3" />
      <Rect x="415" y="250" width="50" height="18" fill="#00FF00" opacity="0.3" rx="2" />

      {/* Keypad buttons - 3x4 grid */}
      {/* Row 1 */}
      <Circle cx="425" cy="295" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="425" y="299" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">1</Text>

      <Circle cx="450" cy="295" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="450" y="299" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">2</Text>

      <Circle cx="465" cy="295" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="465" y="299" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">3</Text>

      {/* Row 2 */}
      <Circle cx="425" cy="312" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="425" y="316" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">4</Text>

      <Circle cx="450" cy="312" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="450" y="316" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">5</Text>

      <Circle cx="465" cy="312" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="465" y="316" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">6</Text>

      {/* Row 3 */}
      <Circle cx="425" cy="329" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="425" y="333" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">7</Text>

      <Circle cx="450" cy="329" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="450" y="333" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">8</Text>

      <Circle cx="465" cy="329" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="465" y="333" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">9</Text>

      {/* Row 4 */}
      <Circle cx="425" cy="346" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="425" y="350" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">*</Text>

      <Circle cx="450" cy="346" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="450" y="350" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">0</Text>

      <Circle cx="465" cy="346" r="8" fill="#34495E" stroke="#1A252F" strokeWidth="1.5" />
      <Text x="465" y="350" fontFamily="Arial" fontSize="11" fill="#ECF0F1" textAnchor="middle">#</Text>

      {/* Lock indicator light (red - locked) */}
      <Circle cx="470" cy="252" r="4" fill="#E74C3C" opacity="0.9" />

      {/* EXIT sign above door */}
      <Rect x="180" y="20" width="150" height="35" fill="#C62828" stroke="#8B0000" strokeWidth="3" rx="4" />
      <Text
        x="255"
        y="43"
        fontFamily="Arial Black"
        fontSize="20"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        EXIT
      </Text>

      {/* Shadow */}
      <Rect x="100" y="500" width="312" height="8" fill="#000000" opacity="0.15" rx="4" />
    </G>
  );
}
