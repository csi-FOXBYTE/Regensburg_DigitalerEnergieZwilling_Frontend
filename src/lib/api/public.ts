export type SubmissionResult = {
  id: string;
  ngsiData: Record<string, unknown>;
  raw: Record<string, unknown>;
  deletionLink: string;
};

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `${window.location.protocol}//${url}`;
  }
  return url;
}

export async function deleteSubmission(deletionUrl: string): Promise<void> {
  const res = await fetch(normalizeUrl(deletionUrl), { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function submitEnergyData(params: {
  input: unknown;
  configName?: string;
  buildingId: string;
  address: string;
  longitude: number;
  latitude: number;
}): Promise<SubmissionResult> {
  const res = await fetch('/api/public/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const result = (await res.json()) as SubmissionResult;
  result.deletionLink = normalizeUrl(result.deletionLink);
  return result;
}
