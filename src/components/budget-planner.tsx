'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Label as PieLabel } from 'recharts';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { ChartContainer } from './ui/chart';

export function BudgetPlanner() {
  const [income, setIncome] = useState(5000);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Housing', amount: 1500, color: '#0088FE' },
    { id: 2, name: 'Food', amount: 800, color: '#00C49F' },
    { id: 3, name: 'Transportation', amount: 400, color: '#FFBB28' },
    { id: 4, name: 'Entertainment', amount: 300, color: '#FF8042' },
    { id: 5, name: 'Utilities', amount: 250, color: '#8884d8' },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const totalExpenses = categories.reduce(
    (sum, category) => sum + category.amount,
    0
  );
  const remaining = income - totalExpenses;
  const remainingPercentage = Math.round((remaining / income) * 100);

  const chartData = [
    ...categories.map((category) => ({
      name: category.name,
      value: category.amount,
      color: category.color,
    })),
    {
      name: 'Remaining',
      value: remaining > 0 ? remaining : 0,
      color: '#4CAF50',
    },
  ];

  const addCategory = () => {
    if (!newCategory || !newAmount) return;

    const amount = Number.parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;

    const colors = [
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#8884d8',
      '#82ca9d',
      '#ffc658',
    ];

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory,
        amount: amount,
        color: colors[categories.length % colors.length],
      },
    ]);

    setNewCategory('');
    setNewAmount('');
  };

  const removeCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Budget Planner</CardTitle>
          <CardDescription>
            Create and manage your monthly budget
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

          <div className='pt-4'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='font-medium'>Expense Categories</h3>
              <Badge variant={remaining >= 0 ? 'outline' : 'destructive'}>
                {remaining >= 0
                  ? `$${remaining} remaining`
                  : `$${Math.abs(remaining)} over budget`}
              </Badge>
            </div>

            <div className='space-y-2 max-h-[200px] overflow-y-auto pr-2'>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className='flex items-center justify-between gap-2 p-2 border rounded-md'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: category.color }}></div>
                    <span>{category.name}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span>${category.amount}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6'
                      onClick={() => removeCategory(category.id)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex gap-2 mt-4'>
              <Input
                placeholder='Category name'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Input
                type='number'
                placeholder='Amount'
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
              <Button
                onClick={addCategory}
                size='icon'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className='w-full'>
            <div className='flex justify-between text-sm mb-1'>
              <span>Total Expenses: ${totalExpenses}</span>
              <span
                className={
                  remaining >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }>
                {remainingPercentage}% of income{' '}
                {remaining >= 0 ? 'remaining' : 'overspent'}
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-2.5'>
              <div
                className={`h-2.5 rounded-full ${remaining >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{
                  width: `${Math.min(100, (totalExpenses / income) * 100)}%`,
                }}></div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
          <CardDescription>
            Visual representation of your budget
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer
            config={{}} // 你可以自定义 config 来显示图例
            className='mx-auto aspect-square max-h-[450px]'>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                strokeWidth={5}
                dataKey='value'>
                <PieLabel
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
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
                            ${remaining.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className='fill-muted-foreground text-sm'>
                            remaining
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
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className='text-sm text-muted-foreground'>
            Add or remove categories to adjust your budget allocation
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
