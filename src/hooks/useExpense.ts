import { useQuery } from '@tanstack/react-query';
import { parseISO, format } from 'date-fns';

interface rangeProps {
  range: 'week' | 'month' | 'year' | '6months';
}
type ExpenseRecord = {
  id: string;
  amount: number;
  date: string;
  category: string;
};

type ExpenseByRange = {
  range: string;
  total: number;
};
type ExpenseHistoryResult = {
  raw: ExpenseRecord[];
  range: ExpenseByRange[];
};

function processExpenseData(
  data: ExpenseRecord[],
  range: rangeProps['range']
): ExpenseByRange[] {
  // 用一个 Map 存储按 'yyyy-MM' 格式分组的收入总和
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

  // 按 'yyyy-MM' 进行升序排序
  const sortedEntries = Array.from(grouped.entries()).sort(([a], [b]) =>
    a > b ? 1 : a < b ? -1 : 0
  );

  // 返回只包含 MMM 和 total 的数组
  return sortedEntries.map(([dateKey, total]) => {
    const dateObj = parseISO(dateKey + (range === 'week' ? '' : '-01'));
    return {
      range:
        range === 'week'
          ? format(dateObj, 'EEE').toUpperCase()
          : format(dateObj, 'MMM'),
      total: Number(total.toFixed(2)),
    };
  });
}
export function useGetExpense() {
  return useQuery({
    queryKey: ['expense'],
    queryFn: async () => {
      const res = await fetch('/api/expense/total');
      const data = await res.json();
      return data;
    },
  });
}

export function useGetExpenseHistory({ range }: rangeProps) {
  return useQuery<ExpenseHistoryResult>({
    queryKey: ['expenseByRange', range],
    queryFn: async () => {
      const res = await fetch(`/api/expense/expenseHistory?range=${range}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const rawData: ExpenseRecord[] = json.data;
      const rangeDetail = processExpenseData(rawData, range);
      return { raw: rawData, range: rangeDetail };
    },
  });
}
