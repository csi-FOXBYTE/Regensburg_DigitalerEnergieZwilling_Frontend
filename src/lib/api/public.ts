export type SubmissionResult = {
  deletionToken: string;
};

export type FeedbackCategory = 'bug' | 'feedback' | 'suggestion';

export type FeedbackInput = {
  category: FeedbackCategory;
  message: string;
  emailAddress?: string;
};

export class SubmissionUnavailableError extends Error {
  constructor() {
    super('Submission unavailable');
    this.name = 'SubmissionUnavailableError';
  }
}

function submissionUrl(token: string, suffix = ''): string {
  return `/api/public/submissions/${encodeURIComponent(token)}${suffix}`;
}

export async function checkSubmissionAvailability(
  token: string,
): Promise<void> {
  const res = await fetch(submissionUrl(token, '/status'), {
    method: 'GET',
    cache: 'no-store',
  });
  if (res.status === 404) throw new SubmissionUnavailableError();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const result = (await res.json()) as { available?: unknown };
  if (result.available !== true) throw new Error('Malformed status response');
}

export async function deleteSubmission(token: string): Promise<void> {
  const res = await fetch(submissionUrl(token), {
    method: 'DELETE',
    cache: 'no-store',
  });
  if (res.status === 404) throw new SubmissionUnavailableError();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const result = (await res.json()) as { success?: unknown };
  if (result.success !== true) throw new Error('Malformed deletion response');
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
  const result = (await res.json()) as Partial<SubmissionResult>;
  if (
    typeof result.deletionToken !== 'string' ||
    result.deletionToken.length === 0
  ) {
    throw new Error('Malformed submission response');
  }
  return { deletionToken: result.deletionToken };
}

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  const emailAddress = input.emailAddress?.trim();
  const body = {
    category: input.category,
    message: input.message,
    ...(emailAddress ? { emailAddress } : {}),
  };

  const res = await fetch('/api/public/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
