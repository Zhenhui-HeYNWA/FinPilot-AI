import { z } from 'zod';

export const recordFormSchema = z.object({
  recordType: z.enum(['income', 'expense']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
});

export const savingsGoalSchema = z.object({
  savingsGoalName: z.string(),
  targetAmount: z.coerce.number().min(1, 'Goal amount must be greater than 0'),
  currentAmount: z.coerce.number().min(0, 'Initial savings must be at least 0'),
  monthlyContribution: z.coerce
    .number()
    .min(1, 'Monthly contribution must be greater than 0'),
  annualInterestRate: z.coerce
    .number()
    .min(0, 'Interest rate must be at least 0'),
  note: z.string().max(500, 'Note is too long').optional(),
});
