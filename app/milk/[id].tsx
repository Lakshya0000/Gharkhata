import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { useMilk } from '../../hooks/useMilk';

const Colors = {
  primary: '#2563EB',
  milk: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  error: '#EF4444',
};

export default function EditMilkEntry() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const milkHook = useMilk();
  const [entry, setEntry] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    milkHook.getEntryById(Number(id)).then(e => {
      if (e) {
        setEntry(e);
        setDate(e.date);
        setQuantity(e.quantity);
        setRate(e.ratePerLitre);
      }
    });
  }, [id]);

  const amount = rate * quantity;

  const handleSave = async () => {
    if (milkHook.updateMilk) {
      await milkHook.updateMilk(Number(id), {
        date,
        quantity,
        ratePerLitre: rate,
        amount
      });
    }
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      t('deleteConfirmTitle', 'Delete Entry'),
      t('deleteConfirmMessage', 'Are you sure you want to delete this milk entry?'),
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('delete', 'Delete'), 
          style: 'destructive',
          onPress: async () => {
            if (milkHook.deleteMilk) {
              await milkHook.deleteMilk(Number(id));
            }
            router.back();
          }
        }
      ]
    );
  };

  if (!entry) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{t('entryNotFound', 'Entry not found')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <Input 
          label={t('date', 'Date')} 
          value={date} 
          onChangeText={setDate} 
          placeholder="YYYY-MM-DD"
        />
        
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>{t('quantity', 'Quantity (Litre)')}</Text>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.rateText}>{t('rateLabel', 'Rate:')} ₹{rate}/L</Text>
          <Text style={styles.amountText}>{t('totalAmount', 'Total:')} ₹{amount}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button 
            title={t('save', 'Save')} 
            onPress={handleSave} 
            style={styles.saveButton}
          />
          <Button 
            title={t('delete', 'Delete')} 
            onPress={handleDelete} 
            variant="outline"
            style={styles.deleteButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 16,
    color: Colors.error,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  summaryContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  rateText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: Colors.textPrimary,
    opacity: 0.7,
  },
  amountText: {
    fontFamily: 'PoppinsBold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  saveButton: {
  },
  deleteButton: {
    borderColor: Colors.error,
  },
});
