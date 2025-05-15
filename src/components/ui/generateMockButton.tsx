'use client';

import { useState } from 'react';

export default function GenerateMockButton({ clerkId }: { clerkId: string }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
      } else {
        console.error(data.error);
        alert('Failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className='px-4 py-2 bg-blue-600 text-white rounded'>
      {loading ? 'Generating...' : 'Generate Mock Data'}
    </button>
  );
}
