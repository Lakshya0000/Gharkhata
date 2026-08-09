import { useEffect } from 'react';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
]);
import { Stack } from 'expo-router';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import migrations from '../drizzle/migrations';
import { db } from '../db/database';
import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { setupNotificationChannel, requestNotificationPermissions } from '../lib/notifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins: Poppins_400Regular,
    PoppinsMedium: Poppins_500Medium,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsBold: Poppins_700Bold,
  });

  const { success, error } = useMigrations(db, migrations);
  const { t } = useTranslation();

  useEffect(() => {
    setupNotificationChannel();
    requestNotificationPermissions();
    
    if ((fontsLoaded || fontError) && (success || error)) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, success, error]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="milk/add" options={{ presentation: 'modal', title: t('addMilkTitle', 'Add Milk') }} />
      <Stack.Screen name="milk/[id]" options={{ presentation: 'modal', title: t('editMilkTitle', 'Edit Milk') }} />
      <Stack.Screen name="milk/bill" options={{ title: t('generateBillTitle', 'Generate Bill') }} />
    </Stack>
  );
}
