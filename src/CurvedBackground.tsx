import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useSvgId } from './useSvgId';
import type { TabBarBackgroundProps } from './types';

const GLOW_SPREAD = 50;

/**
 * The default bar surface: the curved shape plus the ambient glow.
 * Exported so custom `renderBackground` implementations can wrap or layer it.
 */
export const CurvedBackground = React.memo(function CurvedBackground({
  width,
  height,
  path,
  colors,
  glow,
}: TabBarBackgroundProps) {
  const glowId = useSvgId('ctb-bar-glow');
  const glowWidth = width + GLOW_SPREAD * 2;
  const glowHeight = height + GLOW_SPREAD * 2;

  return (
    <>
      {glow && (
        <View style={[styles.glow, { width: glowWidth, height: glowHeight }]}>
          <Svg width={glowWidth} height={glowHeight}>
            <Defs>
              <RadialGradient id={glowId} cx="50%" cy="65%" rx="80%" ry="50%">
                <Stop offset="0%" stopColor={colors.glow} stopOpacity="0.4" />
                <Stop offset="40%" stopColor={colors.glow} stopOpacity="0.32" />
                <Stop offset="75%" stopColor={colors.glow} stopOpacity="0.06" />
                <Stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={glowWidth}
              height={glowHeight}
              rx={40}
              fill={`url(#${glowId})`}
            />
          </Svg>
        </View>
      )}

      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Path d={path} fill={colors.bar} />
      </Svg>
    </>
  );
});

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    left: -GLOW_SPREAD,
    // Sits slightly higher than centered so the glow reads as light coming from behind the bar.
    bottom: -GLOW_SPREAD + 8,
    pointerEvents: 'none',
  },
});
