import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface SparklesProps {
  /** @default '#FFD700' */
  color?: string;
  /** @default '#000000' */
  outlineColor?: string;
}

const STAR_PATH =
  'M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z';

const STARS = [
  { size: 6, position: { bottom: 3, right: 3 } },
  { size: 7, position: { top: 14, left: 2 } },
  { size: 9, position: { top: 1, left: 9 } },
] as const;

/** Three stars that pop in and out in a loop. Fills its parent; place it inside an icon container. */
export const Sparkles = React.memo(function Sparkles({
  color = '#FFD700',
  outlineColor = '#000000',
}: SparklesProps) {
  const anims = React.useRef(
    STARS.map(() => ({ scale: new Animated.Value(0), opacity: new Animated.Value(0) }))
  ).current;

  React.useEffect(() => {
    const pop = ({ scale, opacity }: (typeof anims)[number]) =>
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

    const loop = Animated.loop(
      Animated.sequence([Animated.stagger(300, anims.map(pop)), Animated.delay(480)])
    );
    loop.start();
    return () => loop.stop();
  }, [anims]);

  return (
    <View style={styles.container}>
      {STARS.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.star,
            star.position,
            { transform: [{ scale: anims[i].scale }], opacity: anims[i].opacity },
          ]}
        >
          <Svg width={star.size} height={star.size} viewBox="0 0 24 24">
            <Path d={STAR_PATH} fill={color} stroke={outlineColor} strokeWidth={2.5} />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
  },
});
