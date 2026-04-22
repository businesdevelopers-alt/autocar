/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility for ZATCA (Saudi Arabia) E-Invoicing (Fatoora)
 * Complies with Phase 1 TLV requirements for QR codes.
 */

interface ZatcaTlvData {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  totalWithVat: string | number;
  vatAmount: string | number;
}

/**
 * Encodes data into ZATCA TLV format then base64
 */
export function generateZatcaTlv(data: ZatcaTlvData): string {
  const encoder = new TextEncoder();

  const getTlvRow = (tag: number, value: string | number) => {
    const valueString = String(value);
    const valueBuffer = encoder.encode(valueString);
    const tagBuffer = new Uint8Array([tag]);
    const lengthBuffer = new Uint8Array([valueBuffer.length]);
    
    const row = new Uint8Array(tagBuffer.length + lengthBuffer.length + valueBuffer.length);
    row.set(tagBuffer);
    row.set(lengthBuffer, tagBuffer.length);
    row.set(valueBuffer, tagBuffer.length + lengthBuffer.length);
    return row;
  };

  const p1 = getTlvRow(1, data.sellerName);
  const p2 = getTlvRow(2, data.vatNumber);
  const p3 = getTlvRow(3, data.timestamp);
  const p4 = getTlvRow(4, data.totalWithVat);
  const p5 = getTlvRow(5, data.vatAmount);

  const combinedTlv = new Uint8Array(p1.length + p2.length + p3.length + p4.length + p5.length);
  let offset = 0;
  [p1, p2, p3, p4, p5].forEach(p => {
    combinedTlv.set(p, offset);
    offset += p.length;
  });

  // Convert to base64
  let binary = '';
  const bytes = new Uint8Array(combinedTlv);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
