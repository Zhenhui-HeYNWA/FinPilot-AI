export async function getExpense() {
  const res = await fetch('/api/expense/total');
  if (!res.ok) throw new Error('Failed to fetch records');
  const data = await res.json();
  console.log('data', data);
  return data.totalExpense;
}
