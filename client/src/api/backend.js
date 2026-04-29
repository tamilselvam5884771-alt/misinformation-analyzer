const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function analyzeClaim(text) {
  const res = await fetch(`${BACKEND_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Backend error (${res.status}): ${errText || res.statusText}`);
  }

  return res.json();
}

