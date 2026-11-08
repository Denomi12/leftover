import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

export interface AuthErrorResult {
  field?: 'email';
  message: string;
}

export function mapAuthError(error: unknown): AuthErrorResult {
  if (!(error instanceof ApiError)) {
    return { message: 'Prišlo je do napake. Poskusi znova.' };
  }

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return { message: 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.' };
    case 400:
      return { message: 'Preveri vnesene podatke.' };
    case 401:
      return { message: 'Napačen e-naslov ali geslo.' };
    case 409:
      return {
        field: 'email',
        message: 'Račun s tem e-naslovom že obstaja. Poskusi se prijaviti.',
      };
    default:
      return { message: 'Prišlo je do napake. Poskusi znova.' };
  }
}
