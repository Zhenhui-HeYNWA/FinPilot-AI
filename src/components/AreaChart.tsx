'use client';

import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  CartesianGrid,
  YAxis,
} from 'recharts';
import { useState, useMemo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetIncomeHistory } from '@/hooks/useIncome';
import { useGetExpenseHistory } from '@/hooks/useExpense';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

// 假设未来还有这些 Hook
// import { useGetBalanceHistory } from '@/hooks/balance/use-get-balance-history';
// import { useGetSavingsHistory } from '@/hooks/savings/use-get-savings-history';

type ChartType = 'income' | 'expense' | 'balance' | 'savings';
type RangeType = 'week' | 'month' | 'year' | '6months';
const chartConfigMap = {
  income: {
    label: 'Income',
    color: '#2aae19',
  },
  expense: {
    label: 'Expense',
    color: '#ae1919',
  },
  balance: {
    label: 'Balance',
    color: '#1981ae',
  },
  savings: {
    label: 'Savings',
    color: '#b89b0a',
  },
};
export type ChartConfig = {
  label: string;
  color: string;
};

interface AreaChartComponentProps {
  type: ChartType;
}

export function AreaChartComponent({ type }: AreaChartComponentProps) {
  const [range, setRange] = useState<RangeType>('6months');

  // 所有可能的 Hook 都必须无条件执行
  const incomeQuery = useGetIncomeHistory({ range });
  const expenseQuery = useGetExpenseHistory({ range });
  const balanceData = useMemo(() => {
    if (type !== 'balance') return [];

    const incomeData = incomeQuery.data?.range ?? [];

    const expenseData = expenseQuery.data?.range ?? [];

    return incomeData.map((item) => {
      const expense = expenseData.find((e) => e.range === item.range);
      return {
        range: item.range,
        total: Number(item.total - (expense?.total || 0)).toFixed(2),
      };
    });
  }, [incomeQuery.data, expenseQuery.data, type]);

  let selectedQuery;
  switch (type) {
    case 'income':
      selectedQuery = incomeQuery;
      break;
    case 'expense':
      selectedQuery = expenseQuery;
      break;

    case 'savings':
      selectedQuery = expenseQuery;
      break;
    default:
      selectedQuery = { data: null, isLoading: false, error: null };
  }

  const data = useMemo(() => {
    return type === 'balance'
      ? { range: balanceData }
      : (selectedQuery.data ?? { monthly: [] });
  }, [type, balanceData, selectedQuery.data]);

  const isLoading =
    type === 'balance'
      ? incomeQuery.isLoading || expenseQuery.isLoading
      : selectedQuery.isLoading;
  const chartConfig = chartConfigMap[type];

  const yDomain = useMemo(() => {
    const values = data?.range?.map((d) => Number(d.total)) ?? [];
    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    const padding = (max - min) * 0.19 || 10;

    const minWithPadding = min - padding;
    const maxWithPadding = max + padding;

    return [
      min < 0 ? Math.floor(minWithPadding) : 0,
      Math.ceil(maxWithPadding),
    ];
  }, [data]);
  return (
    <div className='space-y-4'>
      {/* 选择时间范围 */}
      <Select
        value={range}
        onValueChange={(value: RangeType) => setRange(value)}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select range' />
        </SelectTrigger>
        <SelectContent>
          <SelectContent>
            <SelectItem value='week'>Last Week</SelectItem>
            <SelectItem value='month'>Last Month</SelectItem>
            <SelectItem value='6months'>Last 6 Months</SelectItem>
            <SelectItem value='year'>Last Year</SelectItem>
          </SelectContent>
        </SelectContent>
      </Select>

      {/* 图表区域 */}
      {isLoading ? (
        <Skeleton className='w-full' />
      ) : (
        <ChartContainer
          config={chartConfigMap}
          className='mt-4 w-full '>
          <AreaChart
            className='w-full'
            accessibilityLayer
            data={data?.range || []}
            margin={{ left: -30, right: 0 }}
            height={400}>
            <CartesianGrid
              vertical={false}
              strokeDasharray='3 3'
            />
            <XAxis
              dataKey='range'
              tickLine={false}
              axisLine={false}
              stroke='#888888'
              fontSize={12}
            />
            <YAxis
              hide={false} // 显示 Y 轴
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              stroke='#888888'
              fontSize={8}
              tickFormatter={(value) => {
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
                return value.toString();
              }}
            />

            <ChartTooltip
              content={<ChartTooltipContent className=' capitalize' />}
            />

            <Area
              dataKey='total'
              type='natural'
              fill={chartConfig.color}
              fillOpacity={0.4}
              stroke={chartConfig.color}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
