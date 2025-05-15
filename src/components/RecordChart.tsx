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
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const rowData = [
  { month: 'January', income: 186, expense: 380 },
  { month: 'February', income: 305, expense: 200 },
  { month: 'March', income: 237, expense: 120 },
  { month: 'April', income: 573, expense: 190 },
  { month: 'May', income: 209, expense: 130 },
  { month: 'June', income: 214, expense: 140 },
];
const chartData = rowData.map((item) => ({
  ...item,
  balance: item.income - item.expense,
}));

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
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
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
                data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey='expense'
                  fill='#1dc355'
                  radius={4}>
                  <LabelList
                    position='top'
                    offset={12}
                    className='fill-foreground'
                    fontSize={12}
                  />
                </Bar>
                <Bar
                  dataKey='income'
                  fill='#e82741'
                  radius={4}>
                  <LabelList
                    position='top'
                    offset={12}
                    className='fill-foreground'
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value='Line-Chart'>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator='line' />}
                />
                <Line
                  dataKey='income'
                  type='natural'
                  stroke='#1dc355'
                  strokeWidth={2}
                  dot={{
                    fill: '#1dc355',
                  }}
                  activeDot={{
                    r: 6,
                  }}>
                  <LabelList
                    position='top'
                    offset={12}
                    fontSize={12}
                  />
                </Line>

                <Line
                  dataKey='expense'
                  type='natural'
                  stroke='#e82741'
                  strokeWidth={2}
                  dot={{
                    fill: '#e82741',
                  }}
                  activeDot={{
                    r: 6,
                  }}>
                  <LabelList
                    position='top'
                    offset={12}
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default RecordChart;
