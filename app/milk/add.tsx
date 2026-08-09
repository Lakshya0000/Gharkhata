import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { useMilk } from '../../hooks/useMilk';
import { useSettings } from '../../hooks/useSettings';

const Colors = {
  primary: '#2563EB',
  milk: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  error: '#EF4444',
};

export default function AddMilkEntry() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [date, setDate] = useState(params.date as string || new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<'Morning'|'Evening'>('Morning');
  const [quantity, setQuantity] = useState(1);
  
  const milkHook = useMilk();
  const { getSetting } = useSettings();
  
  const [rate, setRate] = useState<number>(0);
  const [supplier, setSupplier] = useState<string>('');
  
  useEffect(() => {
    getSetting('defaultMilkRate').then(r => setRate(Number(r) || 0));
    getSetting('defaultSupplier').then(s => setSupplier(s || ''));
  }, []);
  
  const amount = rate * quantity;

  const handleSave = async () => {
    if (!rate) return;
    
    if (milkHook.addMilk) {
      await milkHook.addMilk({
        date,
        shift,
        quantity,
        ratePerLitre: rate,
        supplierName: supplier,
        amount
      });
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        <Input 
          label={t('date', 'Date')} 
          value={date} 
          onChangeText={setDate} 
          placeholder="YYYY-MM-DD"
        />
        
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>{t('shift', 'Shift')}</Text>
          <View style={styles.chipRow}>
            <Button 
              title={t('morning', 'Morning')} 
              variant={shift === 'Morning' ? 'primary' : 'outline'}
              onPress={() => setShift('Morning')}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button 
              title={t('evening', 'Evening')} 
              variant={shift === 'Evening' ? 'primary' : 'outline'}
              onPress={() => setShift('Evening')}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
        
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>{t('quantity', 'Quantity (Litre)')}</Text>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </View>

        <Input 
          label={`${t('rateLabel', 'Rate')} (₹/L)`}
          value={rate ? rate.toString() : ''}
          onChangeText={(text) => setRate(parseFloat(text) || 0)}
          keyboardType="numeric"
          placeholder="e.g. 37.25"
        />

        {!rate ? (
          <Text style={styles.warningText}>{t('setRateFirst', 'Please set milk rate in settings first')}</Text>
        ) : (
          <View style={styles.summaryContainer}>
            <Text style={styles.amountText}>{t('totalAmount', 'Total:')} ₹{amount}</Text>
          </View>
        )}

        <Button 
          title={t('save', 'Save')} 
          onPress={handleSave} 
          disabled={!rate} 
          style={styles.saveButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
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
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  warningText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: Colors.error,
    marginBottom: 16,
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
  saveButton: {
    marginTop: 8,
  },
});
