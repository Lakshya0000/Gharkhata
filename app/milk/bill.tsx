import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { format, startOfMonth, endOfMonth, addDays, parseISO } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BillCard } from '../../components/BillCard';
import { useMilk } from '../../hooks/useMilk';
import { useBills } from '../../hooks/useBills';

const Colors = {
  primary: '#2563EB',
  milk: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
};

export default function GenerateMilkBill() {
  const { t } = useTranslation();
  const router = useRouter();
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const milkHook = useMilk();
  const billsHook = useBills();
  const [stats, setStats] = useState({ totalQuantity: 0, totalAmount: 0 });
  const [recentBills, setRecentBills] = useState<any[]>([]);

  React.useEffect(() => {
    milkHook.getEntriesForRange(startDate, endDate).then(entries => {
      let q = 0, a = 0;
      entries.forEach(e => { q += e.quantity; a += e.amount; });
      setStats({ totalQuantity: q, totalAmount: a });
    });
  }, [startDate, endDate, milkHook.lastUpdated]);

  React.useEffect(() => {
    billsHook.getAllBills().then(b => {
      setRecentBills(b);
      // Auto-set start date to day after last bill if there is a recent bill
      if (b && b.length > 0) {
        // Bills are returned latest first usually. Let's make sure we find the latest end date.
        const latestBill = b.reduce((latest: any, current: any) => {
          return new Date(current.endDate) > new Date(latest.endDate) ? current : latest;
        }, b[0]);
        
        try {
          const nextDay = addDays(parseISO(latestBill.endDate), 1);
          setStartDate(format(nextDay, 'yyyy-MM-dd'));
        } catch (e) {
          console.error('Date parse error', e);
        }
      }
    });
  }, [billsHook.lastUpdated]);

  const handleGenerate = async () => {
    if (stats.totalQuantity === 0) {
      Alert.alert(t('noData', 'No Data'), t('noMilkDataForMonth', 'No milk entries found for this month.'));
      return;
    }

    if (billsHook.generateBill) {
      await billsHook.generateBill(startDate, endDate);
      Alert.alert(t('success', 'Success'), t('billGenerated', 'Bill generated successfully!'));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Input
          label={t('startDate', 'Start Date')}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
        />
        <Input
          label={t('endDate', 'End Date')}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>{t('billPreview', 'Bill Preview')}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('totalMilk', 'Total Milk')}</Text>
            <Text style={styles.statValue}>{stats.totalQuantity} L</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('totalAmount', 'Total Amount')}</Text>
            <Text style={styles.statValue}>₹{stats.totalAmount}</Text>
          </View>
        </View>

        <Button 
          title={t('generateBill', 'Generate Bill')} 
          onPress={handleGenerate} 
          style={styles.generateBtn}
        />
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>{t('recentBills', 'Recent Bills')}</Text>
        {recentBills.length > 0 ? (
          recentBills.map((bill: any) => (
            <BillCard key={bill.id} bill={bill} />
          ))
        ) : (
          <Text style={styles.emptyText}>{t('noRecentBills', 'No recently generated bills.')}</Text>
        )}
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
  section: {
    marginBottom: 24,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  statLabel: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: Colors.textPrimary,
    opacity: 0.7,
  },
  statValue: {
    fontFamily: 'PoppinsBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  generateBtn: {
    backgroundColor: Colors.milk,
  },
  recentSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: Colors.textPrimary,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 20,
  },
});
