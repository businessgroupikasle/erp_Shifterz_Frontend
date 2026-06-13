"use client";

import { X, Printer } from "lucide-react";

interface DocumentPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    docNo: string;
    type: string;
    client: string;
    phone: string;
    vehicle: string;
    service: string;
    base: string;
    gst: string;
    total: string;
    date: string;
    due: string;
    gstNumber?: string;
  };
}

export default function DocumentPreviewDialog({
  isOpen,
  onClose,
  document,
}: DocumentPreviewDialogProps) {
  if (!isOpen || !document) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=900,width=900");
    if (printWindow) {
      const docHtml = document.docNo.startsWith("INV") ? "invoice" : "document";
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${document.docNo}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              .document {
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
              }
              .header {
                background: #FACC15;
                color: black;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              }
              .header-left h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .header-left p {
                margin: 4px 0;
                font-size: 12px;
              }
              .header-right {
                text-align: right;
              }
              .header-right h2 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
              }
              .header-right p {
                margin: 4px 0;
                font-size: 12px;
              }
              .content {
                padding: 24px;
              }
              .section {
                margin-bottom: 24px;
              }
              .section-title {
                font-size: 11px;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
              }
              .bill-to {
                display: flex;
                justify-content: space-between;
              }
              .bill-to-left h3 {
                margin: 0 0 4px 0;
                font-size: 16px;
                font-weight: bold;
              }
              .bill-to-left p {
                margin: 2px 0;
                font-size: 14px;
              }
              .bill-to-right {
                text-align: right;
              }
              .bill-to-right p {
                margin: 2px 0;
                font-size: 14px;
              }
              .description {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .description th {
                background: #f5f5f5;
                padding: 8px;
                text-align: left;
                font-size: 12px;
                color: #999;
                text-transform: uppercase;
                border-bottom: 1px solid #ddd;
              }
              .description td {
                padding: 12px 8px;
                border-bottom: 1px solid #eee;
              }
              .description tr:last-child td {
                border-bottom: none;
              }
              .amount {
                text-align: right;
              }
              .total-row {
                background: #FFFACD;
                font-weight: bold;
                font-size: 16px;
              }
              .gst-row {
                background: #f9f9f9;
              }
              .footer {
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #ddd;
                text-align: center;
              }
              .footer p {
                margin: 4px 0;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="document">
              <div class="header">
                <div class="header-left">
                  <h1>SHIFTERZ</h1>
                  <p>42, Race Course Rd, Coimbatore - 641018</p>
                </div>
                <div class="header-right">
                  <h2>INVOICE</h2>
                  <p>${document.docNo}</p>
                </div>
              </div>

              <div class="content">
                <div class="bill-to">
                  <div class="bill-to-left">
                    <div class="section-title">Bill To</div>
                    <h3>${document.client}</h3>
                    <p>${document.phone}</p>
                    <p>${document.vehicle}</p>
                  </div>
                  <div class="bill-to-right">
                    <div class="section-title">Details</div>
                    <p><strong>Date:</strong> ${document.date}</p>
                    <p><strong>Due:</strong> ${document.due}</p>
                    ${document.gstNumber ? `<p><strong>Client GSTIN:</strong> ${document.gstNumber}</p>` : ''}
                    <p><strong>Our GSTIN:</strong> 33AAAAAO000A1Z5</p>
                  </div>
                </div>

                <table class="description">
                  <thead>
                    <tr>
                      <th>DESCRIPTION</th>
                      <th class="amount">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${document.service}</td>
                      <td class="amount">${document.base}</td>
                    </tr>
                    <tr class="gst-row">
                      <td>GST (18%)</td>
                      <td class="amount">${document.gst}</td>
                    </tr>
                    <tr class="total-row">
                      <td>TOTAL</td>
                      <td class="amount">${document.total}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="footer">
                  <p>Thank you for choosing Shifterz!</p>
                  <p>0422-123 4567</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const baseAmount = parseFloat(
    document.base.replace("₹", "").replace(",", "")
  );
  const gstAmount = parseFloat(document.gst.replace("₹", "").replace(",", ""));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Document Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-400 text-gray-900 px-8 py-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1">SHIFTERZ</h1>
              <p className="text-sm">42, Race Course Rd, Coimbatore - 641018</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-1">INVOICE</h2>
              <p className="text-sm">{document.docNo}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Bill To & Details */}
            <div className="flex justify-between mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Bill To
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {document.client}
                </h3>
                <p className="text-sm text-gray-600">{document.phone}</p>
                <p className="text-sm text-gray-600">{document.vehicle}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Details
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Date:</span> {document.date}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Due:</span> {document.due}
                </p>
                {document.gstNumber && (
                  <p className="text-sm">
                    <span className="font-semibold">Client GSTIN:</span> {document.gstNumber}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Our GSTIN:</span> 33AAAAAO000A1Z5
                </p>
              </div>
            </div>

            {/* Description Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-4 text-gray-900">{document.service}</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-semibold">
                    {document.base}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-4 py-4 text-gray-900">GST (18%)</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-semibold">
                    {document.gst}
                  </td>
                </tr>
                <tr className="bg-yellow-100">
                  <td className="px-4 py-4 font-bold text-gray-900 uppercase">
                    Total
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-yellow-600 text-lg">
                    {document.total}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">
                Thank you for choosing Shifterz!
              </p>
              <p className="text-sm text-gray-600">0422-123 4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
