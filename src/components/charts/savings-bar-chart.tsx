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
  const chartEmpty = data.length === 0;

  return (
    <Card className='md:max-w-[500px] max-w-[450px] '>
      <CardHeader>
        <CardTitle>Savings Projection</CardTitle>
        <CardDescription>
          See how your savings will grow over time
        </CardDescription>
      </CardHeader>

      <CardContent className='h-[450px]'>
        {chartEmpty ? (
          <div className='flex items-center justify-center h-full text-center text-muted-foreground'>
            {monthsToGoal === Number.POSITIVE_INFINITY
              ? 'Increase your monthly contribution to see projection'
              : "You've already reached your goal!"}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='h-full  md:max-w-[450px] max-w-[300px]'>
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
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                label={{
                  value: 'Savings ($)',
                  angle: -90,
                  position: 'insideLeft',
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

      <CardFooter>
        <p className='text-sm text-muted-foreground'>
          Adjust your goal, savings, and contributions to see how it affects
          your timeline
        </p>
      </CardFooter>
    </Card>
  );
}
