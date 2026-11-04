import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';
import { CurvedBackground } from './CurvedBackground';
import { CenterButton, DefaultHomeIcon, DefaultPlusIcon } from './CenterButton';
import { TabBarItem } from './TabBarItem';
import { resolveColors } from './themes';
import { buildBarPath, computeNotch, splitRoutes, DEFAULT_CENTER_SIZE } from './layout';
import type {
  CenterButtonOptions,
  CenterIconProps,
  CurvedTabBarProps,
  TabBarBackgroundProps,
  TabItemProps,
  TabRoute,
} from './types';

// Older React Navigation versions may not export this context.
const FallbackHeightContext = React.createContext<((height: number) => void) | undefined>(undefined);
const HeightCallbackContext = BottomTabBarHeightCallbackContext ?? FallbackHeightContext;

const warned = new Set<string>();
// `__DEV__` is defined by Metro but may be missing in other bundlers (e.g. webpack for web).
const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

function warnOnce(message: string) {
  if (!isDev || warned.has(message)) return;
  warned.add(message);
  console.warn(`[react-native-curved-tabbar] ${message}`);
}

function useKeyboardVisible(enabled: boolean): boolean {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled]);

  return visible;
}

export function CurvedTabBar({
  state,
  descriptors,
  navigation,
  insets,
  theme = 'ocean',
  colors: colorOverrides,
  center,
  sparkles,
  glow = true,
  notch,
  height = 75,
  cornerRadius = 16,
  marginHorizontal = 16,
  hideOnKeyboard = true,
  style,
  renderBackground,
  renderTabItem,
  renderSparkles,
}: CurvedTabBarProps) {
  const window = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = React.useState<number | null>(null);
  const keyboardVisible = useKeyboardVisible(hideOnKeyboard);
  const onHeightChange = React.useContext(HeightCallbackContext);

  const colors = React.useMemo(() => resolveColors(theme, colorOverrides), [theme, colorOverrides]);
  const centerOptions: CenterButtonOptions =
    typeof center === 'string' ? { route: center } : center || {};

  const { left, right, centerRoute, isAction, hasCenter, missingRoute } = React.useMemo(
    () => splitRoutes(state.routes, center),
    [state.routes, center]
  );

  if (missingRoute) {
    warnOnce(`center route "${missingRoute}" doesn't match any Tab.Screen name.`);
  } else if (!hasCenter && center === undefined && state.routes.length > 0) {
    warnOnce(
      `No center button: there are ${state.routes.length} tabs, so there is no middle tab to use. ` +
        'Pass center="RouteName", center={{ icon, onPress }} for an action button, ' +
        'or center={false} for a plain bar (this also hides this warning).'
    );
  }

  const glowBar = typeof glow === 'boolean' ? glow : glow.bar ?? true;
  const glowCenter = typeof glow === 'boolean' ? glow : glow.center ?? true;
  const sparkleRoutes = new Set(typeof sparkles === 'string' ? [sparkles] : sparkles ?? []);

  const notchGeometry = React.useMemo(
    () => (hasCenter ? computeNotch(centerOptions.size ?? DEFAULT_CENTER_SIZE, notch) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasCenter, centerOptions.size, notch?.gap, notch?.radius, notch?.depth, notch?.shoulder]
  );

  // Space above the bar taken by the part of the center button that sticks out.
  const overhang = notchGeometry ? Math.max(0, -notchGeometry.buttonTop) : 0;
  const marginBottom = Math.max((insets?.bottom ?? 0) + 10, 16);
  const barWidth = Math.max(0, (measuredWidth ?? window.width) - marginHorizontal * 2);

  const path = React.useMemo(
    () => buildBarPath(barWidth, height, cornerRadius, notchGeometry),
    [barWidth, height, cornerRadius, notchGeometry]
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    setMeasuredWidth((prev) => (prev === layout.width ? prev : layout.width));
    // Lets `useBottomTabBarHeight()` return the real height, so screens can pad their content.
    onHeightChange?.(layout.height);
  };

  const pressRoute = (route: TabRoute, focused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!focused && !event.defaultPrevented) {
      navigation.dispatch({
        ...CommonActions.navigate(route.name, route.params),
        target: state.key,
      });
    }
  };

  const longPressRoute = (route: TabRoute) => {
    navigation.emit({ type: 'tabLongPress', target: route.key });
  };

  const focusedKey = state.routes[state.index]?.key;

  const renderTab = (route: TabRoute) => {
    const { options } = descriptors[route.key];
    const focused = route.key === focusedKey;
    const color = focused
      ? options.tabBarActiveTintColor ?? colors.active
      : options.tabBarInactiveTintColor ?? colors.inactive;

    const itemProps: TabItemProps = {
      route,
      options,
      focused,
      color,
      label:
        typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name,
      badge: options.tabBarBadge,
      sparkles: sparkleRoutes.has(route.name),
      colors,
      onPress: () => pressRoute(route, focused),
      onLongPress: () => longPressRoute(route),
      renderSparkles,
    };

    return renderTabItem ? (
      <React.Fragment key={route.key}>{renderTabItem(itemProps)}</React.Fragment>
    ) : (
      <TabBarItem key={route.key} {...itemProps} />
    );
  };

  const renderCenter = () => {
    if (!notchGeometry) return null;

    const routeOptions = centerRoute ? descriptors[centerRoute.key].options : undefined;
    const focused = centerRoute ? centerRoute.key === focusedKey : false;
    const routeLabel =
      centerRoute && routeOptions
        ? typeof routeOptions.tabBarLabel === 'string'
          ? routeOptions.tabBarLabel
          : routeOptions.title ?? centerRoute.name
        : undefined;

    const renderIcon = (props: CenterIconProps) => {
      const { icon } = centerOptions;
      if (typeof icon === 'function') return icon(props);
      if (icon !== undefined) return icon;
      if (routeOptions?.tabBarIcon) return routeOptions.tabBarIcon(props);
      return isAction ? (
        <DefaultPlusIcon {...props} />
      ) : (
        <DefaultHomeIcon {...props} accentColor={colors.centerActive} />
      );
    };

    const handlePress = () => {
      if (centerOptions.onPress) centerOptions.onPress(navigation);
      else if (centerRoute) pressRoute(centerRoute, focused);
    };

    return (
      <CenterButton
        top={overhang + notchGeometry.buttonTop}
        size={notchGeometry.buttonSize}
        focused={focused}
        isAction={isAction}
        colors={colors}
        glow={glowCenter}
        renderIcon={renderIcon}
        badge={routeOptions?.tabBarBadge}
        badgeStyle={routeOptions?.tabBarBadgeStyle}
        sparkles={
          centerOptions.sparkles ?? (centerRoute ? sparkleRoutes.has(centerRoute.name) : false)
        }
        routeName={centerRoute?.name}
        renderSparkles={renderSparkles}
        pressAnimation={centerOptions.pressAnimation ?? true}
        onPress={handlePress}
        onLongPress={centerRoute ? () => longPressRoute(centerRoute) : undefined}
        accessibilityLabel={
          centerOptions.accessibilityLabel ?? routeOptions?.tabBarAccessibilityLabel ?? routeLabel
        }
        testID={centerOptions.testID ?? routeOptions?.tabBarButtonTestID}
      />
    );
  };

  if (hideOnKeyboard && keyboardVisible) {
    return null;
  }

  const backgroundProps: TabBarBackgroundProps = {
    width: barWidth,
    height,
    path,
    colors,
    glow: glowBar,
  };

  return (
    <View style={styles.root} onLayout={handleLayout}>
      {/* The container includes the overhang so the whole center button is inside its
          parent's bounds; Android ignores touches outside them. */}
      <View style={[styles.bar, { width: barWidth, height: overhang + height, marginBottom }, style]}>
        <View style={[styles.background, { top: overhang, height }]}>
          {renderBackground ? (
            renderBackground(backgroundProps)
          ) : (
            <CurvedBackground {...backgroundProps} />
          )}
        </View>

        <View style={[styles.row, { top: overhang, height }]}>
          <View style={styles.side}>{left.map(renderTab)}</View>
          {notchGeometry && <View style={[styles.spacer, { width: notchGeometry.spacerWidth }]} />}
          <View style={styles.side}>{right.map(renderTab)}</View>
        </View>

        {renderCenter()}
      </View>
    </View>
  );
}

// `pointerEvents` lives in styles (RN >= 0.71); the prop form is deprecated on web.
const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    overflow: 'visible',
    pointerEvents: 'box-none',
  },
  bar: {
    overflow: 'visible',
    pointerEvents: 'box-none',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'visible',
    pointerEvents: 'none',
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
    pointerEvents: 'box-none',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  spacer: {
    pointerEvents: 'none',
  },
});
