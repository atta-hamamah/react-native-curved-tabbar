# Changelog

## 0.1.0

First public release.

- `CurvedTabBar` for React Navigation bottom tabs: a floating bar with a notched, raised center button.
- Center button can be a tab (the middle tab by default, or any route) or an action button (`center={{ icon, onPress }}`).
- The notch is derived from the center button size; `notch` fine-tunes it.
- Themes (`ocean`, `dark`, `emerald`, `sunset`) with per-color overrides through `colors`.
- Ambient glow, animated sparkles (`sparkles`, `renderSparkles`), badges and keyboard auto-hide.
- Reports its height to React Navigation, so `useBottomTabBarHeight()` returns the real value.
- Respects standard tab options such as `tabBarIcon`, `tabBarLabel`, `tabBarBadge`, tint colors and accessibility labels.
- Render slots: `renderBackground`, `renderTabItem`, `renderSparkles`, with `CurvedBackground` and `TabBarItem` exported for reuse.
