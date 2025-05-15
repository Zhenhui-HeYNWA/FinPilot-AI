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

type MonthlyExpense = {
  month: string;
  total: number;
};
type ExpenseHistoryResult = {
  raw: ExpenseRecord[];
  monthly: MonthlyExpense[];
};

function processExpenseData(data: ExpenseRecord[]): MonthlyExpense[] {
  // 用一个 Map 存储按 'yyyy-MM' 格式分组的收入总和
  const grouped = new Map<string, number>();

  data.forEach((item) => {
    const dateObj = parseISO(item.date);
    const yearMonth = format(dateObj, 'yyyy-MM'); // 用于排序的key
    grouped.set(yearMonth, (grouped.get(yearMonth) || 0) + item.amount);
  });

  // 按 'yyyy-MM' 进行升序排序
  const sortedEntries = Array.from(grouped.entries()).sort(([a], [b]) =>
    a > b ? 1 : a < b ? -1 : 0
  );

  // 返回只包含 MMM 和 total 的数组
  return sortedEntries.map(([yearMonth, total]) => {
    const dateObj = parseISO(yearMonth + '-01'); // 构造一个日期对象方便格式化
    return {
      month: format(dateObj, 'MMM'), // 只显示月份缩写
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
      const monthly = processExpenseData(rawData);
      return { raw: rawData, monthly };
    },
  });
}
