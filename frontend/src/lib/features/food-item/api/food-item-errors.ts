import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

const NETWORK_MESSAGE = 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';

export function mapSaveFoodItemError(error: unknown, editing: boolean): string {
  const fallback = editing
    ? 'Živila ni bilo mogoče shraniti. Poskusi znova.'
    : 'Živila ni bilo mogoče dodati. Poskusi znova.';

  if (!(error instanceof ApiError)) return fallback;

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return NETWORK_MESSAGE;
    case 400:
      return error.message.includes('maximum')
        ? 'Skupna količina živila bi bila prevelika.'
        : 'Preveri vnesene podatke.';
    case 403:
      return editing ? 'Kot gost živil ne moreš urejati.' : 'Kot gost živil ne moreš dodajati.';
    case 404:
      return editing
        ? 'Živilo ne obstaja več. Osveži stran.'
        : 'Gospodinjstvo ne obstaja ali vanj nimaš več dostopa.';
    default:
      return fallback;
  }
}

export function mapDeleteFoodItemError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Živila ni bilo mogoče odstraniti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return NETWORK_MESSAGE;
    case 403:
      return 'Kot gost živil ne moreš odstranjevati.';
    case 404:
      return 'Živilo je že odstranjeno.';
    default:
      return 'Živila ni bilo mogoče odstraniti. Poskusi znova.';
  }
}
