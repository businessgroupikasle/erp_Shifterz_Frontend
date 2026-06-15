"use client";

import { X, Printer } from "lucide-react";

interface PaymentReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: {
    id: string;
    invoiceRef: string;
    client: string;
    phone?: string;
    vehicle?: string;
    service?: string;
    amount: string;
    mode: string;
    date: string;
    reference: string;
    notes?: string;
  };
}

export default function PaymentReceiptDialog({
  isOpen,
  onClose,
  payment,
}: PaymentReceiptDialogProps) {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=900,width=900");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${payment.id}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              .receipt {
                max-width: 600px;
                margin: 0 auto;
              }
              .header {
                background: #FACC15;
                color: black;
                padding: 24px;
                text-align: center;
                border-radius: 8px;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .header p {
                margin: 4px 0;
                font-size: 12px;
              }
              .content {
                background: white;
                border: 1px solid #FACC15;
                border-top: none;
                padding: 24px;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
              }
              .row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #f0f0f0;
              }
              .row:last-child {
                border-bottom: none;
              }
              .label {
                color: #999;
                font-size: 12px;
                text-transform: uppercase;
              }
              .value {
                font-weight: bold;
                font-size: 14px;
                color: #333;
              }
              .footer {
                text-align: center;
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #ddd;
              }
              .footer p {
                margin: 4px 0;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>SHIFTERZ</h1>
                <p>PAYMENT RECEIPT</p>
                <p>${payment.id}</p>
              </div>

              <div class="content">
                <div class="row">
                  <span class="label">Client</span>
                  <span class="value">${payment.client}</span>
                </div>
                <div class="row">
                  <span class="label">Invoice</span>
                  <span class="value">${payment.invoiceRef}</span>
                </div>
                <div class="row">
                  <span class="label">Amount</span>
                  <span class="value">${payment.amount}</span>
                </div>
                <div class="row">
                  <span class="label">Mode</span>
                  <span class="value">${payment.mode}</span>
                </div>
                <div class="row">
                  <span class="label">Date</span>
                  <span class="value">${payment.date}</span>
                </div>
                <div class="row">
                  <span class="label">Reference</span>
                  <span class="value">${payment.reference}</span>
                </div>
              </div>

              <div class="footer">
                <p>Thank you!</p>
                <p>0422-123 4567</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
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

        {/* Receipt Preview */}
        <div className="border-4 border-yellow-400 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-400 text-gray-900 px-8 py-6 text-center">
            <h1 className="text-3xl font-bold mb-2">SHIFTERZ</h1>
            <h2 className="text-xl font-bold mb-1">PAYMENT RECEIPT</h2>
            <p className="text-sm text-red-600">{payment.id}</p>
          </div>

          {/* Content */}
          <div className="bg-white px-8 py-6 space-y-4">
            {/* Client & Contact Info Header */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Client Name</p>
                  <p className="text-xl font-bold text-gray-900">{payment.client}</p>
                </div>
                <div className="text-right">
                  {payment.phone && (
                    <>
                      <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{payment.phone}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm text-gray-500">Invoice ID</span>
              <span className="font-semibold text-yellow-600">{payment.invoiceRef}</span>
            </div>

            {payment.vehicle && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Vehicle</span>
                <span className="font-semibold text-gray-900">{payment.vehicle}</span>
              </div>
            )}

            {payment.service && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Service</span>
                <span className="font-semibold text-gray-900">{payment.service}</span>
              </div>
            )}

            {/* Payment Details */}
            <div className="flex justify-between py-3 border-b border-gray-200 bg-green-50 px-3 rounded">
              <span className="text-sm text-gray-500 font-bold">Amount Paid</span>
              <span className="font-bold text-green-600 text-lg">{payment.amount}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm text-gray-500">Payment Mode</span>
              <span className="font-semibold text-gray-900">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                  {payment.mode}
                </span>
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm text-gray-500">Payment Date</span>
              <span className="font-semibold text-gray-900">{payment.date}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-sm text-gray-500">Reference</span>
              <span className="font-semibold text-gray-900">{payment.reference}</span>
            </div>

            {payment.notes && (
              <div className="py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Notes</span>
                <p className="font-semibold text-gray-900 mt-2 text-sm">{payment.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200 mt-6">
              <p className="text-sm text-gray-600 mb-1">Thank you for your payment!</p>
              <p className="text-sm text-gray-600">For queries: 0422-123 4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
