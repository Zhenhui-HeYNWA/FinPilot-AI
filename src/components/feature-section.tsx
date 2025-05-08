import {
  BarChart3,
  BrainCircuit,
  CreditCard,
  LineChart,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';

export function FeatureSection() {
  return (
    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
      <div className='flex flex-col items-center text-center p-6 rounded-lg border bg-card'>
        <div className='rounded-full bg-primary/10 p-4 mb-4'>
          <BarChart3 className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-xl font-bold mb-2'>Smart Transaction Tracking</h3>
        <p className='text-muted-foreground'>
          Automatically categorize your transactions, easily track monthly
          income and expenses, and get a clear view of your financial situation.
        </p>
      </div>

      <div className='flex flex-col items-center text-center p-6 rounded-lg border bg-card'>
        <div className='rounded-full bg-primary/10 p-4 mb-4'>
          <BrainCircuit className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-xl font-bold mb-2'>AI Financial Insights</h3>
        <p className='text-muted-foreground'>
          Our AI analyzes your spending habits, provides personalized
          recommendations, and helps you discover saving opportunities and
          optimize financial decisions.
        </p>
      </div>

      <div className='flex flex-col items-center text-center p-6 rounded-lg border bg-card'>
        <div className='rounded-full bg-primary/10 p-4 mb-4'>
          <PiggyBank className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-xl font-bold mb-2'>Savings Goal Management</h3>
        <p className='text-muted-foreground'>
          Set and track your savings goals, and the app will automatically
          calculate the time needed and provide suggestions to achieve them.
        </p>
      </div>

      <div className='flex flex-col items-center text-center p-6 rounded-lg border bg-card'>
        <div className='rounded-full bg-primary/10 p-4 mb-4'>
          <LineChart className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-xl font-bold mb-2'>Visual Financial Reports</h3>
        <p className='text-muted-foreground'>
          Understand your financial trends through intuitive charts and reports,
          enabling you to make smarter financial decisions.
        </p>
      </div>

      <div className='flex flex-col items-center text-center p-6 rounded-lg border bg-card'>
        <div className='rounded-full bg-primary/10 p-4 mb-4'>
          <CreditCard className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-xl font-bold mb-2'>Multi-Account Management</h3>
        <p className='text-muted-foreground'>
          Easily manage multiple bank accounts, credit cards, and investments,
          viewing your complete financial picture in one place.
        </p>
      </div>

      <div className='flex flex-col items-center text-center p-6 rounded-lg border bg-card'>
        <div className='rounded-full bg-primary/10 p-4 mb-4'>
          <TrendingUp className='h-8 w-8 text-primary' />
        </div>
        <h3 className='text-xl font-bold mb-2'>Budget Planning & Alerts</h3>
        <p className='text-muted-foreground'>
          Create personalized budget plans, receive smart alerts to avoid
          overspending, and stay on track with your financial goals.
        </p>
      </div>
    </div>
  );
}
