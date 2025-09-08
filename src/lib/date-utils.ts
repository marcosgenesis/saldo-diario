import { endOfDay, parseISO, startOfDay } from "date-fns";
import { format as formatTz, fromZonedTime, toZonedTime } from "date-fns-tz";

// Timezone padrão - pode ser configurado dinamicamente baseado na localização do usuário
export const DEFAULT_TIMEZONE = "America/Sao_Paulo";

/**
 * Converte uma data local para UTC mantendo o horário local
 * Útil para enviar datas para o servidor
 */
export function toUTC(date: Date, timezone: string = DEFAULT_TIMEZONE): Date {
  return fromZonedTime(date, timezone);
}

/**
 * Converte uma data UTC para o timezone local
 * Útil para exibir datas vindas do servidor
 */
export function fromUTC(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return toZonedTime(dateObj, timezone);
}

/**
 * Cria uma data no início do dia no timezone especificado
 */
export function startOfDayInTimezone(
  date: Date,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const zonedDate = toZonedTime(date, timezone);
  const startOfDayZoned = startOfDay(zonedDate);
  return fromZonedTime(startOfDayZoned, timezone);
}

/**
 * Cria uma data no final do dia no timezone especificado
 */
export function endOfDayInTimezone(
  date: Date,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const zonedDate = toZonedTime(date, timezone);
  const endOfDayZoned = endOfDay(zonedDate);
  return fromZonedTime(endOfDayZoned, timezone);
}

/**
 * Formata uma data para exibição no timezone local
 */
export function formatInTimezone(
  date: Date | string,
  formatStr: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatTz(dateObj, formatStr, { timeZone: timezone });
}

/**
 * Converte uma data para ISO string no timezone correto
 * Útil para enviar para APIs
 */
export function toISOStringInTimezone(
  date: Date,
  timezone: string = DEFAULT_TIMEZONE
): string {
  return toUTC(date, timezone).toISOString();
}

/**
 * Cria uma data a partir de uma string ISO considerando o timezone
 */
export function fromISOStringInTimezone(
  isoString: string,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  return fromUTC(isoString, timezone);
}

/**
 * Obtém o timezone do usuário automaticamente
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/**
 * Cria uma data "limpa" (sem horário) no timezone local
 * Útil para seletores de data
 */
export function createCleanDate(
  year: number,
  month: number,
  day: number,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const localDate = new Date(year, month - 1, day);
  return startOfDayInTimezone(localDate, timezone);
}

/**
 * Verifica se duas datas são do mesmo dia no timezone especificado
 */
export function isSameDayInTimezone(
  date1: Date | string,
  date2: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): boolean {
  const d1 = fromUTC(date1, timezone);
  const d2 = fromUTC(date2, timezone);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
