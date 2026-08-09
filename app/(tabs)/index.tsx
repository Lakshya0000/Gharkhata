import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { QuickActionCard } from '../../components/QuickActionCard';
import { MilkEntryCard } from '../../components/MilkEntryCard';
import { EmptyState } from '../../components/ui/EmptyState';
// Note: Assuming useMilk is either a stub or will be created later.
import { useMilk } from '../../hooks/useMilk';

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

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const milkHook = useMilk();
  const [todayEntries, setTodayEntries] = React.useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = React.useState({ totalQuantity: 0, totalAmount: 0 });
  const todayDate = format(new Date(), 'dd MMMM yyyy');

  React.useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    milkHook.getEntriesForDate(todayStr).then((e: any) => setTodayEntries(e));
    const m = new Date().getMonth();
    const y = new Date().getFullYear();
    milkHook.getEntriesForMonth(y, m + 1).then((e: any) => {
      let q = 0, a = 0;
      e.forEach((entry: any) => { q += entry.quantity; a += entry.amount; });
      setMonthlyStats({ totalQuantity: q, totalAmount: a });
    });
  }, [milkHook.lastUpdated]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{t('greeting', 'Namaste!')}</Text>
      </View>

      <View style={styles.quickActions}>
        <QuickActionCard 
          label={t('addMilk', 'Add Milk')}
          icon="cow"
          color={Colors.milk}
          backgroundColor="#FEF3C7"
          onPress={() => router.push('/milk/add')}
        />
        <QuickActionCard 
          label={t('addKharcha', 'Add Kharcha')}
          icon="wallet"
          color={Colors.expense}
          backgroundColor="#D1FAE5"
          onPress={() => router.push('/expense/add')}
        />
        <QuickActionCard 
          label={t('addUdhaari', 'Add Udhaari')}
          icon="account-cash"
          color={Colors.primary}
          backgroundColor="#DBEAFE"
          onPress={() => router.push('/udhaari/add')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('todaysMilk', 'Today')} ({todayDate})</Text>
        {todayEntries.length > 0 ? (
          todayEntries.map((entry: any) => (
            <MilkEntryCard key={entry.id} entry={entry} onPress={() => router.push(`/milk/${entry.id}` as any)} />
          ))
        ) : (
          <EmptyState title={t('noData', 'No Data')} subtitle={t('noMilkToday', 'No milk entries for today')} icon="cow" />
        )}
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'PoppinsBold',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  date: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: Colors.textPrimary,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: Colors.textPrimary,
    opacity: 0.7,
  },
  statValue: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginTop: 4,
  },
});
