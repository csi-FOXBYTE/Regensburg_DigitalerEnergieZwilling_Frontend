export type SubmissionResult = {
  id: string;
  ngsiData: Record<string, unknown>;
  raw: Record<string, unknown>;
  deletionLink: string;
  downloadLink?: string;
};

export async function deleteSubmission(deletionUrl: string): Promise<void> {
  const res = await fetch(deletionUrl, { method: 'DELETE' });
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
  return (await res.json()) as SubmissionResult;
}
