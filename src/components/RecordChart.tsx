'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Line,
  LineChart,
  YAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetIncome, useGetIncomeHistory } from '@/hooks/useIncome';
import { useGetExpense, useGetExpenseHistory } from '@/hooks/useExpense';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
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
    color: '#4119ae',
  },
} satisfies ChartConfig;

const RecordChart = () => {
  const { data: incomeQuery, isLoading: isIncomeLoading } = useGetIncomeHistory(
    {
      range: '6months',
    }
  );
  const { data: expenseQuery, isLoading: isExpenseLoading } =
    useGetExpenseHistory({ range: '6months' });

  console.log('income', incomeQuery, 'expense', expenseQuery);

  const rowData = incomeQuery?.range.map((item) => {
    const matchingExpense = expenseQuery?.range.find(
      (e) => e.range === item.range
    );

    return {
      month: item.range,
      income: item.total,
      expense: matchingExpense ? matchingExpense.total : 0,
    };
  });

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {isIncomeLoading || isExpenseLoading ? (
          <div className='flex flex-col  gap-4'>
            <Skeleton className='h-9 w-44' />
            <Skeleton className='h-96 w-full' />
          </div>
        ) : (
          <Tabs defaultValue='BarChart'>
            <TabsList>
              <TabsTrigger value='BarChart'>Bar-Chart</TabsTrigger>
              <TabsTrigger value='Line-Chart'>Line-Chart</TabsTrigger>
            </TabsList>
            <TabsContent value='BarChart'>
              <ChartContainer
                config={chartConfig}
                className='min-h-[200px] w-full'>
                <BarChart
                  accessibilityLayer
                  data={rowData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    domain={[0, 'dataMax + 100']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      if (value > 1000) {
                        return `${(value / 1000).toFixed(1)}k`;
                      }
                      return value;
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />

                  <Bar
                    dataKey='income'
                    fill='#2aae19'
                    radius={4}></Bar>
                  <Bar
                    dataKey='expense'
                    fill='#ae1919'
                    radius={4}></Bar>
                </BarChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value='Line-Chart'>
              <ChartContainer
                config={chartConfig}
                className='min-h-[200px] w-full'>
                <LineChart
                  accessibilityLayer
                  data={rowData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    domain={[0, 'dataMax + 100']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      if (value > 1000) {
                        return `${(value / 1000).toFixed(1)}k`;
                      }
                      return value;
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator='line' />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    dataKey='income'
                    type='natural'
                    stroke='#2aae19'
                    strokeWidth={2}
                    dot={{
                      fill: '#2aae19',
                    }}
                    activeDot={{
                      r: 6,
                    }}></Line>

                  <Line
                    dataKey='expense'
                    type='natural'
                    stroke='#ae1919'
                    strokeWidth={2}
                    dot={{
                      fill: '#ae1919',
                    }}
                    activeDot={{
                      r: 6,
                    }}></Line>
                </LineChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordChart;
