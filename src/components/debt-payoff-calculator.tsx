'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

export function DebtPayoffCalculator() {
  const [debts, setDebts] = useState([
    { id: 1, name: 'Credit Card', balance: 5000, rate: 18, payment: 200 },
    { id: 2, name: 'Car Loan', balance: 15000, rate: 5, payment: 300 },
    { id: 3, name: 'Student Loan', balance: 25000, rate: 4, payment: 400 },
  ]);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtBalance, setNewDebtBalance] = useState('');
  const [newDebtRate, setNewDebtRate] = useState('');
  const [newDebtPayment, setNewDebtPayment] = useState('');
  const [extraPayment, setExtraPayment] = useState(100);
  const [strategy, setStrategy] = useState('avalanche');

  // Calculate total debt and monthly payment
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMonthlyPayment =
    debts.reduce((sum, debt) => sum + debt.payment, 0) + extraPayment;

  // Calculate payoff timeline
  const calculatePayoffTimeline = () => {
    if (debts.length === 0)
      return { months: 0, totalInterest: 0, chartData: [] };

    // Clone debts to avoid modifying state
    const debtsCopy = JSON.parse(JSON.stringify(debts));

    // Sort debts based on strategy
    if (strategy === 'avalanche') {
      // Highest interest rate first
      debtsCopy.sort((a: any, b: any) => b.rate - a.rate);
    } else {
      // Lowest balance first
      debtsCopy.sort((a: any, b: any) => a.balance - b.balance);
    }

    let month = 0;
    let totalInterestPaid = 0;
    let remainingDebt = totalDebt;
    const chartData: any[] = [{ month, balance: remainingDebt, interest: 0 }];

    // Continue until all debts are paid off
    while (remainingDebt > 0 && month < 600) {
      month++;
      let monthlyInterest = 0;
      let availableExtra = extraPayment;

      // Apply regular payments and calculate interest
      for (let i = 0; i < debtsCopy.length; i++) {
        if (debtsCopy[i].balance <= 0) continue;

        // Calculate interest for this debt
        const interest =
          (debtsCopy[i].balance * (debtsCopy[i].rate / 100)) / 12;
        monthlyInterest += interest;
        totalInterestPaid += interest;

        // Add interest to balance
        debtsCopy[i].balance += interest;

        // Apply regular payment
        if (debtsCopy[i].balance <= debtsCopy[i].payment) {
          availableExtra += debtsCopy[i].payment - debtsCopy[i].balance;
          debtsCopy[i].balance = 0;
        } else {
          debtsCopy[i].balance -= debtsCopy[i].payment;
        }
      }

      // Apply extra payment to first debt with remaining balance
      for (let i = 0; i < debtsCopy.length; i++) {
        if (debtsCopy[i].balance <= 0) continue;

        if (debtsCopy[i].balance <= availableExtra) {
          availableExtra -= debtsCopy[i].balance;
          debtsCopy[i].balance = 0;
        } else {
          debtsCopy[i].balance -= availableExtra;
          availableExtra = 0;
        }

        if (availableExtra <= 0) break;
      }

      // Calculate remaining debt
      remainingDebt = debtsCopy.reduce(
        (sum: number, debt: any) => sum + debt.balance,
        0
      );

      // Add data point every 3 months for chart (to avoid too many points)
      if (month % 3 === 0 || remainingDebt === 0) {
        chartData.push({
          month,
          balance: Math.round(remainingDebt),
          interest: Math.round(totalInterestPaid),
        });
      }
    }

    return {
      months: month,
      totalInterest: Math.round(totalInterestPaid),
      chartData,
    };
  };

  const { months, totalInterest, chartData } = calculatePayoffTimeline();
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const addDebt = () => {
    if (!newDebtName || !newDebtBalance || !newDebtRate || !newDebtPayment)
      return;

    const balance = Number.parseFloat(newDebtBalance);
    const rate = Number.parseFloat(newDebtRate);
    const payment = Number.parseFloat(newDebtPayment);

    if (
      isNaN(balance) ||
      isNaN(rate) ||
      isNaN(payment) ||
      balance <= 0 ||
      rate <= 0 ||
      payment <= 0
    )
      return;

    setDebts([
      ...debts,
      {
        id: Date.now(),
        name: newDebtName,
        balance,
        rate,
        payment,
      },
    ]);

    setNewDebtName('');
    setNewDebtBalance('');
    setNewDebtRate('');
    setNewDebtPayment('');
  };

  const removeDebt = (id: number) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card className='md:max-w-[500px] max-w-[370px] '>
        <CardHeader>
          <CardTitle>Debt Payoff Calculator</CardTitle>
          <CardDescription>
            Plan your journey to becoming debt-free
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>Your Debts</Label>
            <div className='max-h-[200px] overflow-y-auto border rounded-md'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.name}</TableCell>
                      <TableCell>${debt.balance}</TableCell>
                      <TableCell>{debt.rate}%</TableCell>
                      <TableCell>${debt.payment}</TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={() => removeDebt(debt.id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className='grid grid-cols-2 gap-2 mt-2'>
              <Input
                placeholder='Name'
                value={newDebtName}
                onChange={(e) => setNewDebtName(e.target.value)}
                className='col-span-1'
              />
              <Input
                type='number'
                placeholder='Balance'
                value={newDebtBalance}
                onChange={(e) => setNewDebtBalance(e.target.value)}
              />
              <Input
                type='number'
                placeholder='Rate %'
                value={newDebtRate}
                onChange={(e) => setNewDebtRate(e.target.value)}
              />
              <Input
                type='number'
                placeholder='Payment'
                value={newDebtPayment}
                onChange={(e) => setNewDebtPayment(e.target.value)}
              />
            </div>
            <Button
              onClick={addDebt}
              className='w-full'>
              <Plus className='h-4 w-4 mr-2' /> Add Debt
            </Button>
          </div>

          <div className='space-y-2 pt-2'>
            <Label htmlFor='extra'>Extra Monthly Payment ($)</Label>
            <Input
              id='extra'
              type='number'
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
            />
          </div>

          <div className='space-y-2 pt-2'>
            <Label>Payoff Strategy</Label>
            <Select
              value={strategy}
              onValueChange={setStrategy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='avalanche'>
                  Debt Avalanche (Highest Interest First)
                </SelectItem>
                <SelectItem value='snowball'>
                  Debt Snowball (Lowest Balance First)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col items-start gap-2'>
          <div className='flex justify-between w-full'>
            <div>
              <p className='text-sm font-medium'>Total Debt:</p>
              <p className='text-xl font-bold'>${totalDebt}</p>
            </div>
            <div>
              <p className='text-sm font-medium'>Monthly Payment:</p>
              <p className='text-xl font-bold'>${totalMonthlyPayment}</p>
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div>
              <p className='text-sm font-medium'>Payoff Time:</p>
              <p className='text-xl font-bold text-primary'>
                {years > 0 ? `${years} year${years > 1 ? 's' : ''}` : ''}
                {remainingMonths > 0
                  ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
                  : ''}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium'>Total Interest:</p>
              <p className='text-xl font-bold text-rose-500'>
                ${totalInterest}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className='md:max-w-[500px] max-w-[370px] '>
        <CardHeader>
          <CardTitle>Debt Payoff Projection</CardTitle>
          <CardDescription>
            See how your debt will decrease over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                balance: {
                  label: 'Remaining Debt',
                  color: 'hsl(var(--chart-1))',
                },
                interest: {
                  label: 'Interest Paid',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className='h-[380px] md:max-w-[440px] max-w-[320px] mb-40'>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 12, left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                  domain={[0, Math.max(...chartData.map((d) => d.balance))]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey='balance'
                  type='monotone'
                  stroke='var(--color-balance)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='interest'
                  type='monotone'
                  stroke='var(--color-interest)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-muted-foreground'>
                Add debts to see projection
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className='text-sm text-muted-foreground'>
            {strategy === 'avalanche'
              ? 'Debt Avalanche: Paying highest interest debts first saves the most money'
              : 'Debt Snowball: Paying smallest debts first provides psychological wins'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
