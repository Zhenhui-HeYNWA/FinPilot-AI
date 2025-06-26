'use client';

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
import { SavingsBarChart } from '@/components/charts/savings-bar-chart';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { savingsGoalSchema } from '@/lib/zod/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSavingsGoal } from '@/hooks/useSavings';

import toast from 'react-hot-toast';

export default function Savings() {
  const createSavingsGoal = useCreateSavingsGoal();
  const savingsForm = useForm<z.infer<typeof savingsGoalSchema>>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      savingsGoalName: 'My Savings Goal',
      targetAmount: 10000,
      currentAmount: 2000,
      monthlyContribution: 2000,
      annualInterestRate: 3.0,
    },
  });
  const watchedValues = savingsForm.watch();
  const currentAmount = watchedValues.currentAmount;
  const targetAmount = watchedValues.targetAmount;
  const monthlyContribution = watchedValues.monthlyContribution;
  const interestRate = watchedValues.annualInterestRate;
  // Calculate months to reach goal
  const calculateMonthsToGoal = () => {
    const EPSILON = 0.01; // 精度容差
    if (targetAmount <= currentAmount) return 0;
    if (monthlyContribution <= 0 && interestRate <= 0)
      return Number.POSITIVE_INFINITY;

    let months = 0;
    let savings = currentAmount;

    while (savings + EPSILON < targetAmount && months < 1200) {
      // 每月先加利息（复利），再加月存入金额
      savings *= 1 + interestRate / 100 / 12;
      savings += monthlyContribution;
      months++;
    }

    return savings >= targetAmount ? months : Number.POSITIVE_INFINITY;
  };

  const monthsToGoal = calculateMonthsToGoal();
  const yearsToGoal = Math.floor(monthsToGoal / 12);
  const remainingMonths = monthsToGoal % 12;

  const Savings = () => {
    if (monthsToGoal === Number.POSITIVE_INFINITY || monthsToGoal === 0)
      return [];

    const data = [];
    let currentSavings = currentAmount;

    // data.push({ month: 0, savings: Math.round(currentSavings) });

    for (let i = 1; i <= Math.min(monthsToGoal, 24); i++) {
      // 正确顺序：先计算利息，再加月供
      currentSavings *= 1 + interestRate / 100 / 12;
      currentSavings += monthlyContribution;

      data.push({
        month: i,
        savings: Math.round(currentSavings),
      });
    }

    return data;
  };

  const chartData = Savings();
  const progressPercentage = Math.min(
    100,
    Math.round((currentAmount / targetAmount) * 100)
  );

  async function onSubmit(values: z.infer<typeof savingsGoalSchema>) {
    createSavingsGoal.mutate(values, {
      onSuccess: async (data) => {
        toast.success('Savings goal created successfully!');
        console.log('Savings goal created successfully', data);
        savingsForm.reset();
      },
      onError: () => {
        toast.error('Failed to create savings goal');
      },
    });
    console.log('Form submitted with values:', values);
  }

  return (
    <div className=' flex flex-col sm:flex-row gap-4'>
      <Card className=' flex-1 '>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>
            Savings Goal Calculator
          </CardTitle>
          <CardDescription>Plan how to reach your savings goal</CardDescription>
        </CardHeader>
        <Form {...savingsForm}>
          <form onSubmit={savingsForm.handleSubmit(onSubmit)}>
            <CardContent className='space-y-4'>
              <FormField
                control={savingsForm.control} // Replace with your form control
                name='savingsGoalName'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel>Name This Saving</FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          type='string'
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={savingsForm.control}
                name='targetAmount'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel htmlFor='goal'>Savings Goal ($)</FormLabel>
                      <FormControl>
                        <Input
                          id='goal'
                          type='number'
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={savingsForm.control}
                name='currentAmount'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel htmlFor='initial'>
                        Current Savings ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='initial'
                          type='number'
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={savingsForm.control}
                name='monthlyContribution'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <FormLabel htmlFor='monthly'>
                          Monthly Contribution ($)
                        </FormLabel>
                        <span className='text-sm'>${monthlyContribution}</span>
                      </div>
                      <FormControl>
                        <Slider
                          id='monthly'
                          min={0}
                          max={9999}
                          step={50}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={savingsForm.control} // Replace with your form control
                name='annualInterestRate'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <Label htmlFor='interest'>
                          Annual Interest Rate (%)
                        </Label>
                        <span className='text-sm'>{interestRate}%</span>
                      </div>
                      <Slider
                        id='interest'
                        min={0}
                        max={10}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </div>
                  </FormItem>
                )}
              />

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
            <CardFooter className='flex justify-between items-center mt-8 '>
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
          </form>
        </Form>
      </Card>

      <SavingsBarChart
        data={chartData}
        monthsToGoal={monthsToGoal}
      />
    </div>
  );
}
