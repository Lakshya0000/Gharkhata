import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useUdhaari } from '../../hooks/useUdhaari';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Shadow } from '../../lib/theme';
import { UdhaariEntry } from '../../lib/types';
import { formatDate, formatCurrency } from '../../lib/utils';
import { FAB } from '../../components/ui/FAB';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';

export default function UdhaariScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getAll, getSummary, lastUpdated } = useUdhaari();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [allEntries, setAllEntries] = useState<UdhaariEntry[]>([]);
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<UdhaariEntry[]>([]);
  const [summary, setSummary] = useState({ totalGiven: 0, totalTaken: 0, netAmount: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [entries, sum] = await Promise.all([getAll(), getSummary()]);
      setAllEntries(entries);
      setSummary(sum);
      setEntriesForSelectedDate(entries.filter((entry) => entry.date === selectedDate));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, lastUpdated]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const markedDates = allEntries.reduce((acc: any, entry: UdhaariEntry) => {
    const color = entry.type === 'given' ? Colors.udhaariGiven : Colors.udhaariTaken;
    if (!acc[entry.date]) {
      acc[entry.date] = { marked: true, dotColor: color };
    }
    // If there are multiple entries on the same day, we just use the color of the first one for simplicity,
    // or we could use multi-dot if we wanted to get fancy. Single dot is fine.
    return acc;
  }, {});

  markedDates[selectedDate] = { 
    ...markedDates[selectedDate], 
    selected: true, 
    selectedColor: Colors.primary 
  };

  const renderEntry = (item: UdhaariEntry) => (
    <Card 
      key={item.id}
      variant={item.type === 'given' ? 'udhaariGiven' : 'udhaariTaken'} 
      style={styles.card}
      onPress={() => router.push(`/udhaari/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.personName}>{item.personName}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <Text style={[styles.amount, { color: item.type === 'given' ? Colors.udhaariGiven : Colors.udhaariTaken }]}>
          {item.type === 'given' ? '-' : '+'}{formatCurrency(item.amount)}
        </Text>
      </View>
      {item.reason ? <Text style={styles.reason}>{item.reason}</Text> : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>{t('udhaari.given', 'Given')}</Text>
            <Text style={[styles.summaryAmount, { color: Colors.udhaariGiven }]}>{formatCurrency(summary.totalGiven)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>{t('udhaari.taken', 'Taken')}</Text>
            <Text style={[styles.summaryAmount, { color: Colors.udhaariTaken }]}>{formatCurrency(summary.totalTaken)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>{t('udhaari.net', 'Net')}</Text>
            <Text style={[styles.summaryAmount, { color: summary.netAmount >= 0 ? Colors.success : Colors.danger }]}>
              {formatCurrency(Math.abs(summary.netAmount))}
            </Text>
          </View>
        </View>

        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          onMonthChange={(month: any) => setSelectedDate(month.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: Colors.surface,
            calendarBackground: Colors.surface,
            textSectionTitleColor: Colors.textPrimary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.surface,
            todayTextColor: Colors.primary,
            dayTextColor: Colors.textPrimary,
            textDisabledColor: '#d9e1e8',
            dotColor: Colors.primary,
            selectedDotColor: Colors.surface,
            arrowColor: Colors.primary,
            monthTextColor: Colors.textPrimary,
            indicatorColor: Colors.primary,
            textDayFontFamily: FontFamily.regular,
            textMonthFontFamily: FontFamily.semiBold,
            textDayHeaderFontFamily: FontFamily.regular,
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>
            {format(new Date(selectedDate), 'dd MMM yyyy')}
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
          ) : entriesForSelectedDate.length > 0 ? (
            entriesForSelectedDate.map(renderEntry)
          ) : (
            <EmptyState 
              title={t('udhaari.emptyTitle', 'No Udhaari')} 
              subtitle={t('udhaari.emptyMessage', 'Tap the + button to add a record.')} 
              icon="account-cash" 
            />
          )}
        </View>
      </ScrollView>

      <FAB 
        icon="plus" 
        onPress={() => router.push({ pathname: '/udhaari/add', params: { date: selectedDate } })} 
        color={Colors.primary} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    elevation: 2,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  entriesSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.massive * 2,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  loader: {
    marginTop: Spacing.xxxl,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  date: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  reason: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
