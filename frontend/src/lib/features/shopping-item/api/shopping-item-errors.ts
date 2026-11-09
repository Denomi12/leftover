import { ApiError, NETWORK_ERROR_STATUS } from '#lib/shared/lib/api.js';

const NETWORK_MESSAGE = 'Strežnik ni dosegljiv. Preveri povezavo in poskusi znova.';

export function mapUpdateShoppingItemError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Postavke ni bilo mogoče posodobiti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return NETWORK_MESSAGE;
    case 404:
      return 'Postavka ne obstaja več.';
    default:
      return 'Postavke ni bilo mogoče posodobiti. Poskusi znova.';
  }
}

export function mapSaveShoppingItemError(error: unknown, editing: boolean): string {
  const fallback = editing
    ? 'Postavke ni bilo mogoče shraniti. Poskusi znova.'
    : 'Postavke ni bilo mogoče dodati. Poskusi znova.';

  if (!(error instanceof ApiError)) return fallback;

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return NETWORK_MESSAGE;
    case 400:
      return 'Preveri vnesene podatke.';
    case 403:
      return editing ? 'Te postavke ne moreš urejati.' : 'Kot gost postavk ne moreš dodajati.';
    case 404:
      return editing
        ? 'Postavka ne obstaja več. Osveži stran.'
        : 'Gospodinjstvo ne obstaja ali vanj nimaš več dostopa.';
    default:
      return fallback;
  }
}

export function mapDeleteShoppingItemError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Postavke ni bilo mogoče odstraniti. Poskusi znova.';

  switch (error.status) {
    case NETWORK_ERROR_STATUS:
      return NETWORK_MESSAGE;
    case 403:
      return 'Te postavke ne moreš odstraniti.';
    case 404:
      return 'Postavka je že odstranjena.';
    default:
      return 'Postavke ni bilo mogoče odstraniti. Poskusi znova.';
  }
}
