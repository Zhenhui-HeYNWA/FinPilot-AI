import { z } from 'zod';
import { formSchema } from '@/lib/zod/validation';

type GetRecordsByRangeProps = {
  from: string;
  to: string;
  typeOfRecord: 'income' | 'expense' | 'all';
  amountFrom: number;
  amountTo: number | 'any';
};

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

export async function updateRecord({
  data,
  recordId,
}: {
  data: z.infer<typeof formSchema>;
  recordId: string;
}) {
  const res = await fetch(`/api/records?recordId=${recordId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  console.log('Response status:', res.status);
  if (!res.ok) {
    const error = await res.text();
    console.error('API Error:', error);
    throw new Error('Failed to create record');
  }
  return res.json();
}

export async function deleteRecord(recordId: string) {
  const res = await fetch(`/api/records?recordId=${recordId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recordId }),
  });

  if (!res.ok) {
    throw new Error('Failed to delete record');
  }
  return res.json();
}

export async function getRecordsByRange({
  from,
  to,
  typeOfRecord = 'all',
  amountFrom = 0,
  amountTo = 'any',
}: GetRecordsByRangeProps) {
  const params = new URLSearchParams({
    from,
    to,
    typeOfRecord,
    amountFrom: String(amountFrom),
    amountTo: String(amountTo),
  });

  const res = await fetch(`/api/records/recordsHistory?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch records by range');
  }
  return res.json();
}
