import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CurvedTabBar, type TabBarThemeName } from '@atta-hamamah/react-native-curved-tabbar';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

const PRESET_THEMES: { key: TabBarThemeName; name: string; bg: string; dark?: boolean; color: string }[] = [
  { key: 'ocean', name: 'Ocean Cyan (Preset)', bg: '#F0F9FF', color: '#0072BB' },
  { key: 'dark', name: 'Cyberpunk Dark (Preset)', bg: '#09090E', dark: true, color: '#EC4899' },
  { key: 'emerald', name: 'Emerald Mint (Preset)', bg: '#ECFDF5', color: '#059669' },
  { key: 'sunset', name: 'Sunset Orange (Preset)', bg: '#FFF7ED', color: '#EA580C' },
];

// Example of a custom user-defined replacement for star sparkles: Pulsing Fire Badge
function CustomFirePulse() {
  const pulse = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.35, duration: 450, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 450, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.customFireContainer,
        {
          transform: [{ scale: pulse }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={{ fontSize: 13 }}>🔥</Text>
    </Animated.View>
  );
}

function ScreenContent({
  title,
  subtitle,
  icon,
  themeInfo,
  children,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  themeInfo: typeof PRESET_THEMES[0];
  children?: React.ReactNode;
}) {
  const isDark = themeInfo.dark;
  // The curved bar reports its real height, so content can scroll clear of it.
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: themeInfo.bg }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}>
        <View style={styles.header}>
          <View style={[styles.headerIconCircle, { backgroundColor: themeInfo.color + '20' }]}>
            <Ionicons name={icon} size={32} color={themeInfo.color} />
          </View>
          <Text style={[styles.screenTitle, isDark && styles.textLight]}>{title}</Text>
          <Text style={[styles.screenSubtitle, isDark && styles.textMutedDark]}>{subtitle}</Text>
        </View>

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [themeIdx, setThemeIdx] = useState(0);
  const [showBarGlow, setShowBarGlow] = useState(true);
  const [showCenterGlow, setShowCenterGlow] = useState(true);
  const [enableSpring, setEnableSpring] = useState(true);
  const [isActionFab, setIsActionFab] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [shallowNotch, setShallowNotch] = useState(false);
  const [wideNotch, setWideNotch] = useState(false);
  const [bigButton, setBigButton] = useState(false);

  // Sparkle controls
  const [sparkleTarget, setSparkleTarget] = useState<'offers' | 'cards' | 'both'>('offers');
  const [sparkleType, setSparkleType] = useState<'stars' | 'fire'>('stars');

  const currentTheme = PRESET_THEMES[themeIdx];
  const isDark = currentTheme.dark;

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % PRESET_THEMES.length);
  };

  // Compute active routes for sparkles
  const activeSparkleRoutes = React.useMemo(() => {
    if (sparkleTarget === 'both') return ['Offers', 'Cards'];
    if (sparkleTarget === 'cards') return ['Cards'];
    return ['Offers'];
  }, [sparkleTarget]);

  const renderHomeContent = () => (
    <View style={styles.cardContainer}>
      {/* 1. Sparkle Control & Custom Component Switcher */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.textLight]}>✨ Sparkle Control & Custom Component</Text>
        <Text style={[styles.cardSubtitle, isDark && styles.textMutedDark]}>
          Choose which icon has sparkle, or swap stars for any custom component:
        </Text>

        <Text style={[styles.controlLabel, isDark && styles.textLight]}>1. Which tab gets sparkle?</Text>
        <View style={styles.chipRow}>
          {(['offers', 'cards', 'both'] as const).map((target) => (
            <TouchableOpacity
              key={target}
              style={[
                styles.chip,
                sparkleTarget === target && { backgroundColor: currentTheme.color, borderColor: currentTheme.color },
              ]}
              onPress={() => setSparkleTarget(target)}
            >
              <Text
                style={[
                  styles.chipText,
                  sparkleTarget === target && styles.chipTextActive,
                ]}
              >
                {target === 'both' ? 'Both (Offers + Cards)' : target.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.controlLabel, { marginTop: 12 }, isDark && styles.textLight]}>
          2. Sparkle Component Style:
        </Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              sparkleType === 'stars' && { backgroundColor: currentTheme.color, borderColor: currentTheme.color },
            ]}
            onPress={() => setSparkleType('stars')}
          >
            <Text style={[styles.chipText, sparkleType === 'stars' && styles.chipTextActive]}>
              ⭐ Default Star Sparkles
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              sparkleType === 'fire' && { backgroundColor: currentTheme.color, borderColor: currentTheme.color },
            ]}
            onPress={() => setSparkleType('fire')}
          >
            <Text style={[styles.chipText, sparkleType === 'fire' && styles.chipTextActive]}>
              🔥 Custom Fire Pulse
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Theme Preset Selector */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.textLight]}>🎨 Theme Preset API</Text>
        <Text style={[styles.cardSubtitle, isDark && styles.textMutedDark]}>
          Using 1 prop: <Text style={{ fontWeight: 'bold' }}>theme="{currentTheme.key}"</Text>
        </Text>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: currentTheme.color }]}
          onPress={cycleTheme}
          activeOpacity={0.85}
        >
          <Ionicons name="color-palette-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Cycle Preset ({currentTheme.name})</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Micro-Interactions & Center FAB Mode */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.textLight]}>⚡ Center Modes & Springs</Text>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, isDark && styles.textLight]}>Spring Scale Bounce</Text>
            <Text style={[styles.toggleSublabel, isDark && styles.textMutedDark]}>
              Native spring physics on button press
            </Text>
          </View>
          <Switch
            value={enableSpring}
            onValueChange={setEnableSpring}
            trackColor={{ true: currentTheme.color, false: '#ccc' }}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, isDark && styles.textLight]}>Action FAB Mode</Text>
            <Text style={[styles.toggleSublabel, isDark && styles.textMutedDark]}>
              Center button triggers action modal without changing tab
            </Text>
          </View>
          <Switch
            value={isActionFab}
            onValueChange={setIsActionFab}
            trackColor={{ true: currentTheme.color, false: '#ccc' }}
          />
        </View>
      </View>

      {/* 4. Visual Effects Toggles */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.textLight]}>✨ Glow & Notch Controls</Text>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, isDark && styles.textLight]}>Tab Bar Glow</Text>
          <Switch
            value={showBarGlow}
            onValueChange={setShowBarGlow}
            trackColor={{ true: currentTheme.color, false: '#ccc' }}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, isDark && styles.textLight]}>Center FAB Aura Glow</Text>
          <Switch
            value={showCenterGlow}
            onValueChange={setShowCenterGlow}
            trackColor={{ true: currentTheme.color, false: '#ccc' }}
          />
        </View>

        <Text style={[styles.toggleSublabel, { maxWidth: undefined }, isDark && styles.textMutedDark]}>
          The notch fits the button automatically. Change the size and it follows.
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.smallButton, { borderColor: currentTheme.color }]}
            onPress={() => setBigButton((v) => !v)}
          >
            <Text style={[styles.smallButtonText, { color: currentTheme.color }]}>
              {bigButton ? 'Button: 76' : 'Button: 66'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, { borderColor: currentTheme.color }]}
            onPress={() => setShallowNotch((v) => !v)}
          >
            <Text style={[styles.smallButtonText, { color: currentTheme.color }]}>
              {shallowNotch ? 'Depth: 34' : 'Depth: auto'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, { borderColor: currentTheme.color }]}
            onPress={() => setWideNotch((v) => !v)}
          >
            <Text style={[styles.smallButtonText, { color: currentTheme.color }]}>
              {wideNotch ? 'Width: 54' : 'Width: auto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Cart Badge Tester */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.cardTitle, isDark && styles.textLight]}>🏷️ Cart Badge Count</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setCartCount((c) => Math.max(0, c - 1))}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.counterValue, isDark && styles.textLight]}>{cartCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setCartCount((c) => c + 1)}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => (
          <CurvedTabBar
            {...props}
            theme={currentTheme.key}
            // No `route` given: with 5 tabs, the middle one ("Home") becomes the center button.
            // Adding `onPress` without a route turns it into an action button instead.
            center={{
              size: bigButton ? 76 : 66,
              pressAnimation: enableSpring,
              ...(isActionFab && {
                icon: ({ color, size }) => <Ionicons name="add" size={size + 4} color={color} />,
                onPress: () =>
                  Alert.alert(
                    '⚡ Action FAB Triggered',
                    'Center button can execute any modal, camera, or quick action without changing navigation routes!'
                  ),
              }),
            }}
            glow={{ bar: showBarGlow, center: showCenterGlow }}
            sparkles={activeSparkleRoutes}
            renderSparkles={sparkleType === 'fire' ? () => <CustomFirePulse /> : undefined}
            notch={{
              depth: shallowNotch ? 34 : undefined,
              radius: wideNotch ? 54 : undefined,
            }}
          />
        )}
      >
        <Tab.Screen
          name="Offers"
          options={{
            tabBarLabel: 'Offers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetag-outline" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ScreenContent
              title="Special Offers"
              subtitle="Highlight tabs with sparkles={['Offers']}."
              icon="gift-outline"
              themeInfo={currentTheme}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Cards"
          options={{
            tabBarLabel: 'Cards',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card-outline" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ScreenContent
              title="Payment Cards"
              subtitle="Symmetrically positioned to the left."
              icon="card-outline"
              themeInfo={currentTheme}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: 'Home',
            // Used by the center button automatically (and by the side tab in action-button mode).
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ScreenContent
              title="Curved Tab Bar Playground"
              subtitle="Test and toggle all features in real-time below."
              icon="home-outline"
              themeInfo={currentTheme}
            >
              {renderHomeContent()}
            </ScreenContent>
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Cart"
          options={{
            tabBarLabel: 'Cart',
            tabBarBadge: cartCount > 0 ? cartCount : undefined,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ScreenContent
              title="Shopping Cart"
              subtitle={`Active badge shows ${cartCount} items.`}
              icon="cart-outline"
              themeInfo={currentTheme}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Menu"
          options={{
            tabBarLabel: 'Menu',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu-outline" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <ScreenContent
              title="Settings & Menu"
              subtitle="Symmetrically balanced on the right."
              icon="ellipsis-horizontal-circle-outline"
              themeInfo={currentTheme}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 18,
  },
  headerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 300,
  },
  cardContainer: {
    marginTop: 10,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E2A',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  customFireContainer: {
    position: 'absolute',
    top: -6,
    right: -8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  toggleSublabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 240,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  smallButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  smallButtonText: {
    fontWeight: '600',
    fontSize: 12,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 6,
  },
  counterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  textLight: {
    color: '#F8FAFC',
  },
  textMutedDark: {
    color: '#94A3B8',
  },
});
