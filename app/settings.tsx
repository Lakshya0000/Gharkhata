import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily } from '../lib/theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ReminderCard } from '../components/ReminderCard';
import { useSettings } from '../hooks/useSettings';
import { useReminders } from '../hooks/useReminders';
import { useMilk } from '../hooks/useMilk';
import { useExpenses } from '../hooks/useExpenses';
import { useUdhaari } from '../hooks/useUdhaari';
import { useBills } from '../hooks/useBills';
import { expoDb as db } from '../db/database';
import * as Sharing from 'expo-sharing';
// @ts-ignore
import * as FileSystem from 'expo-file-system';
import { Reminder } from '../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  
  // Settings Hook
  const { getSetting, setSetting, lastUpdated: settingsLastUpdated } = useSettings();
  
  // Settings State
  const [milkRate, setMilkRate] = useState('35');
  
  // Reminders Hook
  const { getReminders, addReminder, toggleReminder, deleteReminder, lastUpdated: remindersLastUpdated } = useReminders();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const { triggerUpdate: triggerMilk } = useMilk();
  const { triggerUpdate: triggerExpense } = useExpenses();
  const { triggerUpdate: triggerUdhaari } = useUdhaari();
  const { triggerUpdate: triggerBills } = useBills();
  
  // Reminder Modal State
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderHour, setReminderHour] = useState('08');
  const [reminderMinute, setReminderMinute] = useState('00');

  useEffect(() => {
    loadSettings();
  }, [settingsLastUpdated]);

  useEffect(() => {
    loadReminders();
  }, [remindersLastUpdated]);

  const loadSettings = async () => {
    const rate = await getSetting('defaultMilkRate');
    if (rate) setMilkRate(rate);
  };

  const loadReminders = async () => {
    const data = await getReminders();
    // mapped data
    setReminders(data.map((r: any) => ({
      id: r.id,
      title: r.title,
      hour: r.hour,
      minute: r.minute,
      isActive: r.is_active === 1,
      notificationId: r.notification_id,
      createdAt: r.created_at
    })));
  };



  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setSetting('language', lang);
  };

  const handleAddReminder = async () => {
    const h = parseInt(reminderHour, 10);
    const m = parseInt(reminderMinute, 10);
    if (isNaN(h) || isNaN(m) || !reminderTitle) {
      Alert.alert(t('error'), t('invalidInput'));
      return;
    }
    await addReminder(reminderTitle, h, m);
    setReminderModalVisible(false);
    setReminderTitle('');
    setReminderHour('08');
    setReminderMinute('00');
  };

  const handleExportData = async () => {
    try {
      const csvContent = "data,to,be,exported\n1,2,3,4"; // Dummy CSV content for now
      // @ts-ignore
      const fileUri = `${FileSystem.documentDirectory}gharkhata_export.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert(t('error'), t('exportFailed'));
    }
  };

  const handleClearData = () => {
    Alert.alert(
      t('settings.clearData'),
      t('settings.clearDataConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('settings.clearData'), 
          style: 'destructive',
          onPress: async () => {
            await db.execAsync('DELETE FROM milk_entries');
            await db.execAsync('DELETE FROM milk_bills');
            await db.execAsync('DELETE FROM expenses');
            await db.execAsync('DELETE FROM udhaari_entries');
            await db.execAsync('DELETE FROM settings');
            
            // Set defaults again
            setMilkRate('35');
            
            // Trigger global refreshes
            triggerMilk();
            triggerExpense();
            triggerUdhaari();
            triggerBills();
            
            Alert.alert(t('success'), t('settings.dataCleared'));
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>


      {/* 1. Milk Settings */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.milkSettings', 'Milk Settings')}</Text>
        <Input 
          label={t('settings.milkRate', 'Default Milk Rate (₹/L)')} 
          value={milkRate}
          onChangeText={(val) => {
            setMilkRate(val);
            if (val) setSetting('defaultMilkRate', val);
          }}
          keyboardType="numeric"
          placeholder="e.g. 35"
        />
      </Card>

      {/* 2. Reminders */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('settings.reminders')}</Text>
          <TouchableOpacity onPress={() => setReminderModalVisible(true)}>
            <MaterialCommunityIcons name="plus-circle" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {reminders.map(rem => (
          <ReminderCard 
            key={rem.id} 
            reminder={rem} 
            onToggle={(isActive) => toggleReminder(rem.id, isActive, rem.title, rem.hour, rem.minute)}
            onDelete={() => deleteReminder(rem.id)}
          />
        ))}
        {reminders.length === 0 && (
          <Text style={styles.emptyText}>{t('settings.noReminders')}</Text>
        )}
      </Card>

      {/* 3. Language */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.row}>
          <Button 
            title="English" 
            variant={i18n.language === 'en' ? 'primary' : 'outline'}
            onPress={() => handleLanguageChange('en')}
            style={styles.flex1}
          />
          <View style={{ width: Spacing.md }} />
          <Button 
            title="हिन्दी" 
            variant={i18n.language === 'hi' ? 'primary' : 'outline'}
            onPress={() => handleLanguageChange('hi')}
            style={styles.flex1}
          />
        </View>
      </Card>

      {/* 4. Data */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.data')}</Text>
        <Button 
          title={t('settings.exportData')} 
          variant="outline"
          onPress={handleExportData}
          style={styles.marginBottom}
        />
        <Button 
          title={t('settings.clearData')} 
          variant="danger"
          onPress={handleClearData}
        />
      </Card>

      {/* 5. About */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>GharKhata v1.0</Text>
        <Text style={styles.aboutText}>Made with ❤️ for Maa</Text>
      </View>

      {/* Add Reminder Modal */}
      <Modal visible={isReminderModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Card style={styles.modalContent}>
            <Text style={styles.sectionTitle}>{t('settings.addReminder')}</Text>
            <Input 
              label={t('title')} 
              value={reminderTitle}
              onChangeText={setReminderTitle}
              placeholder="e.g. Log morning milk"
            />
            <View style={styles.row}>
              <Input 
                label="Hour (0-23)" 
                value={reminderHour}
                onChangeText={setReminderHour}
                keyboardType="numeric"
                style={styles.flex1}
              />
              <View style={{ width: Spacing.sm }} />
              <Input 
                label="Minute (0-59)" 
                value={reminderMinute}
                onChangeText={setReminderMinute}
                keyboardType="numeric"
                style={styles.flex1}
              />
            </View>
            <View style={styles.row}>
              <Button 
                title={t('cancel')} 
                variant="outline"
                onPress={() => setReminderModalVisible(false)}
                style={styles.flex1}
              />
              <View style={{ width: Spacing.sm }} />
              <Button 
                title={t('save')} 
                onPress={handleAddReminder}
                style={styles.flex1}
              />
            </View>
          </Card>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: Spacing.md,
  },
  aboutSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  aboutText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    padding: Spacing.lg,
  }
});
