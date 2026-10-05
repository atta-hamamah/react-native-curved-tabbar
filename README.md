# react-native-curved-tabbar

A modern, highly customizable curved bottom tab bar for **React Navigation** (v6 & v7) featuring a smooth SVG cutout notch, an elevated floating center button (FAB), ambient radial glow, and animated sparkles.

Works seamlessly on both **iOS** and **Android**, with support for **2, 4, or 6 tabs**.

---

## ✨ Features

- 🎨 **SVG Cutout Notch:** Mathematical bezier curve notch that smoothly hugs an elevated center button.
- 🌈 **360° Ambient Glow:** Radial gradient backdrop glow with customizable color (`shadowColor`) that won't clip on Android.
- 🔀 **Flexible Tab Counts:** Dynamically splits any number of tabs symmetrically (e.g. 2, 4, 6 tabs) around the center notch.
- 🌟 **Animated Sparkles & Micro-interactions:** Optional animated popping sparkle stars for special tabs or center button.
- 🛡️ **Keyboard Friendly:** Automatically hides when the soft keyboard opens (`hideOnKeyboard: true`).
- 🏷️ **Standard React Navigation API:** Works with existing `options.tabBarIcon`, `options.tabBarLabel`, and `options.tabBarBadge`.
- 🦾 **Fully Typed:** Written in 100% TypeScript with comprehensive definitions.

---

## 📦 Installation

```bash
npm install react-native-curved-tabbar
```

### Peer Dependencies
Ensure you have the required peer dependencies installed:

```bash
npm install react-native-svg react-native-safe-area-context @react-navigation/native @react-navigation/bottom-tabs
```

If you are using bare React Native on iOS:
```bash
npx pod-install
```

---

## 🚀 Quick Start (4 Tabs + Center Home Button)

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CurvedTabBar } from 'react-native-curved-tabbar';
import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons

