import React from 'react';
import { G, Rect, Line, Path } from 'react-native-svg';

interface HayBalesProps {
  transform?: string;
}

export default function HayBales({ transform }: HayBalesProps) {
  return (
    <G transform={transform}>
      {/* Back hay bale */}
      <Rect
        x="96"
        y="80"
        width="64"
        height="48"
        fill="#DAA520"
        stroke="#B8860B"
        strokeWidth="2"
        rx="4"
      />

      {/* Binding on back bale */}
      <Rect x="108" y="80" width="4" height="48" fill="#8B7500" />
      <Rect x="144" y="80" width="4" height="48" fill="#8B7500" />

      {/* Hay texture on back bale */}
      <Line x1="100" y1="90" x2="156" y2="92" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
      <Line x1="100" y1="100" x2="156" y2="98" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
      <Line x1="100" y1="110" x2="156" y2="108" stroke="#B8860B" strokeWidth="1" opacity="0.5" />
      <Line x1="100" y1="118" x2="156" y2="120" stroke="#B8860B" strokeWidth="1" opacity="0.5" />

      {/* Front hay bale */}
      <Rect
        x="64"
        y="128"
        width="80"
        height="64"
        fill="#F0C868"
        stroke="#DAA520"
        strokeWidth="3"
        rx="4"
      />

      {/* Binding on front bale */}
      <Rect x="80" y="128" width="5" height="64" fill="#8B7500" />
      <Rect x="123" y="128" width="5" height="64" fill="#8B7500" />

      {/* Hay texture on front bale */}
      <Line x1="68" y1="140" x2="140" y2="142" stroke="#DAA520" strokeWidth="1.5" opacity="0.6" />
      <Line x1="68" y1="152" x2="140" y2="150" stroke="#DAA520" strokeWidth="1.5" opacity="0.6" />
      <Line x1="68" y1="164" x2="140" y2="162" stroke="#DAA520" strokeWidth="1.5" opacity="0.6" />
      <Line x1="68" y1="176" x2="140" y2="178" stroke="#DAA520" strokeWidth="1.5" opacity="0.6" />
      <Line x1="68" y1="186" x2="140" y2="184" stroke="#DAA520" strokeWidth="1.5" opacity="0.6" />

      {/* Stray hay pieces */}
      <Path d="M 72 192 L 68 200" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" />
      <Path d="M 92 192 L 88 202" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" />
      <Path d="M 132 192 L 136 201" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" />

      {/* Shadow */}
      <Rect
        x="68"
        y="190"
        width="78"
        height="6"
        fill="#000000"
        opacity="0.25"
        rx="2"
      />
    </G>
  );
}
