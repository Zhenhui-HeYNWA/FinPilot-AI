import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/record';
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
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}

export function useGetRecordsByRange(filter: GetRecordsByRangeProps) {
  return useQuery({
    queryKey: ['records', filter],
    queryFn: () => api.getRecordsByRange(filter),
    enabled: !!filter.from && !!filter.to,
  });
}
