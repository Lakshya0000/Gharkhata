import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontFamily } from '../lib/theme';
import { Card } from './ui/Card';
import { Reminder } from '../lib/types';
import { format } from 'date-fns';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (isActive: boolean) => void;
  onDelete?: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = React.memo(({ reminder, onToggle, onDelete }) => {
  // Format the time HH:mm to localized AM/PM if desired, or just show it directly
  const date = new Date();
  date.setHours(reminder.hour);
  date.setMinutes(reminder.minute);
  
  const formattedTime = format(date, 'h:mm a');

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="bell" 
            size={24} 
            color={reminder.isActive ? Colors.primary : Colors.textSecondary} 
          />
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.time, !reminder.isActive && styles.inactiveText]}>
            {formattedTime}
          </Text>
          <Text style={[styles.title, !reminder.isActive && styles.inactiveText]}>
            {reminder.title}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <Switch
            value={reminder.isActive}
            onValueChange={onToggle}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
          {onDelete && (
            <MaterialCommunityIcons 
              name="delete-outline" 
              size={24} 
              color={Colors.danger}
              onPress={onDelete}
              style={styles.deleteIcon}
            />
          )}
        </View>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  time: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  inactiveText: {
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  }
});
