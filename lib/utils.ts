import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Formats an amount to Indian Rupee format without commas
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  // Strip decimals if they are zero
  const formatted = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
  // Re-strip trailing zeros if any (e.g. 30.50 -> 30.5)
  return `₹${parseFloat(formatted).toString()}`;
}

/**
 * Formats a date string (ISO) to a readable format
 * @param dateStr - Date string in ISO format
 * @returns Formatted date string (e.g., '1 Aug 2026')
 */
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'd MMM yyyy');
}

/**
 * Formats a date string (ISO) to a short readable format
 * @param dateStr - Date string in ISO format
 * @returns Formatted date string (e.g., '1 Aug')
 */
export function formatDateShort(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'd MMM');
}

/**
 * Gets the month and year string
 * @param year - The year
 * @param month - The month (0-indexed)
 * @returns Formatted month year string (e.g., 'August 2026')
 */
export function getMonthYear(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return format(date, 'MMMM yyyy');
}

/**
 * Gets today's date in ISO format
 * @returns Today's date string (e.g., '2026-08-01')
 */
export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Calculates milk amount and rounds to 2 decimal places
 * @param quantity - The quantity of milk
 * @param rate - The rate per litre
 * @returns Calculated amount
 */
export function calculateMilkAmount(quantity: number, rate: number): number {
  const amount = quantity * rate;
  return Math.round(amount * 100) / 100;
}

/**
 * Formats an hour and minute into a readable time string
 * @param hour - The hour (0-23)
 * @param minute - The minute (0-59)
 * @returns Formatted time string
 */
export function formatTime(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return format(date, 'h:mm a');
}

/**
 * Gets the date range (start and end) for a given month and year
 * @param year - The year
 * @param month - The month (0-indexed)
 * @returns Object with start and end date strings in ISO format
 */
export function getMonthDateRange(year: number, month: number): { start: string; end: string } {
  const date = new Date(year, month, 1);
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
}

/**
 * Generates a CSV string from headers and rows
 * @param headers - Array of header strings
 * @param rows - Array of row arrays (each row is an array of strings)
 * @returns CSV string
 */
export function generateCSV(headers: string[], rows: string[][]): string {
  const escapeCsv = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = headers.map(escapeCsv).join(',');
  const dataRows = rows.map(row => row.map(escapeCsv).join(','));

  return [headerRow, ...dataRows].join('\n');
}
