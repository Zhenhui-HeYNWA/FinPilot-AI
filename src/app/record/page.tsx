'use client';
import React from 'react';

import AddNewRecord from '@/components/AddNewRecord';
import DashboardPage from '@/components/DashboardPage';
import RecordChart from '@/components/RecordChart';
import GenerateMockButton from '@/components/ui/generateMockButton';
import RecentRecords from '@/components/recordTable/RecentRecords';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Savings from '../savings/page';

const Record = () => {
  return (
    <div className='flex flex-col items-center justify-between px-10 py-5 md:py-20 md:px-40 gap-12'>
      <DashboardPage />

      <Tabs
        defaultValue='account'
        className='w-full'>
        <TabsList className='grid grid-cols-2'>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>

        <TabsContent value='account'>
          <div className='w-full flex flex-col md:flex-row  gap-4'>
            <AddNewRecord />
            <RecentRecords />
          </div>
        </TabsContent>
        <TabsContent
          value='password'
          className='h-[30rem]'>
          <Savings />
        </TabsContent>
      </Tabs>

      <div className='w-full flex flex-col md:flex-row  gap-4'>
        <RecordChart />

        {/* <GenerateMockButton clerkId='user_2wwCzlxRjBcJf0KvPU9jP0E5hpl' /> */}
      </div>
    </div>
  );
};

export default Record;
