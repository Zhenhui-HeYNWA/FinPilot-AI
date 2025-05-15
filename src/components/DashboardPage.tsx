'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import NumberFlow from '@number-flow/react';
import { CreditCard, Minus, PiggyBank, Plus } from 'lucide-react';
import { useGetIncome } from '@/hooks/useIncome';
import { useGetExpense } from '@/hooks/useExpense';
import { AreaChartComponent } from './AreaChart';
import { Switch } from '@/components/ui/switch';

const DashboardPage = () => {
  const [value, setValue] = useState(0);
  const [balance, setBalance] = useState(0);
  const { data: income } = useGetIncome();
  const { data: expense } = useGetExpense();
  const [isIncomeChartVisible, setIsIncomeChartVisible] = useState(false);
  const [isExpenseChartVisible, setIsExpenseChartVisible] = useState(false);
  const [isBalanceChartVisible, setIsBalanceChartVisible] = useState(false);

  const incomeTotal = income?.totalIncome ?? 0;
  const expenseTotal = expense?.totalExpense ?? 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(23829);
    }, 100); // 延迟一点让动画更明显
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBalance(incomeTotal - expenseTotal);
    }, 100); // 延迟一点让动画更明显
    return () => clearTimeout(timeout);
  }, [expenseTotal, incomeTotal]);
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full '>
      <Card className='w-full h-full'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 w-full'>
          <CardTitle className='text-lg font-bold'>Total Income</CardTitle>
          <Plus color='#2aae19' />
        </CardHeader>
        <CardContent>
          <div className=' flex  items-center justify-between'>
            <div className='text-2xl font-bold flex items-center'>
              <span> $</span>
              <NumberFlow
                value={incomeTotal}
                transformTiming={{
                  duration: 500,
                  easing: 'ease-out',
                }}
                spinTiming={{
                  duration: 750,
                  easing: 'linear',
                }}
                opacityTiming={{
                  duration: 350,
                  easing: 'ease-in-out',
                }}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='airplane-mode'
                checked={isIncomeChartVisible}
                onCheckedChange={(checked) => setIsIncomeChartVisible(checked)}
                className='data-[state=checked]:bg-[#2aae19]'
              />
            </div>
          </div>
          <div className={`mt-4 transition-all duration-900 ease-in-out `}>
            {isIncomeChartVisible && <AreaChartComponent type={'income'} />}
          </div>

          <p className='text-xs text-muted-foreground'>
            +20.1% Compared to last month
          </p>
        </CardContent>
      </Card>

      <Card className='w-full '>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Total Expense</CardTitle>
          <Minus color='#ae1919' />
        </CardHeader>
        <CardContent>
          <div className=' flex  items-center justify-between'>
            <div className='text-2xl font-bold flex items-center'>
              $
              <NumberFlow
                // format={{
                //   style: 'currency',
                //   currency: 'USD',
                //   minimumFractionDigits: 0,
                // }}
                value={expenseTotal}
                transformTiming={{
                  duration: 500,
                  easing: 'ease-out',
                }}
                spinTiming={{
                  duration: 750,
                  easing: 'linear',
                }}
                opacityTiming={{
                  duration: 350,
                  easing: 'ease-in-out',
                }}
              />
            </div>
            <Switch
              id='expense-mode'
              checked={isExpenseChartVisible}
              onCheckedChange={(checked) => setIsExpenseChartVisible(checked)}
              className='data-[state=checked]:bg-[#ae1919]'
            />
          </div>
          <div className={`mt-4 transition-all duration-900 ease-in-out `}>
            {isExpenseChartVisible && <AreaChartComponent type={'expense'} />}
          </div>
          <p className='text-xs text-muted-foreground'>
            +20.1% Compared to last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Balance</CardTitle>
          <CreditCard color='#1981ae' />
        </CardHeader>
        <CardContent>
          <div className=' flex  items-center justify-between'>
            <div className='text-2xl font-bold flex items-center'>
              $
              <NumberFlow
                // format={{
                //   style: 'currency',
                //   currency: 'USD',
                //   minimumFractionDigits: 0,
                // }}
                value={balance}
                transformTiming={{
                  duration: 500,
                  easing: 'ease-out',
                }}
                spinTiming={{
                  duration: 750,
                  easing: 'linear',
                }}
                opacityTiming={{
                  duration: 350,
                  easing: 'ease-in-out',
                }}
              />
            </div>
            <Switch
              id='expense-mode'
              checked={isBalanceChartVisible}
              onCheckedChange={(checked) => setIsBalanceChartVisible(checked)}
              className='data-[state=checked]:bg-[#1981ae]'
            />
          </div>
          <div className={`mt-4 transition-all duration-900 ease-in-out `}>
            {isBalanceChartVisible && <AreaChartComponent type={'balance'} />}
          </div>
          <p className='text-xs text-muted-foreground'>
            +20.1% Compared to last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Saving Goal</CardTitle>
          <PiggyBank color='#b89b0a' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            $
            <NumberFlow
              // format={{
              //   style: 'currency',
              //   currency: 'USD',
              //   minimumFractionDigits: 0,
              // }}
              value={value}
              transformTiming={{
                duration: 500,
                easing: 'ease-out',
              }}
              spinTiming={{
                duration: 750,
                easing: 'linear',
              }}
              opacityTiming={{
                duration: 350,
                easing: 'ease-in-out',
              }}
            />
          </div>
          <p className='text-xs text-muted-foreground'>+20.1% Balance</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
