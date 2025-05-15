export async function getIncome() {
  const res = await fetch('/api/income/total');
  if (!res.ok) throw new Error('Failed to fetch records');
  const data = await res.json();
  console.log('data', data);
  return data.totalIncome;
}