import HomeScreen from './screens/HomeScreen';
import OffersScreen from './screens/OffersScreen';
import CardsScreen from './screens/CardsScreen';
import CartScreen from './screens/CartScreen';
import MenuScreen from './screens/MenuScreen';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => (
        <CurvedTabBar
          {...props}
          centerRouteName="Home"
          theme="ocean" // 'ocean' | 'dark' | 'emerald' | 'sunset'
          showBarGlow={true}
          showCenterGlow={true}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Offers"
        component={OffersScreen}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          tabBarLabel: 'Cards',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Center Home Route (Rendered in the elevated center notch) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: 3,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

---

## 🔢 Tab Counts Support

The tab bar automatically splits all side tabs symmetrically around the center button:

| Tab Count | Symmetrical Distribution |
| :--- | :--- |
| **2 Tabs** | 1 Tab (Left) + `[Center Button]` + 1 Tab (Right) |
| **4 Tabs** | 2 Tabs (Left) + `[Center Button]` + 2 Tabs (Right) |
| **6 Tabs** | 3 Tabs (Left) + `[Center Button]` + 3 Tabs (Right) |

---

## ⚙️ Customization Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `'ocean' \| 'dark' \| 'emerald' \| 'sunset' \| TabBarTheme` | `'ocean'` | Built-in theme preset or custom theme object. Individual color props override theme values. |
| `centerRouteName` | `string` | `undefined` | The name of the route to place in the elevated center notch. |
| `centerButton` | `CenterButtonConfig` | `undefined` | Configuration for Action FAB mode (`{ icon, onPress, size, activeColor, inactiveColor }`). |
| `onPressCenterButton` | `(navigation) => void` | `undefined` | Custom action callback when center button is pressed. |
| `renderCenterButton` | `(props) => ReactNode` | `DefaultHomeIcon` | Custom render function for the center button content. |
| `renderBackground` | `(props) => ReactNode` | `undefined` | Custom render slot for the tab bar background surface (e.g., BlurView or Gradient). |
| `renderTabItem` | `(props) => ReactNode` | `undefined` | Custom render slot for tab items. |
| `enableSpringAnimation` | `boolean` | `true` | Enables native spring scale bounce micro-interaction on button tap. |
| `barColor` | `string` | `'#FFFFFF'` | Background fill color of the curved tab bar. |
| `shadowColor` | `string` | `'#33B8D2'` | Color of the radial ambient glow and aura backdrop. |
| `centerButtonActiveColor` | `string` | `'#0072BB'` | Background color of center button when focused. |
| `centerButtonInactiveColor` | `string` | `'#86A8BC'` | Background color of center button when unfocused. |
| `centerButtonSize` | `number` | `66` | Diameter of the center floating button in points. |
| `activeTintColor` | `string` | `'#0072BB'` | Active color for tab icons and text labels. |
| `inactiveTintColor` | `string` | `'#86A8BC'` | Inactive color for tab icons and text labels. |
| `height` | `number` | `75` | Height of the tab bar surface (excluding safe area insets). |
| `cornerRadius` | `number` | `16` | Corner radius for the floating bar corners. |
| `marginHorizontal` | `number` | `16` | Horizontal margin from screen edge. |
| `cutoutRadius` | `number` | `44` | Horizontal radius of the notch cutout. |
| `cutoutDepth` | `number` | `42` | Vertical depth of the notch cutout. |
| `shoulderRadius` | `number` | `6` | Radius smoothing the transition into the cutout curve. |
| `centerSpacingWidth` | `number` | `78` | Width of the center gap between left and right tabs. |
| `showBarGlow` | `boolean` | `true` | Show ambient radial glow behind the bar. |
| `showCenterGlow` | `boolean` | `true` | Show radial glow behind the center button. |
| `showSparkles` | `boolean` | `false` | Enable animated star sparkles globally on all tabs and center button. |
| `showCenterSparkles` | `boolean` | `false` | Enable sparkles specifically on the center button. |
| `sparkleRouteNames` | `string \| string[]` | `undefined` | Route name or list of routes to display sparkles on (e.g. `['Offers', 'Cards']`). |
| `renderSparkles` | `(props) => ReactNode` | `undefined` | Custom render function to replace default star sparkles with any custom component (e.g. Lottie, fire emoji, pulse badge). |
| `sparkleComponent` | `ReactNode` | `undefined` | Custom static component to render instead of default star sparkles. |
| `hideOnKeyboard` | `boolean` | `true` | Automatically hide the tab bar when the keyboard is open. |
| `badgeBackgroundColor` | `string` | `'#FF6600'` | Background color of the badge indicator. |
| `badgeTextColor` | `string` | `'#FFFFFF'` | Text color of the badge label. |
| `labelStyle` | `TextStyle` | `undefined` | Custom style for tab item text labels. |
| `activeLabelStyle` | `TextStyle` | `undefined` | Custom style for active tab item text labels. |

---

## ✨ Controlling Sparkles & Custom Highlights

You can control which tabs have sparkles in 3 different ways:

### 1. Directly in `Tab.Screen` options (Recommended)
Add `tabBarSparkle: true` directly to any screen's options:

```tsx
<Tab.Screen
  name="Offers"
  component={OffersScreen}
  options={{
    tabBarLabel: 'Offers',
    tabBarSparkle: true, // That's it!
  }}
/>
```

### 2. Passing Route Names into `CurvedTabBar`
Target a single route or multiple routes:

```tsx
<CurvedTabBar
  {...props}
  sparkleRouteNames={['Offers', 'Cards']} // Targets both tabs!
/>
```

### 3. Replacing Star Sparkles with Any Custom Component
If you don't want to use our default star sparkles, pass your own custom animation (such as a fire badge, glowing dot, or Lottie animation):

```tsx
<CurvedTabBar
  {...props}
  sparkleRouteNames={['Offers']}
  renderSparkles={({ routeName, isFocused }) => (
    <MyCustomPulsingFireBadge />
  )}
/>
```

Or customize it per-screen:
```tsx
<Tab.Screen
  name="Offers"
  options={{
    tabBarSparkle: true,
    tabBarSparkleComponent: <MyCustomFlameIcon />,
  }}
/>
```

---

## 🎮 Interactive Example Playground

An interactive showcase app is included in the [`example/`](file:///c:/Users/Uniparticle/.gemini/antigravity-ide/scratch/react-native-curved-tabbar/example) directory. It features live theme cycling, ambient glow toggles, animated sparkle controls, notch dimension sliders, and live cart badge testing.

To run the playground:

```bash
cd example
npm start
```

- Press **`w`** in the terminal to test immediately in the web browser.
- Or scan the QR code with **Expo Go** on your iOS or Android phone.

---

## 📄 License

MIT © [Open Source](LICENSE)
