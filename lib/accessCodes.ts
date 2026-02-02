export type AccessCodeRecord = {
  code: string;
  status: 'active' | 'disabled';
  usageLimit?: number;
  usageCount?: number;
  expiresAt?: string;
  createdAt?: string;
};

const inMemoryCodes: AccessCodeRecord[] = [
  {
    code: 'PLANNER2024',
    status: 'active',
    usageLimit: 100,
    usageCount: 0,
    createdAt: new Date().toISOString()
  }
];

export function getAccessCodes(): AccessCodeRecord[] {
  const envCodes = process.env.ACCESS_CODES;
  if (envCodes) {
    return envCodes.split(',').map((code) => ({
      code: code.trim(),
      status: 'active'
    }));
  }
  return inMemoryCodes;
}

export function validateAccessCode(code: string) {
  const normalized = code.trim();
  const record = getAccessCodes().find((entry) => entry.code === normalized);
  if (!record) {
    return { valid: false, reason: 'Invalid code. Please try again.' };
  }
  if (record.status !== 'active') {
    return { valid: false, reason: 'This code is disabled.' };
  }
  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
    return { valid: false, reason: 'This code has expired.' };
  }
  if (record.usageLimit && record.usageCount && record.usageCount >= record.usageLimit) {
    return { valid: false, reason: 'This code has reached its usage limit.' };
  }
  return { valid: true, record };
}
