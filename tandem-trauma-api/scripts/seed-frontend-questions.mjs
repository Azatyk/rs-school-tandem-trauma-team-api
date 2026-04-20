const baseUrl = process.env.SEED_BASE_URL ?? 'http://localhost:3000';
const perTopic = Number(process.env.PER_TOPIC ?? '3');

const url = new URL('/seed/frontend-questions', baseUrl);
url.searchParams.set('perTopic', String(Number.isFinite(perTopic) && perTopic > 0 ? perTopic : 3));

const res = await fetch(url, { method: 'POST' });
const text = await res.text();

if (!res.ok) {
  console.error(`Seed request failed: ${res.status} ${res.statusText}`);
  console.error(text);
  process.exit(1);
}

console.log(text);
