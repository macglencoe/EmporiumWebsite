import assert from "node:assert/strict";
import test from "node:test";

import { compareBarcodes, isBarcodeMissing, normalizeBarcode } from "./barcode.mjs";

for (const barcode of [null, undefined, ""]) {
    test(`treats ${String(barcode)} as a missing barcode`, () => {
        assert.equal(isBarcodeMissing(barcode), true);
        assert.equal(normalizeBarcode(barcode), "");
    });
}

for (const [barcode, expected] of [
    ["7460644702532", "7460644702532"],
    [7460644702532, "7460644702532"],
    [0, "0"],
]) {
    test(`normalizes barcode ${barcode}`, () => {
        assert.equal(isBarcodeMissing(barcode), false);
        assert.equal(normalizeBarcode(barcode), expected);
    });
}

test("matches a complete or partial barcode", () => {
    assert.deepEqual(compareBarcodes("7460644702532", "7460644702532"), {
        exact: true,
        includes: true,
    });
    assert.deepEqual(compareBarcodes("7460644702532", "4702532"), {
        exact: false,
        includes: true,
    });
});

for (const barcode of [null, undefined, ""]) {
    test(`does not match a missing barcode value of ${String(barcode)}`, () => {
        assert.deepEqual(compareBarcodes(barcode, "7460644702532"), {
            exact: false,
            includes: false,
        });
    });
}

for (const search of [null, undefined, ""]) {
    test(`does not match a missing search value of ${String(search)}`, () => {
        assert.deepEqual(compareBarcodes("7460644702532", search), {
            exact: false,
            includes: false,
        });
    });
}
