import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/record';


export function useCreateRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}
