import { create } from 'zustand';
import { db } from '../db/database';
import * as settingsQueries from '../db/queries/settings';

interface SettingsState {
  lastUpdated: number;
  triggerUpdate: () => void;
}

const useSettingsStore = create<SettingsState>((set) => ({
  lastUpdated: Date.now(),
  triggerUpdate: () => set({ lastUpdated: Date.now() }),
}));

export const useSettings = () => {
  const { lastUpdated, triggerUpdate } = useSettingsStore();

  const getSetting = async (key: string): Promise<string | null> => {
    return await settingsQueries.getSetting(db, key);
  };

  const setSetting = async (key: string, value: string) => {
    await settingsQueries.setSetting(db, key, value);
    triggerUpdate();
  };
  
  const getLanguage = async (): Promise<string> => {
    return await settingsQueries.getLanguage(db);
  };

  const getDefaultSupplier = async (): Promise<string> => {
    return await settingsQueries.getDefaultSupplier(db);
  };

  const getDefaultMilkRate = async (): Promise<number | null> => {
    return await settingsQueries.getDefaultMilkRate(db);
  };

  const getDefaultQuantity = async (): Promise<number | null> => {
    return await settingsQueries.getDefaultQuantity(db);
  };

  return {
    lastUpdated,
    getSetting,
    setSetting,
    getLanguage,
    getDefaultSupplier,
    getDefaultMilkRate,
    getDefaultQuantity,
  };
};
