'use client';

import { CardFooter } from '@/components/ui/card';

import { useState } from 'react';
import {
  LineChart,
  Line,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from 'recharts';
import { ArrowRight, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

const monthlyData = [
  {
    month: 'Jan',
    food: 1200,
    shopping: 800,
    entertainment: 600,
    transportation: 500,
    utilities: 400,
  },
  {
    month: 'Feb',
    food: 1300,
    shopping: 750,
    entertainment: 650,
    transportation: 520,
    utilities: 420,
  },
  {
    month: 'Mar',
    food: 1250,
    shopping: 900,
    entertainment: 700,
    transportation: 480,
    utilities: 410,
  },
  {
    month: 'Apr',
    food: 1400,
    shopping: 850,
    entertainment: 750,
    transportation: 510,
    utilities: 430,
  },
  {
    month: 'May',
    food: 1350,
    shopping: 950,
    entertainment: 800,
    transportation: 490,
    utilities: 450,
  },
  {
    month: 'Jun',
    food: 1500,
    shopping: 1000,
    entertainment: 900,
    transportation: 530,
    utilities: 440,
  },
];

const insights = [
  {
    title: 'Food Spending Trend',
    description:
      'Your food spending has increased by 25% over the past 6 months, which is higher than your income growth rate. Consider reducing eating out frequency or finding more economical restaurant options.',
    icon: <TrendingUp className='h-5 w-5 text-rose-500' />,
    color: '#f43f5e',
  },
  {
    title: 'Shopping Optimization',
    description:
      'Your shopping expenses show seasonal fluctuations. We recommend concentrating purchases during promotional seasons to save approximately 15% on expenses.',
    icon: <TrendingDown className='h-5 w-5 text-emerald-500' />,
    color: '#10b981',
  },
  {
    title: 'Entertainment Spending Advice',
    description:
      'Your entertainment spending accounts for 18% of your total expenses, which is above average. Consider exploring free or low-cost entertainment activities, such as park walks or home movie nights.',
    icon: <Lightbulb className='h-5 w-5 text-amber-500' />,
    color: '#f59e0b',
  },
];

export function AIInsightDemo() {
  const [selectedCategory, setSelectedCategory] = useState('food');

  const strokeColor =
    selectedCategory === 'food'
      ? '#f43f5e'
      : selectedCategory === 'shopping'
        ? '#3b82f6'
        : selectedCategory === 'entertainment'
          ? '#f59e0b'
          : selectedCategory === 'transportation'
            ? '#8b5cf6'
            : '#10b981';

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card className=''>
        <CardHeader>
          <CardTitle>Spending Trend Analysis</CardTitle>
          <CardDescription>
            View spending trends across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <Select
              defaultValue='food'
              onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='food'>Food</SelectItem>
                <SelectItem value='shopping'>Shopping</SelectItem>
                <SelectItem value='entertainment'>Entertainment</SelectItem>
                <SelectItem value='transportation'>Transport</SelectItem>
                <SelectItem value='utilities'>Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ChartContainer
            config={{
              [selectedCategory]: {
                label:
                  selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1),
                color:
                  selectedCategory === 'food'
                    ? 'hsl(var(--chart-1))'
                    : selectedCategory === 'shopping'
                      ? 'hsl(var(--chart-2))'
                      : selectedCategory === 'entertainment'
                        ? 'hsl(var(--chart-3))'
                        : selectedCategory === 'transportation'
                          ? 'hsl(var(--chart-4))'
                          : 'hsl(var(--chart-5))',
              },
            }}
            className='md:max-w-[450px] max-w-[300px] h-[300px]  md:h-[380px]'>
            <LineChart
              data={monthlyData}
              margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={['auto', (dataMax: number) => dataMax * 1.04]}
                tickFormatter={(value) => `$${value}`}
                label={{
                  value: 'Spending ($)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5,
                  style: {
                    textAnchor: 'middle',
                    fill: 'var(--foreground)',
                    fontSize: 12,
                  },
                }}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='line' />}
              />
              <Line
                dataKey={selectedCategory}
                type='monotone'
                stroke={strokeColor}
                strokeWidth={2}
                dot={{
                  r: 2,
                  strokeWidth: 2,
                  fill: strokeColor,
                }}>
                <LabelList
                  position='top'
                  offset={12}
                  className='fill-foreground'
                  fontSize={11}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-muted-foreground'>
            Click on the selector above to view spending trends for different
            categories
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Financial Insights</CardTitle>
          <CardDescription>
            Smart analysis based on your spending habits
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {insights.map((insight, index) => (
            <Card
              key={index}
              className='border-l-4'
              style={{ borderLeftColor: insight.color }}>
              <CardContent className='p-4'>
                <div className='flex items-start gap-4'>
                  <div
                    className='rounded-full p-2'
                    style={{ backgroundColor: `${insight.color}20` }}>
                    {insight.icon}
                  </div>
                  <div>
                    <h4 className='font-medium'>{insight.title}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardFooter>
          <Button className='w-full'>
            View More Insights
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
