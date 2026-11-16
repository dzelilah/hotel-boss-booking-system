import { addDays, differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';
import { bs } from 'date-fns/locale';

/**
 * "80 €", "1.280 €", "80,50 €". Formatted by hand because browsers ship incomplete bs-BA locale
 * data (Chrome falls back to "€ 80.00"), and server and client output must match for hydration.
 */
export function formatPrice(amount: number): string {
  const cents = Math.round(amount * 100);
  const whole = Math.trunc(Math.abs(cents) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const fraction = Math.abs(cents) % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}${whole}${fraction ? `,${fraction.toString().padStart(2, '0')}` : ''} €`;
}

/**
 * API dates are plain "yyyy-MM-dd". parseISO reads them as local dates; `new Date(str)` would
 * read them as UTC midnight and show the previous day for anyone west of UTC.
 */
export function formatDate(isoDate: string, pattern = 'd. MMM yyyy.'): string {
  return format(parseISO(isoDate), pattern, { locale: bs });
}

/** Today's date as "yyyy-MM-dd" in the visitor's local time. */
export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function addDaysIso(isoDate: string, days: number): string {
  return format(addDays(parseISO(isoDate), days), 'yyyy-MM-dd');
}

export function isIsoDate(value: string | null | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value));
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
}

/** Bosnian plural form: one (1, 21, ...), few (2-4, 22-24, ...) or many (5-20, 25-30, ...). */
export function pluralForm(n: number): 'one' | 'few' | 'many' {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'one';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
  return 'many';
}

/** "1 slobodna soba", "3 slobodne sobe", "5 slobodnih soba" */
export function freeRoomsLabel(n: number): string {
  return { one: `${n} slobodna soba`, few: `${n} slobodne sobe`, many: `${n} slobodnih soba` }[pluralForm(n)];
}

/** "1 noć", "2 noći", "5 noći" */
export function nightsLabel(n: number): string {
  return n === 1 ? '1 noć' : `${n} noći`;
}

/** "1 gost", "2 gosta", "5 gostiju" */
export function guestsLabel(n: number): string {
  if (n === 1) return '1 gost';
  if (n >= 2 && n <= 4) return `${n} gosta`;
  return `${n} gostiju`;
}

/** Pulls the backend's human-readable error message out of an axios error. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return message || fallback;
}
