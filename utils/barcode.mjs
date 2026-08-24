export const normalizeBarcode = (barcode) => {
    if (barcode === null || barcode === undefined) {
        return "";
    }

    return String(barcode);
}

export const isBarcodeMissing = (barcode) => normalizeBarcode(barcode) === "";

export const compareBarcodes = (barcode, search) => {
    const normalizedBarcode = normalizeBarcode(barcode);
    const normalizedSearch = normalizeBarcode(search);
    const canCompare = normalizedBarcode !== "" && normalizedSearch !== "";

    return {
        exact: canCompare && normalizedBarcode === normalizedSearch,
        includes: canCompare && normalizedBarcode.includes(normalizedSearch),
    };
}
