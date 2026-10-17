export const isMissingBarcode = (value) => value == null || String(value).trim() === '';

export const barcodeIncludes = (value, search) => (
  !isMissingBarcode(value) && String(value).includes(String(search ?? ''))
);
