import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurvedBackground } from './CurvedBackground';
import { CenterButton } from './CenterButton';
import { TabBarItem } from './TabBarItem';
import { THEMES } from './themes';
import type { CurvedTabBarProps } from './types';

export const CurvedTabBar: React.FC<CurvedTabBarProps> = ({
  state,
  descriptors,
  navigation,
  theme = 'default',
  centerRouteName,
  centerButton,
  onPressCenterButton,
  renderCenterButton,
  renderBackground,
  renderTabItem,
  enableSpringAnimation = true,
  barColor,
  shadowColor,
  centerButtonActiveColor,
  centerButtonInactiveColor,
  centerButtonSize,
  activeTintColor,
  inactiveTintColor,
  height = 75,
  cornerRadius = 16,
  marginHorizontal = 16,
  cutoutRadius = 44,
  cutoutDepth = 42,
  shoulderRadius = 6,
  centerSpacingWidth = 78,
  showBarGlow = true,
  showCenterGlow = true,
  showSparkles = false,
  showCenterSparkles,
  sparkleRouteName,
  sparkleRouteNames,
  renderSparkles,
  sparkleComponent,
  hideOnKeyboard = true,
  badgeBackgroundColor,
  badgeTextColor,
  labelStyle,
  activeLabelStyle,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = React.useState(() => Dimensions.get('window'));
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);

  // Resolve active theme with granular prop overrides
  const resolvedColors = React.useMemo(() => {
    let baseTheme = THEMES.default;
    if (typeof theme === 'string' && THEMES[theme]) {
      baseTheme = THEMES[theme];
    } else if (typeof theme === 'object' && theme !== null) {
      baseTheme = { ...THEMES.default, ...theme };
    }

    return {
      barColor: barColor ?? baseTheme.barColor,
      shadowColor: shadowColor ?? baseTheme.shadowColor,
      centerButtonActiveColor:
        centerButton?.activeColor ?? centerButtonActiveColor ?? baseTheme.centerButtonActiveColor,
      centerButtonInactiveColor:
        centerButton?.inactiveColor ?? centerButtonInactiveColor ?? baseTheme.centerButtonInactiveColor,
      centerButtonSize: centerButton?.size ?? centerButtonSize ?? 66,
      activeTintColor: activeTintColor ?? baseTheme.activeTintColor,
      inactiveTintColor: inactiveTintColor ?? baseTheme.inactiveTintColor,
      badgeBackgroundColor: badgeBackgroundColor ?? baseTheme.badgeBackgroundColor,
      badgeTextColor: badgeTextColor ?? baseTheme.badgeTextColor,
    };
  }, [
    theme,
    barColor,
    shadowColor,
    centerButton?.activeColor,
    centerButton?.inactiveColor,
    centerButton?.size,
    centerButtonActiveColor,
    centerButtonInactiveColor,
    centerButtonSize,
    activeTintColor,
    inactiveTintColor,
    badgeBackgroundColor,
    badgeTextColor,
  ]);

  // Handle screen orientation/dimension changes
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription.remove();
  }, []);

  // Keyboard auto-hide listener
  React.useEffect(() => {
    if (!hideOnKeyboard) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [hideOnKeyboard]);

  // Split routes symmetrically around the center button (supporting 2, 4, 6 or more tabs)
  const { leftRoutes, centerRoute, rightRoutes, isCenterFocused } = React.useMemo(() => {
    let center = undefined;
    let sideRoutes = state.routes;

    if (centerRouteName) {
      const found = state.routes.find((r) => r.name === centerRouteName);
      if (found) {
        center = found;
        sideRoutes = state.routes.filter((r) => r.name !== centerRouteName);
      }
    }

    const half = Math.ceil(sideRoutes.length / 2);
    const left = sideRoutes.slice(0, half);
    const right = sideRoutes.slice(half);

    const isCenterActive = center
      ? state.index === state.routes.findIndex((r) => r.name === centerRouteName)
      : false;

    return {
      leftRoutes: left,
      centerRoute: center,
      rightRoutes: right,
      isCenterFocused: isCenterActive,
    };
  }, [state.routes, state.index, centerRouteName]);

  // Memoize SVG notch path and layout math
  const layout = React.useMemo(() => {
    const marginBottom = Math.max(insets.bottom + 10, 16);
    const barWidth = dimensions.width - marginHorizontal * 2;
    const pad = 160;
    const svgWidth = barWidth + pad * 2;
    const svgHeight = height + pad * 2;
    const cx = svgWidth / 2;
    const rx = cutoutRadius;
    const ry = cutoutDepth;
    const p = shoulderRadius;
    const r = cornerRadius;
    const topY = pad;
    const bottomY = height + pad;

    // Smooth SVG notch curve path
    const path = `
      M ${pad + r} ${topY}
      L ${cx - rx - p} ${topY}
      A ${p} ${p} 0 0 1 ${cx - rx} ${topY + p}
      A ${rx} ${ry} 0 0 0 ${cx + rx} ${topY + p}
      A ${p} ${p} 0 0 1 ${cx + rx + p} ${topY}
      L ${svgWidth - pad - r} ${topY}
      A ${r} ${r} 0 0 1 ${svgWidth - pad} ${topY + r}
      L ${svgWidth - pad} ${bottomY - r}
      A ${r} ${r} 0 0 1 ${svgWidth - pad - r} ${bottomY}
      L ${pad + r} ${bottomY}
      A ${r} ${r} 0 0 1 ${pad} ${bottomY - r}
      L ${pad} ${topY + r}
      A ${r} ${r} 0 0 1 ${pad + r} ${topY}
      Z
    `;

    return {
      barWidth,
      height,
      marginBottom,
      pad,
      svgWidth,
      svgHeight,
      topY,
      path,
      centerSpacingWidth,
    };
  }, [
    dimensions.width,
    insets.bottom,
    marginHorizontal,
    height,
    cornerRadius,
    cutoutRadius,
    cutoutDepth,
    shoulderRadius,
    centerSpacingWidth,
  ]);

  // Center button press handler
  const handleCenterPress = React.useCallback(() => {
    if (centerButton?.onPress) {
      centerButton.onPress();
    } else if (centerRoute) {
      const event = navigation.emit({
        type: 'tabPress',
        target: centerRoute.key,
        canPreventDefault: true,
      });

      if (!isCenterFocused && !event.defaultPrevented) {
        navigation.navigate(centerRoute.name, centerRoute.params);
      }
    } else if (onPressCenterButton) {
      onPressCenterButton(navigation);
    }
  }, [centerButton, centerRoute, isCenterFocused, navigation, onPressCenterButton]);

  if (hideOnKeyboard && isKeyboardVisible) {
    return null;
  }

  const backgroundProps = {
    barWidth: layout.barWidth,
    height: layout.height,
    svgWidth: layout.svgWidth,
    svgHeight: layout.svgHeight,
    pad: layout.pad,
    topY: layout.topY,
    path: layout.path,
    barColor: resolvedColors.barColor,
    shadowColor: resolvedColors.shadowColor,
    showBarGlow,
  };

  const renderTab = (route: typeof state.routes[number]) => {
    const isFocused = state.routes[state.index]?.key === route.key;
    const options = descriptors[route.key]?.options || {};

    const isRouteInSparkles = (() => {
      const names = sparkleRouteNames ?? sparkleRouteName;
      if (!names) return false;
      return Array.isArray(names) ? names.includes(route.name) : names === route.name;
    })();

    const optionsAny = options as any;
    const hasSparkles =
      optionsAny?.tabBarSparkle !== undefined
        ? Boolean(optionsAny.tabBarSparkle)
        : showSparkles || isRouteInSparkles;

    const itemProps = {
      route,
      isFocused,
      navigation,
      options,
      activeTintColor: resolvedColors.activeTintColor,
      inactiveTintColor: resolvedColors.inactiveTintColor,
      badgeBackgroundColor: resolvedColors.badgeBackgroundColor,
      badgeTextColor: resolvedColors.badgeTextColor,
      showSparkles: hasSparkles,
      renderSparkles,
      sparkleComponent,
      labelStyle,
      activeLabelStyle,
    };

    if (renderTabItem) {
      return <React.Fragment key={route.key}>{renderTabItem(itemProps)}</React.Fragment>;
    }

    return <TabBarItem key={route.key} {...itemProps} />;
  };

  const centerSparklesActive =
    showCenterSparkles ??
    (showSparkles && (!centerRouteName || isCenterFocused));

  return (
    <View pointerEvents="box-none" style={styles.rootWrapper}>
      <View
        pointerEvents="box-none"
        style={[
          styles.container,
          {
            width: layout.barWidth,
            height: layout.height,
            marginBottom: layout.marginBottom,
          },
          style,
        ]}
      >
        {/* Background slot or default SVG curved cutout canvas with ambient radial glow */}
        {renderBackground ? (
          renderBackground(backgroundProps)
        ) : (
          <CurvedBackground {...backgroundProps} />
        )}

        {/* Content row for tabs */}
        <View style={styles.contentContainer} pointerEvents="box-none">
          {/* Left tabs container (1, 2, or 3 tabs) */}
          <View style={styles.sideContainer} pointerEvents="box-none">
            {leftRoutes.map(renderTab)}
          </View>

          {/* Notch Spacer to keep side tabs from entering cutout area */}
          <View
            style={{ width: layout.centerSpacingWidth }}
            pointerEvents="box-none"
          />

          {/* Right tabs container (1, 2, or 3 tabs) */}
          <View style={styles.sideContainer} pointerEvents="box-none">
            {rightRoutes.map(renderTab)}
          </View>
        </View>

        {/* Center elevated button (supports Navigation tab mode or standalone Action FAB mode) */}
        <CenterButton
          isFocused={isCenterFocused}
          onPress={handleCenterPress}
          activeColor={resolvedColors.centerButtonActiveColor}
          inactiveColor={resolvedColors.centerButtonInactiveColor}
          size={resolvedColors.centerButtonSize}
          shadowColor={resolvedColors.shadowColor}
          showGlow={showCenterGlow}
          showSparkles={centerSparklesActive}
          enableSpringAnimation={enableSpringAnimation}
          config={centerButton}
          renderSparkles={renderSparkles}
          sparkleComponent={sparkleComponent}
          renderContent={renderCenterButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 600,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  container: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
