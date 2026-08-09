import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  primaryDark: '#1D4ED8',
  
  milk: '#F59E0B',
  milkLight: '#FEF3C7',
  milkDark: '#D97706',
  
  expense: '#10B981',
  expenseLight: '#D1FAE5',
  expenseDark: '#059669',
  
  udhaariGiven: '#EF4444',
  udhaariGivenLight: '#FEE2E2',
  udhaariTaken: '#8B5CF6',
  udhaariTakenLight: '#EDE9FE',
  
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#16A34A',
  successLight: '#DCFCE7',
  
  border: '#E2E8F0',
  divider: '#F1F5F9',
  
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
};

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40, massive: 48 };

export const FontSize = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, amount: 28 };

export const FontFamily = { regular: 'Poppins', medium: 'PoppinsMedium', semiBold: 'PoppinsSemiBold', bold: 'PoppinsBold' };

export const BorderRadius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };

export const Shadow = {
  sm: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  md: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  lg: { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65 },
  card: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  raised: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  }
};

export const IconSize = { sm: 20, md: 24, lg: 28, xl: 32 };

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPrimary: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  textSecondary: {
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
});
