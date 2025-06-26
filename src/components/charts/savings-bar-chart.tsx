'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface SavingsBarChartProps {
  data: { month: number; savings: number }[];
  monthsToGoal: number;
}

const chartConfig = {
  savings: {
    label: 'Savings',
    color: 'hsl(var(--chart-1))',
  },
};

export function SavingsBarChart({ data, monthsToGoal }: SavingsBarChartProps) {
  console.log('SavingsBarChart data:', data);
  const chartEmpty = data.length === 0;

  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Savings Projection</CardTitle>
        <CardDescription>
          See how your savings will grow over time
        </CardDescription>
      </CardHeader>

      <CardContent className=' px-6 py-0'>
        {chartEmpty ? (
          <div className='flex items-center justify-center h-full text-center text-muted-foreground'>
            {monthsToGoal === Number.POSITIVE_INFINITY ? (
              'Increase your monthly contribution to see projection'
            ) : (
              <span className='flex items-center justify-center h-96 '>
                No data available. Adjust your savings or contributions to see
                the projection.
              </span>
            )}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='h-full w-full'>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                label={{
                  value: 'Months',
                  position: 'insideBottom',
                  offset: -4,
                }}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value > 1000) {
                    return `${(value / 1000).toFixed(1)}k`;
                  }
                  return value;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dashed' />}
              />
              <Bar
                dataKey='savings'
                fill='var(--color-savings)'
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className='flex py-4 justify-center'>
        <p className='text-sm text-muted-foreground'>
          Adjust your goal, savings, and contributions to see how it affects
          your timeline
        </p>
      </CardFooter>
    </Card>
  );
}
