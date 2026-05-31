import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  companyName: 'settings:company_name',
  companyLogo: 'settings:company_logo',
};

export interface AppSettings {
  companyName: string;
  companyLogo: string | null;
}

export const settingsService = {
  load: async (): Promise<AppSettings> => {
    const [companyName, companyLogo] = await Promise.all([
      AsyncStorage.getItem(KEYS.companyName),
      AsyncStorage.getItem(KEYS.companyLogo),
    ]);
    return {
      companyName: companyName ?? '',
      companyLogo: companyLogo ?? null,
    };
  },

  save: async (settings: AppSettings): Promise<void> => {
    await Promise.all([
      AsyncStorage.setItem(KEYS.companyName, settings.companyName),
      settings.companyLogo
        ? AsyncStorage.setItem(KEYS.companyLogo, settings.companyLogo)
        : AsyncStorage.removeItem(KEYS.companyLogo),
    ]);
  },
};