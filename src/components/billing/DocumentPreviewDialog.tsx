"use client";

import { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { getSettings } from "@/lib/api";

interface DocumentPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    docNo: string;
    type: string;
    status?: string;
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
    items?: any[];
    bankDetails?: string;
    paymentTerms?: string;
    deliveryTerms?: string;
    authorizedSignatory?: string;
  };
}

export default function DocumentPreviewDialog({
  isOpen,
  onClose,
  document,
}: DocumentPreviewDialogProps) {
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      getSettings().then(data => {
        if (data?.companyInfo) setCompanyInfo(data.companyInfo);
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen || !document) return null;

  const renderItemsHtml = () => {
    if (document.items && document.items.length > 0) {
      return document.items.map(item => {
        const itemAmount = item.amount || (item.qty * item.price) || 0;
        return `
        <tr>
          <td>${item.desc || '-'}</td>
          <td style="text-align:center">${item.qty}</td>
          <td style="text-align:right">₹${Number(item.price || 0).toLocaleString("en-IN")}</td>
          <td class="amount">₹${Number(itemAmount).toLocaleString("en-IN")}</td>
        </tr>
      `}).join("");
    }
    return `
      <tr>
        <td>${document.service}</td>
        <td style="text-align:center">1</td>
        <td style="text-align:right">${document.base}</td>
        <td class="amount">${document.base}</td>
      </tr>
    `;
  };

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
                color: #333;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
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
                text-transform: uppercase;
              }
              .header-right p {
                margin: 4px 0;
                font-size: 12px;
              }
              .content {
                padding: 24px;
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
                font-size: 14px;
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
              .terms-section {
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                font-size: 12px;
              }
              .terms-left {
                flex: 2;
                padding-right: 20px;
              }
              .terms-block {
                margin-bottom: 12px;
              }
              .terms-block strong {
                display: block;
                margin-bottom: 4px;
                color: #555;
              }
              .sign-block {
                flex: 1;
                text-align: right;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
              }
              .sign-line {
                margin-top: 60px;
                border-top: 1px solid #000;
                padding-top: 5px;
                display: inline-block;
                font-weight: bold;
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
                  <p>${companyInfo?.address || '42, Race Course Rd, Coimbatore - 641018'}</p>
                </div>
                <div class="header-right">
                  <h2>${document.type}</h2>
                  <p>${document.docNo}</p>
                  ${document.status ? `
                  <p style="margin-top: 8px; font-weight: bold; text-transform: uppercase;">
                    <span style="
                      color: ${document.status === 'Paid' ? '#16a34a' : document.status === 'Overdue' ? '#dc2626' : document.status === 'Approved' ? '#2563eb' : '#d97706'};
                      background: ${document.status === 'Paid' ? '#dcfce7' : document.status === 'Overdue' ? '#fee2e2' : document.status === 'Approved' ? '#dbeafe' : '#fef3c7'};
                      padding: 4px 8px; border-radius: 4px; font-size: 11px; letter-spacing: 1px;
                    ">${document.status}</span>
                  </p>` : ''}
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
                      <th style="text-align:center">QTY</th>
                      <th style="text-align:right">UNIT PRICE</th>
                      <th class="amount">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${renderItemsHtml()}
                    <tr class="gst-row">
                      <td colspan="3" style="text-align:right"><strong>Subtotal</strong></td>
                      <td class="amount"><strong>${document.base}</strong></td>
                    </tr>
                    <tr class="gst-row">
                      <td colspan="3" style="text-align:right">GST (18%)</td>
                      <td class="amount">${document.gst}</td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="3" style="text-align:right">TOTAL</td>
                      <td class="amount">${document.total}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="terms-section">
                  <div class="terms-left">
                    ${document.paymentTerms ? `<div class="terms-block"><strong>Payment Terms:</strong>${document.paymentTerms.replace(/\n/g, '<br/>')}</div>` : ''}
                    ${document.deliveryTerms ? `<div class="terms-block"><strong>Delivery Terms:</strong>${document.deliveryTerms.replace(/\n/g, '<br/>')}</div>` : ''}
                    ${document.bankDetails ? `<div class="terms-block"><strong>Bank Details:</strong>${document.bankDetails.replace(/\n/g, '<br/>')}</div>` : ''}
                  </div>
                  <div class="sign-block">
                    <div>
                      <span class="sign-line">${document.authorizedSignatory || "Authorized Signatory"}</span>
                    </div>
                  </div>
                </div>

                <div class="footer">
                <p>Thank you for choosing Shifterz!</p>
                <p>${companyInfo?.phone || '0422-123 4567'}</p>
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-xl flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between p-6 border-b">
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

        {/* Scrollable Document Preview Container */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex justify-center">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-[800px] h-fit">
            {/* Header */}
            <div className="bg-yellow-400 text-gray-900 px-8 py-6 flex justify-between items-start rounded-t-lg">
              <div>
                <h1 className="text-3xl font-bold mb-1 tracking-tight">SHIFTERZ</h1>
                <p className="text-sm font-medium">{companyInfo?.address || '42, Race Course Rd, Coimbatore - 641018'}</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-1 uppercase tracking-tight">{document.type}</h2>
                <p className="text-sm font-medium">{document.docNo}</p>
                {document.status && (
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      document.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      document.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      document.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {document.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Bill To & Details */}
              <div className="flex justify-between mb-8">
                <div className="max-w-[50%]">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Bill To
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {document.client}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{document.phone}</p>
                  <p className="text-sm text-gray-600 font-medium">{document.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Details
                  </p>
                  <table className="text-sm ml-auto">
                    <tbody>
                      <tr>
                        <td className="pr-4 text-gray-500 font-medium pb-1">Date:</td>
                        <td className="text-gray-900 font-semibold pb-1">{document.date}</td>
                      </tr>
                      <tr>
                        <td className="pr-4 text-gray-500 font-medium pb-1">Due:</td>
                        <td className="text-gray-900 font-semibold pb-1">{document.due}</td>
                      </tr>
                      {document.gstNumber && (
                        <tr>
                          <td className="pr-4 text-gray-500 font-medium pb-1">Client GSTIN:</td>
                          <td className="text-gray-900 font-semibold pb-1">{document.gstNumber}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="pr-4 text-gray-500 font-medium">Our GSTIN:</td>
                        <td className="text-gray-900 font-semibold">33AAAAAO000A1Z5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Description Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {document.items && document.items.length > 0 ? (
                      document.items.map((item, idx) => {
                        const itemAmount = item.amount || (item.qty * item.price) || 0;
                        return (
                        <tr key={idx} className="bg-white">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.desc}</td>
                          <td className="px-6 py-4 text-sm text-center text-gray-600">{item.qty}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-600">₹{Number(item.price || 0).toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                            ₹{Number(itemAmount).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      )})
                    ) : (
                      <tr className="bg-white">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{document.service}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600">1</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">{document.base}</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                          {document.base}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-gray-50/50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600 font-medium">Subtotal</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900 font-bold">
                        {document.base.includes('₹') ? document.base : `₹${document.base}`}
                      </td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600 font-medium">GST (18%)</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900 font-semibold">
                        {document.gst.includes('₹') ? document.gst : `₹${document.gst}`}
                      </td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td colSpan={3} className="px-6 py-5 text-right font-bold text-gray-900 uppercase tracking-wider">
                        Total
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-yellow-600 text-xl">
                        {document.total.includes('₹') ? document.total : `₹${document.total}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terms & Signatory */}
              <div className="flex justify-between mt-10 text-sm">
                <div className="flex-[2] pr-12 space-y-6">
                  {document.paymentTerms && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">Payment Terms</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{document.paymentTerms}</p>
                    </div>
                  )}
                  {document.deliveryTerms && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">Delivery Terms</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{document.deliveryTerms}</p>
                    </div>
                  )}
                  {document.bankDetails && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">Bank Details</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{document.bankDetails}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-end items-end">
                  <div className="mt-12 text-center">
                    <div className="w-48 border-t-2 border-gray-800 pt-2 font-bold text-gray-900">
                      {document.authorizedSignatory || "Authorized Signatory"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 font-medium">Thank you for choosing Shifterz!</p>
                <p className="text-sm text-gray-500">{companyInfo?.phone || '0422-123 4567'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
