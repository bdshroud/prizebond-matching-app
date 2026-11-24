import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale = 'bn-BD'): string {
  const num = Number(amount) || 0;
  if (locale === 'bn-BD') {
    const formatted = num.toLocaleString('bn-BD');
    return `৳${formatted}`;
  }
  return `৳${num.toLocaleString('en-US')}`;
}

export function formatBnDigits(number: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(number).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

export function formatDate(dateString?: string | Date | null, locale = 'bn-BD'): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString(locale === 'bn-BD' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
