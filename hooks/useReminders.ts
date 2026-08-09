import { create } from 'zustand';
import { db } from '../db/database';
import * as remindersQueries from '../db/queries/reminders';
import { scheduleReminder, cancelReminder } from '../lib/notifications';
import { Reminder } from '../lib/types';

interface RemindersState {
  lastUpdated: number;
  triggerUpdate: () => void;
}

const useRemindersStore = create<RemindersState>((set) => ({
  lastUpdated: Date.now(),
  triggerUpdate: () => set({ lastUpdated: Date.now() }),
}));

export const useReminders = () => {
  const { lastUpdated, triggerUpdate } = useRemindersStore();

  const addReminder = async (title: string, hour: number, minute: number) => {
    // 1. Insert into DB (is_active is 1 by default in the query)
    const newReminderList = await remindersQueries.addReminder(db, title, hour, minute);
    const newReminder = newReminderList[0];

    // 2. Schedule local notification
    const notificationId = await scheduleReminder(hour, minute, title);

    // 3. Update DB with notification ID
    await remindersQueries.updateReminderNotificationId(db, newReminder.id, notificationId);

    triggerUpdate();
    return newReminder;
  };

  const toggleReminder = async (id: number, isActive: boolean, title?: string, hour?: number, minute?: number) => {
    // We need title, hour, minute to reschedule if it's becoming active.
    // If they aren't provided, we fetch from DB.
    let reminderTitle = title;
    let reminderHour = hour;
    let reminderMinute = minute;

    if (isActive && (reminderTitle === undefined || reminderHour === undefined || reminderMinute === undefined)) {
      const all = await getReminders();
      const r = all.find(x => x.id === id);
      if (r) {
        reminderTitle = r.title;
        reminderHour = r.hour;
        reminderMinute = r.minute;
      }
    }

    if (isActive && reminderTitle !== undefined && reminderHour !== undefined && reminderMinute !== undefined) {
      // Schedule notification
      const notificationId = await scheduleReminder(reminderHour, reminderMinute, reminderTitle);
      await remindersQueries.toggleReminder(db, id, 1, notificationId);
    } else {
      // Deactivate and cancel
      const all = await getReminders();
      const r = all.find(x => x.id === id);
      if (r && r.notification_id) {
        await cancelReminder(r.notification_id);
      }
      await remindersQueries.toggleReminder(db, id, 0, null as any); // notification_id becomes null maybe, wait db/queries/reminders expects string for notificationId but we can just pass undefined if we don't want to update it. Wait, the query says if notificationId !== undefined, it updates it. So we need a way to nullify it.
      // Wait, toggleReminder takes notificationId?: string. If we pass empty string, it will update to ''. Let's pass ''.
      // Actually we should see `updateReminderNotificationId`
      await remindersQueries.updateReminderNotificationId(db, id, null);
      await remindersQueries.toggleReminder(db, id, 0);
    }

    triggerUpdate();
  };

  const deleteReminder = async (id: number) => {
    const all = await getReminders();
    const r = all.find(x => x.id === id);
    if (r && r.notification_id) {
      await cancelReminder(r.notification_id);
    }
    
    await remindersQueries.deleteReminder(db, id);
    triggerUpdate();
  };

  const getReminders = async () => {
    return await remindersQueries.getReminders(db);
  };

  return {
    lastUpdated,
    addReminder,
    toggleReminder,
    deleteReminder,
    getReminders,
  };
};
