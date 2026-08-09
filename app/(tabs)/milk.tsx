import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { FAB } from '../../components/ui/FAB';
import { MilkEntryCard } from '../../components/MilkEntryCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useMilk } from '../../hooks/useMilk';

const Colors = {
  primary: '#2563EB',
  milk: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B'
};

export default function MilkTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const milkHook = useMilk();
  const [entriesForMonth, setEntriesForMonth] = React.useState<any[]>([]);
  const [entriesForSelectedDate, setEntriesForSelectedDate] = React.useState<any[]>([]);

  React.useEffect(() => {
    const y = parseInt(selectedDate.split('-')[0]);
    const m = parseInt(selectedDate.split('-')[1]);
    milkHook.getEntriesForMonth(y, m).then(e => {
      setEntriesForMonth(e);
      setEntriesForSelectedDate(e.filter((entry: any) => entry.date === selectedDate));
    });
  }, [selectedDate, milkHook.lastUpdated]);

  const markedDates = entriesForMonth.reduce((acc: any, entry: any) => {
    acc[entry.date] = { marked: true, dotColor: Colors.milk };
    return acc;
  }, {});

  markedDates[selectedDate] = { 
    ...markedDates[selectedDate], 
    selected: true, 
    selectedColor: Colors.primary 
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Button 
              title={t('generateBill', 'Bill')} 
              onPress={() => router.push('/milk/bill')} 
              variant="outline" 
            />
          ),
        }} 
      />
      <ScrollView>
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
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
            dotColor: Colors.milk,
            selectedDotColor: Colors.surface,
            arrowColor: Colors.primary,
            monthTextColor: Colors.textPrimary,
            indicatorColor: Colors.primary,
            textDayFontFamily: 'Poppins',
            textMonthFontFamily: 'PoppinsSemiBold',
            textDayHeaderFontFamily: 'Poppins',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>
            {format(new Date(selectedDate), 'dd MMM yyyy')}
          </Text>
          {entriesForSelectedDate.length > 0 ? (
            entriesForSelectedDate.map((entry: any) => (
              <MilkEntryCard 
                key={entry.id} 
                entry={entry} 
                onPress={() => router.push(`/milk/${entry.id}`)} 
              />
            ))
          ) : (
            <EmptyState title={t('noData', 'No Data')} subtitle={t('noMilkEntries', 'No entries for this date')} icon="cow" />
          )}
        </View>
      </ScrollView>
      
      <FAB 
        icon="plus" 
        onPress={() => router.push({ pathname: '/milk/add', params: { date: selectedDate } })} 
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
  entriesSection: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
});
