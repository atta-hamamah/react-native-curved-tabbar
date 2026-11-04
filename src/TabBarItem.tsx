import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Badge } from './Badge';
import { Sparkles } from './Sparkles';
import type { TabItemProps } from './types';

/**
 * The default side tab. Exported so `renderTabItem` can wrap it:
 * `renderTabItem={(props) => <MyWrapper><TabBarItem {...props} /></MyWrapper>}`
 */
export function TabBarItem({
  route,
  options,
  focused,
  color,
  label,
  badge,
  sparkles,
  colors,
  onPress,
  onLongPress,
  renderSparkles,
}: TabItemProps) {
  const loose = options as { tabBarTestID?: string };
  const showLabel =
    options.tabBarShowLabel !== false && options.tabBarLabelVisibilityMode !== 'unlabeled';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
      testID={options.tabBarButtonTestID ?? loose.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      delayPressIn={0}
      activeOpacity={0.7}
      style={styles.item}
    >
      <View style={[styles.icon, options.tabBarIconStyle]}>
        {options.tabBarIcon ? (
          options.tabBarIcon({ focused, color, size: 24 })
        ) : (
          <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
        )}

        {sparkles &&
          (renderSparkles ? (
            renderSparkles({ routeName: route.name, focused, isCenter: false, color: colors.sparkle })
          ) : (
            <Sparkles color={colors.sparkle} />
          ))}

        <Badge
          value={badge}
          backgroundColor={colors.badge}
          color={colors.badgeText}
          style={options.tabBarBadgeStyle}
        />
      </View>

      {showLabel &&
        (typeof options.tabBarLabel === 'function' ? (
          options.tabBarLabel({ focused, color, position: 'below-icon', children: label })
        ) : (
          <Text
            numberOfLines={1}
            style={[styles.label, { color }, focused && styles.activeLabel, options.tabBarLabelStyle]}
          >
            {label}
          </Text>
        ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  iconPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
