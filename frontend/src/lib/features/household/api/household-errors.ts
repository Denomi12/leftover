import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

export function mapHouseholdError(error: unknown): string {
  if (error instanceof ApiError && error.status === NETWORK_ERROR_STATUS) {
    return 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';
  }
  if (error instanceof ApiError && error.status === 400) {
    return 'Preveri ime gospodinjstva.';
  }
  return 'Gospodinjstva ni bilo mogoče ustvariti. Poskusi znova.';
}
