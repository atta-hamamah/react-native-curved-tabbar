import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { Sparkles } from './Sparkles';
import type { CenterButtonProps, CenterButtonConfig, SparkleProps } from './types';

export interface CenterButtonComponentProps {
  isFocused: boolean;
  onPress: () => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
  shadowColor?: string;
  showGlow?: boolean;
  showSparkles?: boolean;
  enableSpringAnimation?: boolean;
  config?: CenterButtonConfig;
  renderSparkles?: (props: SparkleProps) => React.ReactNode;
  sparkleComponent?: React.ReactNode;
  renderContent?: (props: CenterButtonProps) => React.ReactNode;
}

const HOME_HOUSE_PATH =
  'M20.0402 6.81969L14.2802 2.78969C12.7102 1.68969 10.3002 1.74969 8.79023 2.91969L3.78023 6.82969C2.78023 7.60969 1.99023 9.20969 1.99023 10.4697V17.3697C1.99023 19.9197 4.06023 21.9997 6.61023 21.9997H17.3902C19.9402 21.9997 22.0102 19.9297 22.0102 17.3797V10.5997C22.0102 9.24969 21.1402 7.58969 20.0402 6.81969Z';

const HOME_DOOR_PATH =
  'M12.7502 17.9997C12.7502 18.4097 12.4102 18.7497 12.0002 18.7497C11.5902 18.7497 11.2502 18.4097 11.2502 17.9997V14.9997C11.2502 14.5897 11.5902 14.2497 12.0002 14.2497C12.4102 14.2497 12.7502 14.5897 12.7502 14.9997V17.9997Z';

const DefaultHomeIcon = React.memo(
  ({ isFocused, activeColor = '#0072BB' }: { isFocused: boolean; activeColor?: string }) => (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
      <Path
        d={HOME_HOUSE_PATH}
        fill={isFocused ? '#FFFFFF' : 'none'}
        stroke="#FFFFFF"
        strokeWidth={isFocused ? '0' : '1.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isFocused ? (
        <Path d={HOME_DOOR_PATH} fill={activeColor} />
      ) : (
        <Path
          d="M12 15V18"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </Svg>
  )
);

const ButtonGlow = React.memo(
  ({
    isFocused,
    shadowColor,
    size = 66,
  }: {
    isFocused: boolean;
    shadowColor: string;
    size?: number;
  }) => {
    const glowSize = size + 10;
    const center = glowSize / 2;

    return (
      <View style={styles.glowContainer} pointerEvents="none">
        <Svg width={glowSize} height={glowSize}>
          <Defs>
            <RadialGradient id="centerBtnGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop
                offset="50%"
                stopColor={shadowColor}
                stopOpacity={isFocused ? '0.48' : '0.18'}
              />
              <Stop offset="100%" stopColor={shadowColor} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={center} cy={center} r={center} fill="url(#centerBtnGlow)" />
        </Svg>
      </View>
    );
  }
);

export const CenterButton = React.memo(
  ({
    isFocused,
    onPress,
    activeColor = '#0072BB',
    inactiveColor = '#86A8BC',
    size = 66,
    shadowColor = '#33B8D2',
    showGlow = true,
    showSparkles = false,
    enableSpringAnimation = true,
    config,
    renderSparkles,
    sparkleComponent,
    renderContent,
  }: CenterButtonComponentProps) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    const btnSize = config?.size ?? size;
    const btnActiveColor = config?.activeColor ?? activeColor;
    const btnInactiveColor = config?.inactiveColor ?? inactiveColor;
    const currentColor = isFocused ? btnActiveColor : btnInactiveColor;
    const buttonTop = -(btnSize / 2 - 5);
    const shouldShowSparkles = config?.showSparkles ?? showSparkles;

    const handlePressIn = React.useCallback(() => {
      if (!enableSpringAnimation) return;
      Animated.spring(scale, {
        toValue: 0.91,
        useNativeDriver: true,
      }).start();
    }, [enableSpringAnimation, scale]);

    const handlePressOut = React.useCallback(() => {
      if (!enableSpringAnimation) return;
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 45,
        useNativeDriver: true,
      }).start();
    }, [enableSpringAnimation, scale]);

    const handlePress = React.useCallback(() => {
      if (config?.onPress) {
        config.onPress();
      } else {
        onPress();
      }
    }, [config, onPress]);

    const renderIcon = () => {
      if (config?.icon) {
        if (typeof config.icon === 'function') {
          return config.icon({ isFocused, color: '#FFFFFF', size: btnSize });
        }
        return config.icon;
      }
      if (renderContent) {
        return renderContent({ isFocused, color: '#FFFFFF', size: btnSize });
      }
      return <DefaultHomeIcon isFocused={isFocused} activeColor={btnActiveColor} />;
    };

    const renderSparkleElement = () => {
      if (!shouldShowSparkles) return null;
      if (config?.sparkleComponent) return config.sparkleComponent;
      if (config?.renderSparkles) {
        return config.renderSparkles({ isFocused, isCenter: true });
      }
      if (renderSparkles) {
        return renderSparkles({ isFocused, isCenter: true });
      }
      if (sparkleComponent) {
        return sparkleComponent;
      }
      return <Sparkles />;
    };

    return (
      <View
        style={[
          styles.container,
          {
            top: buttonTop,
          },
        ]}
        pointerEvents="box-none"
      >
        {showGlow && (
          <ButtonGlow
            isFocused={isFocused}
            shadowColor={shadowColor}
            size={btnSize}
          />
        )}

        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            activeOpacity={enableSpringAnimation ? 0.95 : 0.8}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.button,
              {
                width: btnSize,
                height: btnSize,
                borderRadius: btnSize / 2,
                backgroundColor: currentColor,
              },
            ]}
            delayPressIn={0}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={config?.accessibilityLabel}
            testID={config?.testID}
          >
            {renderIcon()}
            {renderSparkleElement()}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    top: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
