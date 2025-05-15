import { z } from 'zod';

export const formSchema = z.object({
  recordType: z.enum(['income', 'expense']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
});
