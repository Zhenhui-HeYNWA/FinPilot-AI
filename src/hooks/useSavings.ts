import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/savingsGoal';

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['savingsGoals'],
      });
    },
  });
}
export function useGetSavingsGoal() {
  return useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const res = await fetch('/api/savings');
      const savingsGoals = await res.json();
      return savingsGoals;
    },
  });
}
export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['savingsGoals'],
      });
    },
  });
}
