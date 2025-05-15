'use client';
import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import AddNewRecord from '@/components/AddNewRecord';
import DashboardPage from '@/components/DashboardPage';
import RecordChart from '@/components/RecordChart';
import GenerateMockButton from '@/components/ui/generateMockButton';

const Record = () => {
  return (
    <div className='flex flex-col items-center justify-between px-10 py-5 md:py-20 md:px-40 gap-12'>
      <DashboardPage />

      <div className='w-full flex flex-col md:flex-row  gap-4'>
        <RecordChart />
        <AddNewRecord />
        {/* <GenerateMockButton clerkId='user_2wwCzlxRjBcJf0KvPU9jP0E5hpl' /> */}
      </div>
    </div>
  );
};

export default Record;
