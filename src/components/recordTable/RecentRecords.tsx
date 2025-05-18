import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useGetRecordsByRange } from '@/hooks/useRecord';
import { DataTable } from './data-table';
import { columns } from './columns';

import DataTableSkeleton from '../skeleton/dataTableSkeleton';

const RecentRecords = () => {
  const { data: RecordData, isLoading } = useGetRecordsByRange({
    from: '2025-05',
    to: '2025-05',
    typeOfRecord: 'all',
    amountFrom: 0,
    amountTo: 0,
  });

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Recent Records</CardTitle>
        <CardDescription>
          You have {RecordData?.data?.length} records.
        </CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        {isLoading ? (
          <div>
            <DataTableSkeleton />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={RecordData.data}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRecords;
