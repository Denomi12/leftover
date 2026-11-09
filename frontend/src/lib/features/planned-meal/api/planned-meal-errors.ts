import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

export function mapSavePlannedMealError(error: unknown, editing: boolean): string {
  const fallback = 'Obroka ni bilo mogoče shraniti. Poskusi znova.';
  if (!(error instanceof ApiError)) return fallback;

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';
    case 400:
      return 'Preveri vnesene podatke.';
    case 403:
      return editing
        ? 'Kot gost obrokov ne moreš urejati.'
        : 'Kot gost obrokov ne moreš načrtovati.';
    case 404:
      return editing
        ? 'Obrok ne obstaja več. Osveži stran.'
        : 'Gospodinjstvo ne obstaja ali vanj nimaš več dostopa.';
    case 409:
      return 'Pripravljenega obroka ni mogoče urejati.';
    default:
      return fallback;
  }
}

export function mapDeletePlannedMealError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Obroka ni bilo mogoče odstraniti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';
    case 403:
      return 'Kot gost obrokov ne moreš odstranjevati.';
    case 404:
      return 'Obrok ne obstaja več.';
    default:
      return 'Obroka ni bilo mogoče odstraniti. Poskusi znova.';
  }
}

export function mapCompletePlannedMealError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Obroka ni bilo mogoče označiti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';
    case 403:
      return 'Kot gost obrokov ne moreš označiti kot pripravljenih.';
    case 404:
      return 'Obrok ne obstaja več.';
    case 409:
      return 'Obrok je že označen kot pripravljen.';
    default:
      return 'Obroka ni bilo mogoče označiti. Poskusi znova.';
  }
}
