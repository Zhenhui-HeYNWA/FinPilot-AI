import React from 'react';
import { Skeleton } from '../ui/skeleton';

const DataTableSkeleton = () => {
  return (
    <div>
      <Skeleton className='max-w-xl h-8' />
      <div className='flex gap-4 mt-2'>
        <Skeleton className='w-24 h-8' />
        <Skeleton className='w-20 h-8' />
        <Skeleton className='w-24 h-8' />
      </div>

      <div className='flex gap-4 mt-2'>
        <Skeleton className='w-full h-[30rem]' />
      </div>
    </div>
  );
};

export default DataTableSkeleton;
