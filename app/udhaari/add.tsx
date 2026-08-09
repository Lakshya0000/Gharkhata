import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUdhaari } from '../../hooks/useUdhaari';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../lib/theme';

export default function AddUdhaariScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addUdhaari } = useUdhaari();

  const [type, setType] = useState<'given' | 'taken'>('given');
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = async () => {
    if (!personName || !amount) return;

    await addUdhaari({
      personName,
      amount: parseFloat(amount),
      type,
      reason,
      date,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: t('udhaari.addUdhaari', 'Add Udhaari') }} />
      <View style={styles.typeSelector}>
        <Button 
          title={t('udhaari.given')} 
          variant={type === 'given' ? 'primary' : 'outline'}
          onPress={() => setType('given')}
          style={styles.typeButton}
        />
        <Button 
          title={t('udhaari.taken')} 
          variant={type === 'taken' ? 'primary' : 'outline'}
          onPress={() => setType('taken')}
          style={styles.typeButton}
        />
      </View>

      <Input
        label={t('udhaari.personName')}
        value={personName}
        onChangeText={setPersonName}
        placeholder={t('udhaari.personNamePlaceholder')}
      />

      <Input
        label={t('udhaari.amount')}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder={t('udhaari.amountPlaceholder')}
      />

      <Input
        label={t('udhaari.reason')}
        value={reason}
        onChangeText={setReason}
        placeholder={t('udhaari.reasonPlaceholder')}
      />

      <Input
        label={t('udhaari.date')}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Button
        title={t('common.save')}
        onPress={handleSave}
        disabled={!personName || !amount}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  typeButton: {
    flex: 1,
  },
  saveButton: {
    marginTop: Spacing.xl,
  },
});
