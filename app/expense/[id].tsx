import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../../hooks/useExpenses';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Shadow } from '../../lib/theme';
import { db } from '../../db/database';
import { eq } from 'drizzle-orm';
import { expenses } from '../../db/schema';

export default function EditExpenseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateExpense, deleteExpense } = useExpenses();
  const expenseId = parseInt(params.id as string, 10);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const result = await db.select().from(expenses).where(eq(expenses.id, expenseId));
        if (result.length > 0) {
          const exp = result[0];
          setTitle(exp.title);
          setAmount(exp.amount.toString());
          setDate(exp.date);
          setNote(exp.note || '');
        }
      } catch (e) {
        Alert.alert(t('error', 'Error'), t('load_failed', 'Failed to load expense'));
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (expenseId) fetchExpense();
  }, [expenseId]);

  const handleSave = async () => {
    if (!title.trim() || !amount.trim() || !date.trim()) {
      Alert.alert(t('error', 'Error'), t('fill_required_fields', 'Please fill in title, amount, and date'));
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(t('error', 'Error'), t('invalid_amount', 'Please enter a valid amount'));
      return;
    }

    try {
      await updateExpense(expenseId, {
        title: title.trim(),
        amount: numAmount,
        date: date.trim(),
        note: note.trim() || undefined
      });
      router.back();
    } catch (e) {
      Alert.alert(t('error', 'Error'), t('save_failed', 'Failed to update expense'));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('delete_expense', 'Delete Expense'),
      t('delete_expense_confirm', 'Are you sure you want to delete this expense?'),
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('delete', 'Delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              router.back();
            } catch (e) {
              Alert.alert(t('error', 'Error'), t('delete_failed', 'Failed to delete expense'));
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.expense} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('edit_expense', 'Edit Expense')}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.backBtn}>
            <Ionicons name="trash-outline" size={28} color={Colors.danger} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('title', 'Title')} *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('amount', 'Amount')} *</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('date', 'Date')} *</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('note', 'Note')} ({t('optional', 'Optional')})</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{t('save_changes', 'Save Changes')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    ...Shadow.card,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.expense,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
});
