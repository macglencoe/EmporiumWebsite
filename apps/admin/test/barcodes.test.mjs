import assert from 'node:assert/strict';
import test from 'node:test';

import { barcodeIncludes, isMissingBarcode } from '../lib/barcodes.mjs';

test('database-normalized null barcodes are reported as missing', () => {
  assert.equal(isMissingBarcode(null), true);
  assert.equal(isMissingBarcode(undefined), true);
  assert.equal(isMissingBarcode(''), true);
  assert.equal(isMissingBarcode('   '), true);
  assert.equal(isMissingBarcode('012345'), false);
});

test('barcode searches ignore missing values and match populated values', () => {
  assert.equal(barcodeIncludes(null, '123'), false);
  assert.equal(barcodeIncludes('0012345', '123'), true);
  assert.equal(barcodeIncludes(12345, '234'), true);
});
