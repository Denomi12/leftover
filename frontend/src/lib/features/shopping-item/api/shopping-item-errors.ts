import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

export function mapUpdateShoppingItemError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Postavke ni bilo mogoče posodobiti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';
    case 404:
      return 'Postavka ne obstaja več.';
    default:
      return 'Postavke ni bilo mogoče posodobiti. Poskusi znova.';
  }
}
