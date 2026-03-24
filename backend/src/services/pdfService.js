import PDFDocument from 'pdfkit';

export function generateInvoicePdf(invoice) {
  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];

  return new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text(invoice.businessName, { align: 'center' });
    doc.fontSize(10).text(invoice.businessAddr, { align: 'center' });
    if (invoice.gstin) doc.text(`GSTIN: ${invoice.gstin}`, { align: 'center' });

    doc.moveDown();
    doc.text(`Invoice #${invoice.invoiceNumber}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${invoice.customer.name} (${invoice.customer.phone})`);

    doc.moveDown().fontSize(12);
    invoice.items.forEach((item) => {
      doc.text(`${item.name} | Qty ${item.quantity} | ₹${item.unitPrice} | GST ${item.gstPercent}% | ₹${item.lineTotal}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${invoice.subtotal}`);
    doc.text(`GST: ₹${invoice.gstAmount}`);
    doc.fontSize(14).text(`Total: ₹${invoice.total}`);

    doc.end();
  });
}
