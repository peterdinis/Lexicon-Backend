import { randomBytes } from 'crypto';

export function generateRandomToken(length = 16): string {
  return randomBytes(length).toString('hex');
}
