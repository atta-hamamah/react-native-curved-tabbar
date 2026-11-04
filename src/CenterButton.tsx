import * as React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { Badge } from './Badge';
import { Sparkles } from './Sparkles';
import { useSvgId } from './useSvgId';
import type { CenterIconProps, SparkleRenderProps, TabBarColors } from './types';

const HOME_HOUSE_PATH =
  'M20.0402 6.81969L14.2802 2.78969C12.7102 1.68969 10.3002 1.74969 8.79023 2.91969L3.78023 6.82969C2.78023 7.60969 1.99023 9.20969 1.99023 10.4697V17.3697C1.99023 19.9197 4.06023 21.9997 6.61023 21.9997H17.3902C19.9402 21.9997 22.0102 19.9297 22.0102 17.3797V10.5997C22.0102 9.24969 21.1402 7.58969 20.0402 6.81969Z';

const HOME_DOOR_PATH =
  'M12.7502 17.9997C12.7502 18.4097 12.4102 18.7497 12.0002 18.7497C11.5902 18.7497 11.2502 18.4097 11.2502 17.9997V14.9997C11.2502 14.5897 11.5902 14.2497 12.0002 14.2497C12.4102 14.2497 12.7502 14.5897 12.7502 14.9997V17.9997Z';

export function DefaultHomeIcon({
  focused,
  color,
  size,
  accentColor,
}: CenterIconProps & { accentColor: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={HOME_HOUSE_PATH}
        fill={focused ? color : 'none'}
        stroke={color}
        strokeWidth={focused ? 0 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {focused ? (
        <Path d={HOME_DOOR_PATH} fill={accentColor} />
      ) : (
        <Path d="M12 15V18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      )}
    </Svg>
  );
}

export function DefaultPlusIcon({ color, size }: CenterIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ButtonGlow({ highlighted, color, size }: { highlighted: boolean; color: string; size: number }) {
  const id = useSvgId('ctb-center-glow');
  const glowSize = size + 10;
  const c = glowSize / 2;

  return (
    <View style={styles.glow}>
      <Svg width={glowSize} height={glowSize}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="50%" stopColor={color} stopOpacity={highlighted ? '0.48' : '0.18'} />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={c} cy={c} r={c} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

interface CenterButtonProps {
  /** Distance from the top of the bar container. */
  top: number;
  size: number;
  focused: boolean;
  /** Action button: always drawn in the active color. */
  isAction: boolean;
  colors: TabBarColors;
  glow: boolean;
  renderIcon: (props: CenterIconProps) => React.ReactNode;
  badge?: number | string;
  badgeStyle?: StyleProp<TextStyle>;
  sparkles: boolean;
  routeName?: string;
  renderSparkles?: (props: SparkleRenderProps) => React.ReactNode;
  pressAnimation: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export function CenterButton({
  top,
  size,
  focused,
  isAction,
  colors,
  glow,
  renderIcon,
  badge,
  badgeStyle,
  sparkles,
  routeName,
  renderSparkles,
  pressAnimation,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: CenterButtonProps) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const highlighted = focused || isAction;

  const handlePressIn = () => {
    if (!pressAnimation) return;
    Animated.spring(scale, { toValue: 0.91, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (!pressAnimation) return;
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 45, useNativeDriver: true }).start();
  };

  const iconSize = Math.round(size * 0.45);

  return (
    <View style={[styles.container, { top }]}>
      {glow && <ButtonGlow highlighted={highlighted} color={colors.glow} size={size} />}

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={pressAnimation ? 0.95 : 0.8}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          delayPressIn={0}
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: highlighted ? colors.centerActive : colors.centerInactive,
            },
          ]}
          accessibilityRole="button"
          accessibilityState={isAction ? undefined : { selected: focused }}
          accessibilityLabel={accessibilityLabel}
          testID={testID}
        >
          {renderIcon({ focused, color: colors.centerIcon, size: iconSize })}

          {sparkles &&
            (renderSparkles ? (
              renderSparkles({ routeName, focused, isCenter: true, color: colors.sparkle })
            ) : (
              <Sparkles color={colors.sparkle} />
            ))}

          <Badge
            value={badge}
            backgroundColor={colors.badge}
            color={colors.badgeText}
            style={[styles.badge, badgeStyle]}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: -10,
    pointerEvents: 'none',
  },
  badge: {
    top: 2,
    right: 2,
  },
});
