import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface SparklesProps {
  color?: string;
}

export const Sparkles = React.memo(({ color = '#FFD700' }: SparklesProps) => {
  const scale1 = React.useRef(new Animated.Value(0)).current;
  const opacity1 = React.useRef(new Animated.Value(0)).current;

  const scale2 = React.useRef(new Animated.Value(0)).current;
  const opacity2 = React.useRef(new Animated.Value(0)).current;

  const scale3 = React.useRef(new Animated.Value(0)).current;
  const opacity3 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const createPop = (scale: Animated.Value, opacity: Animated.Value) =>
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.2, duration: 290, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 290, useNativeDriver: true }),
        ]),
        Animated.delay(70),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]),
      ]);

    const masterLoop = Animated.loop(
      Animated.sequence([
        Animated.stagger(300, [
          createPop(scale1, opacity1),
          createPop(scale2, opacity2),
          createPop(scale3, opacity3),
        ]),
        Animated.delay(480),
      ])
    );

    masterLoop.start();
    return () => masterLoop.stop();
  }, [scale1, opacity1, scale2, opacity2, scale3, opacity3]);

  return (
    <View style={styles.sparklesContainer} pointerEvents="none">
      {/* 1st: Smallest star */}
      <Animated.View
        style={[
          styles.starPosition1,
          { transform: [{ scale: scale1 }], opacity: opacity1 },
        ]}
      >
        <Svg width={6} height={6} viewBox="0 0 24 24">
          <Path
            d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z"
            fill={color}
            stroke="#000000"
            strokeWidth={2.5}
          />
        </Svg>
      </Animated.View>

      {/* 2nd: Medium star */}
      <Animated.View
        style={[
          styles.starPosition2,
          { transform: [{ scale: scale2 }], opacity: opacity2 },
        ]}
      >
        <Svg width={7} height={7} viewBox="0 0 24 24">
          <Path
            d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z"
            fill={color}
            stroke="#000000"
            strokeWidth={2.5}
          />
        </Svg>
      </Animated.View>

      {/* 3rd: Biggest star */}
      <Animated.View
        style={[
          styles.starPosition3,
          { transform: [{ scale: scale3 }], opacity: opacity3 },
        ]}
      >
        <Svg width={9} height={9} viewBox="0 0 24 24">
          <Path
            d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z"
            fill={color}
            stroke="#000000"
            strokeWidth={2.5}
          />
        </Svg>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starPosition1: {
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
  starPosition2: {
    position: 'absolute',
    top: 14,
    left: 2,
  },
  starPosition3: {
    position: 'absolute',
    top: 1,
    left: 9,
  },
});
