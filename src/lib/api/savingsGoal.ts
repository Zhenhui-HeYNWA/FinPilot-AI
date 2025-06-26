import { z } from 'zod';
import { savingsGoalSchema } from '../zod/validation';

export async function createSavingsGoal(
  data: z.infer<typeof savingsGoalSchema>
) {
  const res = await fetch('/api/savings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  console.log('Creating savings goal with data:', data);
  if (!res.ok) {
    throw new Error('Failed to create savings goal');
  }
  return res.json();
}

export async function getSavingsGoals() {
  const res = await fetch('/api/savings', {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch savings goals');
  }
  return res.json();
}

export async function updateSavingsGoal() {
  const res = await fetch('/api/savings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error('Failed to update savings goal');
  }
  return res.json();
}
