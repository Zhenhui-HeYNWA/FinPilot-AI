import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32'>
      <div className='container flex flex-col items-center justify-center gap-4 text-center'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
            Manage Your Personal Finances
            <br className='hidden sm:inline' />
            with <span className='text-primary'>Finpilot</span>
          </h1>
          <p className='mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl'>
            Easily track income and expenses, get AI-driven financial insights,
            and achieve your savings goals
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 min-[400px]:w-full min-[400px]:max-w-[400px] justify-center sm:min-w-[400px] sm:max-w-[400px] sm:max-w-none'>
          <Button
            size='lg'
            asChild>
            <Link href='/'>
              Get Started Free
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button
            size='lg'
            variant='outline'
            asChild>
            <Link href='#features'>Learn More</Link>
          </Button>
        </div>
      </div>

      <div className='relative mt-16'>
        {/* <div className='overflow-hidden rounded-t-lg shadow-xl mx-auto max-w-6xl'>
          <Image
            src='/placeholder.svg?height=600&width=1200'
            width={1200}
            height={600}
            alt='FinanceAI Dashboard'
            className='w-full object-cover'
          />
        </div> */}
        <div className='absolute inset-0 bg-gradient-to-t from-background to-transparent h-24 bottom-0 top-auto'></div>
      </div>
    </section>
  );
}
