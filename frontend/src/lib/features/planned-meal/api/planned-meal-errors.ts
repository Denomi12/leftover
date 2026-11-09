import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

export function mapCreatePlannedMealError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Obroka ni bilo mogoče shraniti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';
    case 400:
      return 'Preveri vnesene podatke.';
    case 403:
      return 'Kot gost obrokov ne moreš načrtovati.';
    case 404:
      return 'Gospodinjstvo ne obstaja ali vanj nimaš več dostopa.';
    default:
      return 'Obroka ni bilo mogoče shraniti. Poskusi znova.';
  }
}
