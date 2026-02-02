'use client';

import { useState } from 'react';

export default function AccessCodeForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const payload = await response.json();
        setError(payload.error ?? 'Unable to validate code.');
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold">Enter Access Code</h1>
      <p className="mt-2 text-sm text-slate-600">
        This studio is gated. Enter your access code to continue.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-slate-400 focus:outline-none"
          placeholder="Access code"
          required
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          disabled={loading}
        >
          {loading ? 'Validating…' : 'Unlock studio'}
        </button>
      </form>
    </div>
  );
}
