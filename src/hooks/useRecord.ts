import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/record';

import toast from 'react-hot-toast';
type GetRecordsByRangeProps = {
  from: string;
  to: string;
  typeOfRecord: 'income' | 'expense' | 'all';
  amountFrom: number;
  amountTo: number | 'any';
};
export function useCreateRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['records'],
      });
    },
  });
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['incomeByRange'] });
      queryClient.invalidateQueries({ queryKey: ['expenseByRange'] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expense'] });
      toast.success('Record Update Successfully');
      console.log('Update success', data);
    },
    onError: (error) => {
      toast.error('update filed');
      console.log('Update success', error);
    },
  });

  // const mutation = useMutation({
  //   mutationFn: api.updateRecord,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['records'] });
  //     queryClient.invalidateQueries({ queryKey: ['incomeByRange'] });
  //     queryClient.invalidateQueries({ queryKey: ['expenseByRange'] });
  //     queryClient.invalidateQueries({ queryKey: ['income'] });
  //     queryClient.invalidateQueries({ queryKey: ['expense'] });
  //   },
  // });

  // return {
  //   updateRecord: mutation.mutate,
  //   isPending: mutation.isPending, // 或 mutation.isLoading
  // };
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['incomeByRange'] });
      queryClient.invalidateQueries({ queryKey: ['expenseByRange'] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expense'] });
    },
  });

  return {
    deleteRecord: mutation.mutate,
    isPending: mutation.isPending, // 或 mutation.isLoading
  };
}

export function useGetRecordsByRange(filter: GetRecordsByRangeProps) {
  return useQuery({
    queryKey: ['records', filter],
    queryFn: () => api.getRecordsByRange(filter),
    enabled: !!filter.from && !!filter.to,
  });
}
