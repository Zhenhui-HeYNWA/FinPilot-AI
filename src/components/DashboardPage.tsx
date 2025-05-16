'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import NumberFlow from '@number-flow/react';
import { CreditCard, Minus, PiggyBank, Plus } from 'lucide-react';
import { useGetIncome } from '@/hooks/useIncome';
import { useGetExpense } from '@/hooks/useExpense';
import { AreaChartComponent } from './AreaChart';
import { Switch } from '@/components/ui/switch';
import Loading from './ui/loading';

const DashboardPage = () => {
  const [value, setValue] = useState(23829);

  const { data: income, isLoading: isIncomeLoading } = useGetIncome();
  const { data: expense, isLoading: isExpenseLoading } = useGetExpense();
  const isBalanceLoading = isIncomeLoading && isExpenseLoading;
  const [isIncomeChartVisible, setIsIncomeChartVisible] = useState(false);
  const [isExpenseChartVisible, setIsExpenseChartVisible] = useState(false);
  const [isBalanceChartVisible, setIsBalanceChartVisible] = useState(false);
  const [isSavingChartVisible, setIsSavingChartVisible] = useState(false);

  const incomeTotal = income?.totalIncome ?? 0;
  const expenseTotal = expense?.totalExpense ?? 0;
  const balanceTotal = incomeTotal - expenseTotal;

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full '>
      <Card className={`w-full ${isIncomeChartVisible ? 'h-96' : 'h-36'}`}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 w-full'>
          <CardTitle className='text-lg font-bold'>Total Income</CardTitle>
          <Plus
            color='#2aae19'
            size={24}
          />
        </CardHeader>
        <CardContent>
          <div className=' flex  items-center justify-between'>
            <div className='text-2xl font-bold flex items-center'>
              <span> $</span>
              <NumberFlow value={incomeTotal} />
            </div>
            <div className='flex items-center justify-between'>
              {isIncomeLoading ? (
                <Loading color={'#2aae19'} />
              ) : (
                <Switch
                  id='airplane-mode'
                  checked={isIncomeChartVisible}
                  onCheckedChange={(checked) =>
                    setIsIncomeChartVisible(checked)
                  }
                  className='data-[state=checked]:bg-[#2aae19]'
                />
              )}
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

      <Card className={`w-full ${isExpenseChartVisible ? 'h-96 ' : 'h-36'}`}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Total Expense</CardTitle>
          <Minus
            color='#ae1919'
            size={24}
          />
        </CardHeader>
        <CardContent>
          <div className=' flex  items-center justify-between'>
            <div className='text-2xl font-bold flex items-center'>
              <span>$</span>
              <NumberFlow value={expense ? expense?.totalExpense : 0} />
            </div>
            <div className='flex items-center space-x-2'>
              {isExpenseLoading ? (
                <Loading color={'#ae1919'} />
              ) : (
                <Switch
                  id='airplane-mode'
                  checked={isExpenseChartVisible}
                  onCheckedChange={(checked) =>
                    setIsExpenseChartVisible(checked)
                  }
                  className='data-[state=checked]:bg-[#ae1919]'
                />
              )}
            </div>
          </div>
          <div className={`mt-4 transition-all duration-900 ease-in-out `}>
            {isExpenseChartVisible && <AreaChartComponent type={'expense'} />}
          </div>
          <p className='text-xs text-muted-foreground'>
            +20.1% Compared to last month
          </p>
        </CardContent>
      </Card>
      <Card className={`w-full ${isBalanceChartVisible ? 'h-96 ' : 'h-36'}`}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Balance</CardTitle>
          <CreditCard
            color='#1981ae'
            size={24}
          />
        </CardHeader>
        <CardContent>
          <div className=' flex  items-center justify-between'>
            <div className='text-2xl font-bold flex items-center'>
              <span>$</span>
              <NumberFlow value={balanceTotal} />
            </div>
            <div className='flex items-center justify-between'>
              {isBalanceLoading ? (
                <Loading color={'#1981ae'} />
              ) : (
                <Switch
                  id='expense-mode'
                  checked={isBalanceChartVisible}
                  onCheckedChange={(checked) =>
                    setIsBalanceChartVisible(checked)
                  }
                  className='data-[state=checked]:bg-[#1981ae]'
                />
              )}
            </div>
          </div>
          <div className={`mt-4 transition-all duration-900 ease-in-out `}>
            {isBalanceChartVisible && <AreaChartComponent type={'balance'} />}
          </div>
          <p className='text-xs text-muted-foreground'>
            +20.1% Compared to last month
          </p>
        </CardContent>
      </Card>
      <Card className={`w-full ${isSavingChartVisible ? 'h-96 ' : 'h-36'}`}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Saving Goal</CardTitle>
          <PiggyBank
            color='#b89b0a'
            size={24}
          />
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='text-2xl font-bold'>
              $
              <NumberFlow
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
            <div className='flex items-center justify-between'>
              {isBalanceLoading ? (
                <Loading color='#b89b0a' />
              ) : (
                <Switch
                  id='airplane-mode'
                  checked={isSavingChartVisible}
                  onCheckedChange={(checked) =>
                    setIsSavingChartVisible(checked)
                  }
                  className='data-[state=checked]:bg-[#b89b0a]'
                />
              )}
            </div>
          </div>
          <div className={`mt-4 transition-all duration-900 ease-in-out `}>
            {isSavingChartVisible && <AreaChartComponent type={'savings'} />}
          </div>
          <p className='text-xs text-muted-foreground'>+20.1% Balance</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
