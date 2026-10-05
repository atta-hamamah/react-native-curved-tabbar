import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export interface TabBarTheme {
  barColor: string;
  shadowColor: string;
  centerButtonActiveColor: string;
  centerButtonInactiveColor: string;
  activeTintColor: string;
  inactiveTintColor: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
}

export type TabBarPresetTheme = 'ocean' | 'dark' | 'emerald' | 'sunset' | 'default';

export interface CenterButtonProps {
  isFocused: boolean;
  color: string;
  size: number;
}

export interface SparkleProps {
  routeName?: string;
  isFocused: boolean;
  isCenter?: boolean;
}

export interface CenterButtonConfig {
  /**
   * Custom icon element or render function for the center action button.
   */
  icon?: React.ReactNode | ((props: CenterButtonProps) => React.ReactNode);

  /**
   * Action handler triggered on tap. When provided, turns the center button into an action FAB.
   */
  onPress?: () => void;

  /**
   * Background color when active / pressed.
   */
  activeColor?: string;

  /**
   * Background color when inactive.
   */
  inactiveColor?: string;

  /**
   * Diameter/size in points.
   */
  size?: number;

  /**
   * Whether to display sparkles on the center button.
   */
  showSparkles?: boolean;

  /**
   * Custom component to render instead of default star sparkles on the center button.
   */
  sparkleComponent?: React.ReactNode;

  /**
   * Custom render function for sparkles on the center button.
   */
  renderSparkles?: (props: SparkleProps) => React.ReactNode;

  /**
   * Accessibility label for screen readers.
   */
  accessibilityLabel?: string;

  /**
   * Test identifier.
   */
  testID?: string;
}

export interface CurvedTabBarProps extends BottomTabBarProps {
  /**
   * Preset color theme ('ocean' | 'dark' | 'emerald' | 'sunset' | 'default')
   * or a custom theme object with color overrides.
   * Individual color props (`barColor`, `shadowColor`, etc.) take precedence over theme values.
   */
  theme?: TabBarPresetTheme | Partial<TabBarTheme>;

  /**
   * The route name that should be rendered in the center elevated button notch.
   * If provided, that route is extracted from `state.routes` and rendered in the center.
   * The remaining routes are split symmetrically to the left and right.
   */
  centerRouteName?: string;

  /**
   * Configuration for the center button (Action FAB mode or custom icon/action).
   */
  centerButton?: CenterButtonConfig;

  /**
   * Custom callback triggered when the center button is pressed.
   * If not provided, default React Navigation navigation/tabPress logic is triggered.
   */
  onPressCenterButton?: (navigation: BottomTabBarProps['navigation']) => void;

  /**
   * Custom render function for the center button content (icon/label).
   */
  renderCenterButton?: (props: CenterButtonProps) => React.ReactNode;

  /**
   * Optional custom render slot for the tab bar background surface (e.g. BlurView, Gradient).
   */
  renderBackground?: (props: TabBarBackgroundProps) => React.ReactNode;

  /**
   * Optional custom render slot for individual tab bar items.
   */
  renderTabItem?: (props: TabItemProps) => React.ReactNode;

  /**
   * Whether to enable the smooth native spring scale bounce micro-interaction on the center button.
   * @default true
   */
  enableSpringAnimation?: boolean;

  /**
   * Background color of the tab bar SVG surface.
   * @default '#FFFFFF'
   */
  barColor?: string;

  /**
   * Shadow & ambient glow aura color.
   * @default '#33B8D2'
   */
  shadowColor?: string;

  /**
   * Background color of the center elevated button in active/focused state.
   * @default '#0072BB'
   */
  centerButtonActiveColor?: string;

  /**
   * Background color of the center elevated button in inactive state.
   * @default '#86A8BC'
   */
  centerButtonInactiveColor?: string;

  /**
   * Diameter/size of the circular center button in points.
   * @default 66
   */
  centerButtonSize?: number;

  /**
   * Active tint color for tab labels and icons.
   * @default '#0072BB'
   */
  activeTintColor?: string;

  /**
   * Inactive tint color for tab labels and icons.
   * @default '#86A8BC'
   */
  inactiveTintColor?: string;

  /**
   * Height of the main tab bar container (excluding bottom insets).
   * @default 75
   */
  height?: number;

  /**
   * Corner radius for the floating tab bar edges.
   * @default 16
   */
  cornerRadius?: number;

  /**
   * Horizontal margin from the screen edges.
   * @default 16
   */
  marginHorizontal?: number;

  /**
   * Horizontal radius (half-width) of the curve notch cutout.
   * @default 44
   */
  cutoutRadius?: number;

  /**
   * Vertical radius (depth) of the curve notch cutout.
   * @default 42
   */
  cutoutDepth?: number;

  /**
   * Shoulder radius smoothing the transition from the top edge into the cutout.
   * @default 6
   */
  shoulderRadius?: number;

  /**
   * Width of the center spacer separating left and right tabs around the center button.
   * @default 78
   */
  centerSpacingWidth?: number;

  /**
   * Whether to display the 360-degree ambient radial glow around the bar.
   * @default true
   */
  showBarGlow?: boolean;

  /**
   * Whether to display the radial glow behind the center floating button.
   * @default true
   */
  showCenterGlow?: boolean;

  /**
   * Whether to display animated sparkles globally on all tabs and center button.
   * @default false
   */
  showSparkles?: boolean;

  /**
   * Whether to display animated sparkles specifically on the center button.
   * @default false
   */
  showCenterSparkles?: boolean;

  /**
   * Optional route name on which to show animated sparkles (e.g., for 'Offers').
   */
  sparkleRouteName?: string;

  /**
   * Single route name or array of route names on which to show animated sparkles.
   * Example: `sparkleRouteNames={['Offers', 'Cart']}`
   * You can also set `options={{ tabBarSparkle: true }}` directly on any Tab.Screen!
   */
  sparkleRouteNames?: string | string[];

  /**
   * Custom render function to replace the default star sparkles with any custom component
   * (e.g., custom badge, Lottie animation, fire icon, pulse ring, etc.).
   */
  renderSparkles?: (props: SparkleProps) => React.ReactNode;

  /**
   * Custom static component to render instead of default star sparkles.
   */
  sparkleComponent?: React.ReactNode;

  /**
   * Whether to hide the tab bar when the software keyboard appears (iOS & Android).
   * @default true
   */
  hideOnKeyboard?: boolean;

  /**
   * Background color for notification/cart badge circles.
   * @default '#FF6600'
   */
  badgeBackgroundColor?: string;

  /**
   * Text color for badge labels.
   * @default '#FFFFFF'
   */
  badgeTextColor?: string;

  /**
   * Custom style for inactive tab labels.
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for active tab labels.
   */
  activeLabelStyle?: StyleProp<TextStyle>;

  /**
   * Custom container style.
   */
  style?: StyleProp<ViewStyle>;
}

export interface TabBarBackgroundProps {
  barWidth: number;
  height: number;
  svgWidth: number;
  svgHeight: number;
  pad: number;
  topY: number;
  path: string;
  barColor: string;
  shadowColor: string;
  showBarGlow: boolean;
}

export interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][number];
  isFocused: boolean;
  navigation: BottomTabBarProps['navigation'];
  options: BottomTabBarProps['descriptors'][string]['options'];
  activeTintColor: string;
  inactiveTintColor: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
  showSparkles?: boolean;
  renderSparkles?: (props: SparkleProps) => React.ReactNode;
  sparkleComponent?: React.ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
}
