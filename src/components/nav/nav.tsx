'use client';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { PiggyBank } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const Nav = () => {
  return (
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
          <SignedOut>
            <SignInButton mode='modal'>
              <Button
                variant='ghost'
                size='sm'
                asChild>
                <span>Login</span>
              </Button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <Button
                size='sm'
                asChild>
                <span>Sign Up Free</span>
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Nav;
