// Date formatting utilities for Vietnamese locale (dd/mm/yyyy)

/**
 * Format date to dd/mm/yyyy
 */
export function formatDateVN(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format datetime to dd/mm/yyyy HH:MM:SS
 */
export function formatDateTimeVN(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDateVN(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

/**
 * Convert dd/mm/yyyy to ISO date string (yyyy-mm-dd) for input[type=date]
 */
export function toISODate(vnDate: string): string {
  const [day, month, year] = vnDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Convert ISO date string to dd/mm/yyyy for display
 */
export function fromISODate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Format datetime from ISO to dd/mm/yyyy HH:MM
 */
export function formatShortDateTimeVN(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  const dateStr = formatDateVN(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}
