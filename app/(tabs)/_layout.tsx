import { Tabs, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Pressable } from 'react-native';

const Colors = {
  primary: '#2563EB',
  milk: '#F59E0B',
  expense: '#10B981',
  udhaariGiven: '#EF4444',
  udhaariTaken: '#8B5CF6',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B'
};

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home', 'Home'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable style={{ paddingRight: 16 }}>
                <MaterialCommunityIcons name="cog" size={24} color={Colors.textPrimary} />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="milk"
        options={{
          title: t('tabs.milk', 'Milk'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cow" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: t('tabs.kharcha', 'Kharcha'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="udhaari"
        options={{
          title: t('tabs.udhaari', 'Udhaari'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-cash" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: t('tabs.summary', 'Summary'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-box" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
  },
  tabBarLabel: {
    fontFamily: 'Poppins',
  },
});
