import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Sparkles } from './Sparkles';
import type { TabItemProps } from './types';

export const TabBarItem = React.memo(
  ({
    route,
    isFocused,
    navigation,
    options,
    activeTintColor,
    inactiveTintColor,
    badgeBackgroundColor,
    badgeTextColor,
    showSparkles = false,
    renderSparkles,
    sparkleComponent,
    labelStyle,
    activeLabelStyle,
  }: TabItemProps) => {
    const onPress = React.useCallback(() => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    }, [navigation, route.key, route.name, route.params, isFocused]);

    const onLongPress = React.useCallback(() => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    }, [navigation, route.key]);

    const color = isFocused ? activeTintColor : inactiveTintColor;

    // Resolve label
    const label =
      typeof options.tabBarLabel === 'function'
        ? options.tabBarLabel({ focused: isFocused, color, position: 'below-icon', children: '' })
        : options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    // Resolve badge
    const badge = options.tabBarBadge;

    // Resolve sparkle visibility (options.tabBarSparkle overrides global setting)
    const optionsAny = options as any;
    const isSparkleActive =
      optionsAny?.tabBarSparkle !== undefined
        ? Boolean(optionsAny.tabBarSparkle)
        : showSparkles;

    // Resolve custom sparkle component
    const renderSparkleElement = () => {
      if (!isSparkleActive) return null;

      // 1. Per-tab custom component/renderer in screen options
      if (optionsAny?.tabBarSparkleComponent) {
        return optionsAny.tabBarSparkleComponent;
      }
      if (typeof optionsAny?.renderSparkles === 'function') {
        return optionsAny.renderSparkles({ routeName: route.name, isFocused, isCenter: false });
      }

      // 2. Global custom sparkle renderer or component passed to CurvedTabBar
      if (renderSparkles) {
        return renderSparkles({ routeName: route.name, isFocused, isCenter: false });
      }
      if (sparkleComponent) {
        return sparkleComponent;
      }

      // 3. Default animated star sparkles
      return <Sparkles />;
    };

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabItem}
        delayPressIn={0}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {options.tabBarIcon ? (
            options.tabBarIcon({ focused: isFocused, color, size: 24 })
          ) : (
            <View style={[styles.defaultIconPlaceholder, { backgroundColor: color }]} />
          )}

          {renderSparkleElement()}

          {badge !== undefined && badge !== null && (
            <View style={[styles.badgeContainer, { backgroundColor: badgeBackgroundColor }]}>
              <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                {typeof badge === 'number' && badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
        </View>

        {label !== undefined && (
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color },
              labelStyle,
              isFocused && [styles.activeLabel, activeLabelStyle],
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  defaultIconPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -10,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: '700',
  },
});
