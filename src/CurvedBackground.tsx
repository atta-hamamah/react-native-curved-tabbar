import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Rect, ClipPath } from 'react-native-svg';
import type { TabBarBackgroundProps } from './types';

export const CurvedBackground = React.memo(
  ({
    barWidth,
    height,
    svgWidth,
    svgHeight,
    pad,
    path,
    barColor,
    shadowColor,
    showBarGlow,
  }: TabBarBackgroundProps) => {
    return (
      <>
        {showBarGlow && (
          <View style={styles.glowBackdrop} pointerEvents="none">
            <Svg width={barWidth + 100} height={height + 100}>
              <Defs>
                <RadialGradient id="curvedBarGlow" cx="50%" cy="65%" rx="80%" ry="50%">
                  <Stop offset="0%" stopColor={shadowColor} stopOpacity="0.4" />
                  <Stop offset="40%" stopColor={shadowColor} stopOpacity="0.32" />
                  <Stop offset="75%" stopColor={shadowColor} stopOpacity="0.06" />
                  <Stop offset="100%" stopColor={shadowColor} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width={barWidth + 100}
                height={height + 100}
                rx={40}
                fill="url(#curvedBarGlow)"
              />
            </Svg>
          </View>
        )}

        <Svg
          pointerEvents="none"
          width={svgWidth}
          height={svgHeight}
          style={[styles.svg, { top: -pad, left: -pad }]}
        >
          <Defs>
            <ClipPath id="barClip">
              <Path d={path} />
            </ClipPath>
          </Defs>
          <Path d={path} fill={barColor} />
        </Svg>
      </>
    );
  }
);

const styles = StyleSheet.create({
  glowBackdrop: {
    position: 'absolute',
    bottom: -42,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    left: -50,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
});
