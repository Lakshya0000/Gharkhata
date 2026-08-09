import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUdhaari } from '../../hooks/useUdhaari';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, Spacing } from '../../lib/theme';
import { UdhaariEntry } from '../../lib/types';

export default function EditUdhaariScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getPending, getSettled, updateUdhaari, deleteUdhaari, markPaid } = useUdhaari();
  const [entries, setEntries] = useState<UdhaariEntry[]>([]);
  useEffect(() => {
    Promise.all([getPending(), getSettled()]).then(([p, s]) => setEntries([...p, ...s]));
  }, []);

  const [type, setType] = useState<'given' | 'taken'>('given');
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');

  const entryId = Number(id);

  useEffect(() => {
    const entry = entries.find((e: UdhaariEntry) => e.id === entryId);
    if (entry) {
      setType(entry.type);
      setPersonName(entry.personName);
      setAmount(entry.amount.toString());
      setReason(entry.reason || '');
      setDate(entry.date);
      setStatus(entry.status);
    }
  }, [entryId, entries]);

  const handleSave = async () => {
    if (!personName || !amount) return;
    await updateUdhaari(entryId, {
      personName,
      amount: parseFloat(amount),
      type,
      reason,
      date,
    });
    router.back();
  };

  const handleDelete = async () => {
    await deleteUdhaari(entryId);
    router.back();
  };

  const handleMarkAsPaid = async () => {
    await markPaid(entryId);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
      />

      <Input
        label={t('udhaari.amount')}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Input
        label={t('udhaari.reason')}
        value={reason}
        onChangeText={setReason}
      />

      <Input
        label={t('udhaari.date')}
        value={date}
        onChangeText={setDate}
      />

      {status === 'pending' && (
        <Button
          title={t('udhaari.markAsPaid')}
          variant="success"
          onPress={handleMarkAsPaid}
          style={styles.actionButton}
        />
      )}

      <Button
        title={t('common.save')}
        onPress={handleSave}
        disabled={!personName || !amount}
        style={styles.actionButton}
      />

      <Button
        title={t('common.delete')}
        variant="danger"
        onPress={handleDelete}
        style={styles.actionButton}
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
  actionButton: {
    marginTop: Spacing.md,
  },
});
