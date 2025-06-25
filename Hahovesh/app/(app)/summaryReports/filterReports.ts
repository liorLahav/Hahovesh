import { toDate } from './format';
import { EventSummary } from '@/services/event_summary';

export type FilterType = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

const DAY_MS = 86_400_000;


export function filterReports(
  reports: EventSummary[],
  filter: FilterType,
  customDate: Date | null,
): EventSummary[] {
  if (filter === 'all') return reports;

  const now = new Date();
  let from = new Date(0);
  let to = now;

  switch (filter) {
    case 'today':
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(from.getTime() + DAY_MS);
      break;
    case 'week':
      from = new Date(now.getTime() - 7 * DAY_MS);
      break;
    case 'month':
      from = new Date(now.getTime() - 30 * DAY_MS);
      break;
    case 'year':
      from = new Date(now.getTime() - 365 * DAY_MS);
      break;
    case 'custom':
      if (!customDate) return [];
      from = new Date(
        customDate.getFullYear(),
        customDate.getMonth(),
        customDate.getDate(),
      );
      to = new Date(from.getTime() + DAY_MS);
      break;
  }

  return reports.filter((r) => {
    const d = toDate((r as any).event_date);
    return d ? d >= from && d < to : false;
  });
}
