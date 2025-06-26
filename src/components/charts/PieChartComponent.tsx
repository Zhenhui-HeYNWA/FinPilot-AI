'use client';
import React, { useState } from 'react';

import { Label, Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import NumberFlow from '@number-flow/react';
import { Button } from '../ui/button';
import { BadgeHelp, CircleCheckBig } from 'lucide-react';

import { useUpdateSavingsGoal } from '@/hooks/useSavings';
import toast from 'react-hot-toast';

interface SavingsProps {
  currentAmount: number;
  targetAmount: number;
}

export function PieChartComponent({
  currentAmount,
  targetAmount,
}: SavingsProps) {
  const [isCompleteThisMonth, setIsCompleteThisMonth] = useState(false);
  const amountLeft = targetAmount - currentAmount;
  console.log(amountLeft, targetAmount, currentAmount);
  const chartData = [
    { browser: 'Saved', visitors: currentAmount, fill: '#b89b0a' },
    { browser: 'Left', visitors: amountLeft, fill: '#99919156' },
  ];

  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    chrome: {
      label: 'Saving',
      color: 'hsl(var(--chart-1))',
    },
    safari: {
      label: 'Left',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;
  const saving =
    chartData.find((item) => item.browser === 'Saving')?.visitors ?? 0;
  const left = chartData.find((item) => item.browser === 'Left')?.visitors ?? 0;

  const remainingPercentage = Math.round((left / targetAmount) * 100);
  const updateSavingsGoal = useUpdateSavingsGoal();

  const handleUpdate = () => {
    updateSavingsGoal.mutate(undefined, {
      onSuccess: () => {
        toast.success('Savings goal updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update savings goal: ${error.message}`);
      },
    });
  };

  return (
    <div>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild> */}
      <Button className='w-full bg-white border hover:bg-white hover:ring-2 hover:ring-[#b89b0a] text-[#b89b0a] '>
        {isCompleteThisMonth ? (
          <div
            className='flex items-center gap-2'
            onClick={() => setIsCompleteThisMonth(!isCompleteThisMonth)}>
            <CircleCheckBig color='#b89b0a' />
            <span>Completed This Month</span>
          </div>
        ) : (
          <div
            className='flex items-center gap-2'
            onClick={() => handleUpdate()}>
            <BadgeHelp color='#b89b0a' />
            <span>Complete This Month</span>
          </div>
        )}
      </Button>

      <ChartContainer
        config={chartConfig}
        className='mx-auto aspect-square max-h-[200px]'>
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Pie
            data={chartData}
            dataKey='visitors'
            nameKey='browser'
            innerRadius={60}
            strokeWidth={10}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <foreignObject
                      x={viewBox.cx! - 40}
                      y={viewBox.cy! - 40}
                      width={80}
                      height={80}
                      className='items-center flex justify-center'>
                      <div className='flex flex-col items-center h-full w-full rounded-full justify-center   cursor-pointer   hover:border-2 hover:border-gray-300 hover:rounded-full'>
                        <div className='text-2xl font-bold text-foreground'>
                          <NumberFlow value={remainingPercentage || 0} />%
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          To go
                        </div>
                      </div>
                    </foreignObject>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
