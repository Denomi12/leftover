import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

const NETWORK_MESSAGE = 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';

export interface InviteErrorResult {
  field?: 'email';
  message: string;
}

export function mapInviteError(error: unknown): InviteErrorResult {
  if (!(error instanceof ApiError)) {
    return { message: 'Povabila ni bilo mogoče poslati. Poskusi znova.' };
  }

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return { message: NETWORK_MESSAGE };
    case 400:
      return { message: 'Preveri vnesene podatke.' };
    case 403:
      return { message: 'Nove člane lahko vabi samo lastnik gospodinjstva.' };
    case 404:
      return { field: 'email', message: 'Uporabnik s tem e-naslovom ne obstaja.' };
    case 409:
      return {
        field: 'email',
        message: error.message.includes('already a member')
          ? 'Uporabnik je že član gospodinjstva.'
          : 'Uporabnik že ima povabilo v to gospodinjstvo.',
      };
    default:
      return { message: 'Povabila ni bilo mogoče poslati. Poskusi znova.' };
  }
}

export function mapInvitationResponseError(error: unknown): string {
  if (error instanceof ApiError && error.status === NETWORK_ERROR_STATUS) {
    return NETWORK_MESSAGE;
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'Povabilo ni več veljavno.';
  }
  return 'Odgovora ni bilo mogoče poslati. Poskusi znova.';
}
