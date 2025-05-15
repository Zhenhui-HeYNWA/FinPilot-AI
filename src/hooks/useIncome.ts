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

type MonthlyIncome = {
  month: string;
  total: number;
};
type IncomeHistoryResult = {
  raw: IncomeRecord[];
  monthly: MonthlyIncome[];
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
function processIncomeData(data: IncomeRecord[]): MonthlyIncome[] {
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
export function useGetIncomeHistory({ range }: rangeProps) {
  return useQuery<IncomeHistoryResult>({
    queryKey: ['incomeByRange', range],
    queryFn: async () => {
      const res = await fetch(`/api/income/incomeHistory?range=${range}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const rawData: IncomeRecord[] = json.data;
      const monthly = processIncomeData(rawData);
      return { raw: rawData, monthly };
    },
  });
}
