import type * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

export type TabBarThemeName = 'ocean' | 'dark' | 'emerald' | 'sunset';

export interface TabBarColors {
  /** Fill color of the bar. */
  bar: string;
  /** Color of the ambient glow behind the bar and the center button. */
  glow: string;
  /** Icon and label color of the focused tab. */
  active: string;
  /** Icon and label color of unfocused tabs. */
  inactive: string;
  /** Center button background when its route is focused (always used for action buttons). */
  centerActive: string;
  /** Center button background when its route is not focused. */
  centerInactive: string;
  /** Icon color inside the center button. */
  centerIcon: string;
  /** Badge background. */
  badge: string;
  /** Badge text. */
  badgeText: string;
  /** Fill color of the default sparkle stars. */
  sparkle: string;
}

export interface CenterIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export interface CenterButtonOptions {
  /**
   * Route the center button navigates to.
   * Defaults to the middle tab when the number of tabs is odd.
   */
  route?: string;

  /**
   * Called instead of navigating. Without a `route`, this turns the center
   * button into an action button (open a modal, camera, sheet, ...).
   */
  onPress?: (navigation: BottomTabBarProps['navigation']) => void;

  /**
   * Icon element or render function.
   * Defaults to the center route's `tabBarIcon`, then a built-in icon.
   */
  icon?: React.ReactNode | ((props: CenterIconProps) => React.ReactNode);

  /**
   * Diameter in points. The notch resizes to fit.
   * @default 66
   */
  size?: number;

  /**
   * Show sparkles on the center button.
   * @default false (or true when the center route is listed in `sparkles`)
   */
  sparkles?: boolean;

  /**
   * Spring scale animation when pressed.
   * @default true
   */
  pressAnimation?: boolean;

  /** Defaults to the center route's `tabBarAccessibilityLabel` or label. */
  accessibilityLabel?: string;

  /** Defaults to the center route's `tabBarButtonTestID`. */
  testID?: string;
}

export interface NotchOptions {
  /**
   * Space between the center button and the edge of the notch.
   * @default 10
   */
  gap?: number;

  /**
   * Half-width of the notch.
   * @default center button size / 2 + gap
   */
  radius?: number;

  /**
   * Depth of the notch. The center button moves so it stays `gap` above the bottom.
   * @default radius
   */
  depth?: number;

  /**
   * Rounding where the top edge of the bar meets the notch.
   * @default 6
   */
  shoulder?: number;
}

export interface GlowOptions {
  /** @default true */
  bar?: boolean;
  /** @default true */
  center?: boolean;
}

export interface SparkleRenderProps {
  /** Route the sparkles belong to (undefined for an action center button). */
  routeName?: string;
  focused: boolean;
  isCenter: boolean;
  /** `colors.sparkle` from the active theme. */
  color: string;
}

export interface TabBarBackgroundProps {
  /** Width of the bar in points. */
  width: number;
  /** Height of the bar in points. */
  height: number;
  /** SVG path of the bar shape (including the notch), in a `width` x `height` box. */
  path: string;
  colors: TabBarColors;
  /** Whether the bar glow is enabled. */
  glow: boolean;
}

export type TabRoute = BottomTabBarProps['state']['routes'][number];

export interface TabItemProps {
  route: TabRoute;
  options: BottomTabNavigationOptions;
  focused: boolean;
  /** Resolved icon/label color for the current state. */
  color: string;
  /** Resolved text label (`tabBarLabel` string, `title`, or route name). */
  label: string;
  badge?: number | string;
  /** Whether this tab should show sparkles. */
  sparkles: boolean;
  colors: TabBarColors;
  /** Navigates to the tab, emitting `tabPress` like the default tab bar. */
  onPress: () => void;
  /** Emits `tabLongPress`. */
  onLongPress: () => void;
  renderSparkles?: (props: SparkleRenderProps) => React.ReactNode;
}

export interface CurvedTabBarProps extends BottomTabBarProps {
  /**
   * Built-in color preset.
   * @default 'ocean'
   */
  theme?: TabBarThemeName;

  /** Override any color from the theme. */
  colors?: Partial<TabBarColors>;

  /**
   * The center button.
   * - omitted: the middle tab becomes the center button (when the tab count is odd)
   * - `'Home'`: use that route
   * - `{ icon, onPress }`: an action button that doesn't change tabs
   * - `false`: no center button and no notch
   */
  center?: string | CenterButtonOptions | false;

  /** Route name(s) that show animated sparkles, e.g. `['Offers']`. */
  sparkles?: string | string[];

  /**
   * Ambient glow. `false` turns it off; `{ bar, center }` controls each one.
   * @default true
   */
  glow?: boolean | GlowOptions;

  /** Fine-tune the notch. By default it fits the center button automatically. */
  notch?: NotchOptions;

  /**
   * Height of the bar, not counting the safe-area spacing below it.
   * @default 75
   */
  height?: number;

  /** @default 16 */
  cornerRadius?: number;

  /** @default 16 */
  marginHorizontal?: number;

  /**
   * Hide the tab bar while the keyboard is open.
   * @default true
   */
  hideOnKeyboard?: boolean;

  /** Style for the bar container. */
  style?: StyleProp<ViewStyle>;

  /** Replace the bar surface (e.g. a blur or gradient). */
  renderBackground?: (props: TabBarBackgroundProps) => React.ReactNode;

  /** Replace each side tab. Give your element `flex: 1` to keep even spacing. */
  renderTabItem?: (props: TabItemProps) => React.ReactNode;

  /** Replace the default sparkle stars everywhere they appear. */
  renderSparkles?: (props: SparkleRenderProps) => React.ReactNode;
}
