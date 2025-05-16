import { useQuery } from '@tanstack/react-query';
import { parseISO, format } from 'date-fns';

interface rangeProps {
  range: 'week' | 'month' | 'year' | '6months';
}
type IncomeRecord = {
  id: string;
  amount: number;
  date: string;
  category: string;
};

type IncomeByRange = {
  range: string;
  total: number;
};
type IncomeHistoryResult = {
  raw: IncomeRecord[];
  range: IncomeByRange[];
};
export function useGetIncome() {
  return useQuery({
    queryKey: ['income'],
    queryFn: async () => {
      const res = await fetch('/api/income/total');
      const income = await res.json();
      return income;
    },
  });
}
function processIncomeData(
  data: IncomeRecord[],
  range: rangeProps['range']
): IncomeByRange[] {
  const grouped = new Map<string, number>();

  data.forEach((item) => {
    const dateObj = parseISO(item.date);

    // ✅ 按不同粒度格式化
    const key =
      range === 'week'
        ? format(dateObj, 'yyyy-MM-dd') // 每天一个 key
        : format(dateObj, 'yyyy-MM'); // 每月一个 key

    grouped.set(key, (grouped.get(key) || 0) + item.amount);
  });

  const sortedEntries = Array.from(grouped.entries()).sort(([a], [b]) =>
    a > b ? 1 : a < b ? -1 : 0
  );

  return sortedEntries.map(([dateKey, total]) => {
    const dateObj = parseISO(dateKey + (range === 'week' ? '' : '-01'));
    return {
      // 👇 使用 'EEE' + 全大写
      range:
        range === 'week'
          ? format(dateObj, 'EEE').toUpperCase()
          : format(dateObj, 'MMM'),
      total: Number(total.toFixed(2)),
    };
  });
}
export function useGetIncomeHistory({ range }: rangeProps) {
  return useQuery<IncomeHistoryResult>({
    queryKey: ['incomeByRange', range],
    queryFn: async () => {
      const res = await fetch(`/api/income/incomeHistory?range=${range}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const rawData: IncomeRecord[] = json.data;
      const rangeDetail = processIncomeData(rawData, range);
      return { raw: rawData, range: rangeDetail };
    },
  });
}
