export const toNumber = (value) => Number.parseFloat(value || 0);

export function calculateInvoice(items, gstEnabled, invoiceGstPercent = 0) {
  const subtotal = items.reduce((sum, item) => sum + toNumber(item.quantity) * toNumber(item.price), 0);
  const gstPercent = gstEnabled ? toNumber(invoiceGstPercent) : 0;
  const gstAmount = subtotal * (gstPercent / 100);
  const total = subtotal + gstAmount;

  const normalizedItems = items.map((item) => {
    const lineSubtotal = toNumber(item.quantity) * toNumber(item.price);
    const lineGstPercent = gstEnabled ? toNumber(item.gstPercent ?? gstPercent) : 0;
    const lineTotal = lineSubtotal + lineSubtotal * (lineGstPercent / 100);
    return {
      name: item.name,
      quantity: Number(item.quantity),
      unitPrice: toNumber(item.price),
      gstPercent: lineGstPercent,
      lineTotal
    };
  });

  return { subtotal, gstPercent, gstAmount, total, normalizedItems };
}

export function calculateRecoveryPrice(dataSizeGb) {
  const size = toNumber(dataSizeGb);
  if (size <= 32) return 2500;
  if (size <= 128) return 5000;
  if (size <= 512) return 9000;
  return 15000;
}
