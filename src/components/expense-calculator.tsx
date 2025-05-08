'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Label as PieLabel } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function ExpenseCalculator() {
  const [income, setIncome] = useState(8000);
  const [expenses, setExpenses] = useState({
    housing: 30,
    food: 20,
    transportation: 15,
    entertainment: 10,
    utilities: 10,
    other: 15,
  });

  const calculateAmount = (percentage: number) => {
    return Math.round((income * percentage) / 100);
  };

  const totalExpensePercentage = Object.values(expenses).reduce(
    (sum, value) => sum + value,
    0
  );
  const savings =
    income -
    Object.entries(expenses).reduce(
      (sum, [key, value]) => sum + calculateAmount(value),
      0
    );

  const chartData = [
    ...Object.entries(expenses).map(([key, value]) => ({
      name:
        key === 'housing'
          ? 'Housing'
          : key === 'food'
            ? 'Food'
            : key === 'transportation'
              ? 'Transport'
              : key === 'entertainment'
                ? 'Entertainment'
                : key === 'utilities'
                  ? 'Utilities'
                  : 'Other',
      value: calculateAmount(value),
      percentage: value,
    })),
    {
      name: 'Savings',
      value: savings,
      percentage: 100 - totalExpensePercentage,
    },
  ];

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
    '#4CAF50',
  ];

  const handleSliderChange = (category: string, value: number[]) => {
    setExpenses((prev) => ({
      ...prev,
      [category]: value[0],
    }));
  };

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Expense Calculator</CardTitle>
          <CardDescription>
            Adjust sliders to allocate your monthly income
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='income'>Monthly Income ($)</Label>
            <Input
              id='income'
              type='number'
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>

          <div className='space-y-4 pt-4'>
            {Object.entries(expenses).map(([category, value], index) => (
              <div
                key={category}
                className='space-y-2'>
                <div className='flex justify-between'>
                  <div className='flex  gap-1 items-center'>
                    <Label htmlFor={category}>
                      {category === 'housing'
                        ? 'Housing'
                        : category === 'food'
                          ? 'Food'
                          : category === 'transportation'
                            ? 'Transport'
                            : category === 'entertainment'
                              ? 'Entertainment'
                              : category === 'utilities'
                                ? 'Utilities'
                                : 'Other'}
                    </Label>
                  </div>
                  <span className='text-sm'>
                    {value}% (${calculateAmount(value)})
                  </span>
                </div>
                <Slider
                  id={category}
                  defaultValue={[value]}
                  max={50}
                  step={1}
                  onValueChange={(value) => handleSliderChange(category, value)}
                  style={
                    {
                      '--tw-bg-slider': COLORS[index % COLORS.length],
                    } as React.CSSProperties
                  }
                  className='bg-[--tw-bg-slider] bg-[--tw-bg-slider] rounded-full'
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <div>
            <p className='text-sm font-medium'>Remaining Savings:</p>
            <p
              className={`text-xl font-bold ${savings > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ${savings}
            </p>
          </div>
          <Button>Save Plan</Button>
        </CardFooter>
      </Card>

      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Expense Analysis</CardTitle>
          <CardDescription>Your monthly expense distribution</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer
            config={{}} // 你可以自定义 config 来显示图例
            className='mx-auto aspect-square max-h-[450px]'>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
                labelLine={false}>
                <PieLabel
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      const total = chartData
                        .filter((d) => d.name !== 'Savings')
                        .reduce((sum, d) => sum + d.value, 0);
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-2xl font-bold'>
                            ${total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className='fill-muted-foreground text-sm'>
                            Expenses
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === chartData.length - 1
                        ? 'var(--color-savings)'
                        : `var(--color-${entry.name.toLowerCase()})`
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='text-sm text-muted-foreground'>
          Adjust sliders on the left to see how different expense allocations
          affect your finances
        </CardFooter>
      </Card>
    </div>
  );
}
