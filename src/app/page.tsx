import Link from 'next/link';
import { ArrowRight, PiggyBank } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroSection } from '@/components/hero-section';
import { FeatureSection } from '@/components/feature-section';
import { ExpenseCalculator } from '@/components/expense-calculator';
import { AIInsightDemo } from '@/components/ai-insight-demo';
import { SavingsCalculator } from '@/components/savings-calculator';
import { BudgetPlanner } from '@/components/budget-planner';
import { DebtPayoffCalculator } from '@/components/debt-payoff-calculator';

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col '>
      {/* 导航栏 */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <PiggyBank className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold'>Finpilot</span>
          </div>
          <nav className='hidden md:flex gap-6'>
            <Link
              href='#features'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Features
            </Link>
            <Link
              href='#demo'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Demo
            </Link>
            <Link
              href='#explore'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Explore
            </Link>
          </nav>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              asChild>
              <Link href='/login'>Login</Link>
            </Button>
            <Button
              size='sm'
              asChild>
              <Link href='/register'>Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1'>
        {/* Hero 部分 */}
        <HeroSection />

        {/* 功能介绍部分 */}
        <section
          id='features'
          className='container py-20'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
              Manage Your Finances Intelligently
            </h2>
            <p className='mt-4 text-xl text-muted-foreground max-w-3xl mx-auto'>
              Our AI-powered app helps you easily track income and expenses,
              analyze spending habits, and get personalized financial advice
            </p>
          </div>
          <FeatureSection />
        </section>

        {/* 互动演示部分 */}
        <section
          id='demo'
          className='bg-muted/50 py-20'>
          <div className='container'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Experience Smart Financial Management
              </h2>
              <p className='mt-4 text-xl text-muted-foreground max-w-3xl mx-auto'>
                Try our interactive demos to see how AI can analyze your
                financial situation
              </p>
            </div>

            <Tabs
              defaultValue='calculator'
              className='max-w-5xl mx-auto'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='calculator'>Expense Calculator</TabsTrigger>
                <TabsTrigger value='ai-insights'>AI Insights Demo</TabsTrigger>
              </TabsList>
              <TabsContent value='calculator'>
                <ExpenseCalculator />
              </TabsContent>
              <TabsContent value='ai-insights'>
                <AIInsightDemo />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* 价格部分 */}
        <section
          id='explore'
          className='bg-muted/50 py-20'>
          <div className='container'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Interactive Financial Tools
              </h2>
              <p className='mt-4 text-xl text-muted-foreground max-w-3xl mx-auto'>
                Try our interactive tools to help you plan and manage your
                finances
              </p>
            </div>

            <Tabs
              defaultValue='savings'
              className='max-w-5xl mx-auto'>
              <TabsList className='grid w-full grid-cols-3 p-0'>
                <TabsTrigger value='savings'>Savings Goal</TabsTrigger>
                <TabsTrigger value='budget'>Budget Planner</TabsTrigger>
                <TabsTrigger value='debt'>Debt Payoff</TabsTrigger>
              </TabsList>
              <TabsContent value='savings'>
                <SavingsCalculator />
              </TabsContent>
              <TabsContent value='budget'>
                <BudgetPlanner />
              </TabsContent>
              <TabsContent value='debt'>
                <DebtPayoffCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA部分 */}
        <section className='container py-20'>
          <div className='rounded-lg bg-primary/10 p-8 md:p-12 lg:p-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
              Start Managing Your Finances With Finpilot
            </h2>
            <p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
              Join thousands of users who use Finpilot to take control of their
              finances and achieve their financial goals.
            </p>
            <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                asChild>
                <Link href='/register'>
                  Get Started Free
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild>
                <Link href='/demo'>View Full Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className='border-t py-12'>
        <div className='container grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <PiggyBank className='h-6 w-6 text-primary' />
              <span className='text-xl font-bold'>Finpilot</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Intelligent AI financial management app helping you control your
              finances and achieve your goals.
            </p>
          </div>
          <div>
            <h3 className='font-medium mb-4'>Product</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-medium mb-4'>Resources</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-medium mb-4'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='container mt-8 pt-8 border-t'>
          <p className='text-center text-sm text-muted-foreground'>
            © 2025 Finpilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// https://v0.dev/chat/personal-expense-analyzer-WKIZxgU9BrN
