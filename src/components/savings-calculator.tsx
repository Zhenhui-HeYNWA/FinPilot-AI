'use client';

import { useState } from 'react';

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
import { Progress } from '@/components/ui/progress';
import { SavingsBarChart } from './charts/savings-bar-chart';

export function SavingsCalculator() {
  const [goal, setGoal] = useState(10000);
  const [initialSavings, setInitialSavings] = useState(2000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [interestRate, setInterestRate] = useState(3);

  // Calculate months to reach goal
  const calculateMonthsToGoal = () => {
    if (initialSavings >= goal) return 0;
    if (monthlyContribution <= 0) return Number.POSITIVE_INFINITY;

    let currentSavings = initialSavings;
    let months = 0;

    while (currentSavings < goal && months < 120) {
      // Add monthly contribution
      currentSavings += monthlyContribution;

      // Add monthly interest
      currentSavings *= 1 + interestRate / 100 / 12;

      months++;
    }

    return months;
  };

  const monthsToGoal = calculateMonthsToGoal();
  const yearsToGoal = Math.floor(monthsToGoal / 12);
  const remainingMonths = monthsToGoal % 12;

  // Generate chart data
  const generateChartData = () => {
    if (monthsToGoal === Number.POSITIVE_INFINITY || monthsToGoal === 0)
      return [];

    const data = [];
    let currentSavings = initialSavings;

    // Add initial point
    data.push({
      month: 0,
      savings: currentSavings,
    });

    // Calculate for each month
    for (let i = 1; i <= Math.min(monthsToGoal, 24); i++) {
      currentSavings += monthlyContribution;
      currentSavings *= 1 + interestRate / 100 / 12;

      data.push({
        month: i,
        savings: Math.round(currentSavings),
      });
    }

    return data;
  };

  const chartData = generateChartData();
  const progressPercentage = Math.min(
    100,
    Math.round((initialSavings / goal) * 100)
  );

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card className='md:max-w-[500px] max-w-[400px]  '>
        <CardHeader>
          <CardTitle>Savings Goal Calculator</CardTitle>
          <CardDescription>Plan how to reach your savings goal</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='goal'>Savings Goal ($)</Label>
            <Input
              id='goal'
              type='number'
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='initial'>Current Savings ($)</Label>
            <Input
              id='initial'
              type='number'
              value={initialSavings}
              onChange={(e) => setInitialSavings(Number(e.target.value))}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <Label htmlFor='monthly'>Monthly Contribution ($)</Label>
              <span className='text-sm'>${monthlyContribution}</span>
            </div>
            <Slider
              id='monthly'
              min={0}
              max={2000}
              step={50}
              value={[monthlyContribution]}
              onValueChange={(value) => setMonthlyContribution(value[0])}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <Label htmlFor='interest'>Annual Interest Rate (%)</Label>
              <span className='text-sm'>{interestRate}%</span>
            </div>
            <Slider
              id='interest'
              min={0}
              max={10}
              step={0.1}
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
            />
          </div>

          <div className='pt-4 space-y-2'>
            <Label>Progress to Goal</Label>
            <Progress
              value={progressPercentage}
              className='h-2'
            />
            <p className='text-sm text-muted-foreground text-right'>
              {progressPercentage}% complete
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between items-center mt-20'>
          <div>
            <p className='text-sm font-medium'>Time to reach goal:</p>
            <p className='text-xl font-bold text-primary'>
              {monthsToGoal === Number.POSITIVE_INFINITY
                ? 'Never'
                : monthsToGoal === 0
                  ? 'Already reached!'
                  : `${yearsToGoal > 0 ? `${yearsToGoal} year${yearsToGoal > 1 ? 's' : ''}` : ''} 
                 ${remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`}
            </p>
          </div>
          <Button>Save Plan</Button>
        </CardFooter>
      </Card>

      <SavingsBarChart
        data={chartData}
        monthsToGoal={monthsToGoal}
      />
    </div>
  );
}
