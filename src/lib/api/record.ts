import { z } from 'zod';
import { formSchema } from '@/lib/zod/validation';

export async function getRecords() {
  const res = await fetch('/api/records');
  if (!res.ok) throw new Error('Failed to fetch records');
  return res.json();
}

export async function createRecord(data: z.infer<typeof formSchema>) {
  const res = await fetch('/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create record');
  }
  return res.json();
}
