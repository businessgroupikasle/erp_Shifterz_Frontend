"use client";
/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { X, FileText, Plus, Trash2 } from "lucide-react";

interface NewDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (doc: any) => void;
}

const COMMON_SERVICES = [
  "PPF Full Body",
  "PPF Bonnet + Roof",
  "PPF Partial (Hood)",
  "C3 Pro Coating",
  "Ceramic Coating",
  "Graphene Coating",
  "Interior Detailing",
  "Paint Correction (1-step)",
  "Full Paint Correction",
  "Window Tinting"
];

export default function NewDocumentDialog({
  isOpen,
  onClose,
  onSubmit,
}: NewDocumentDialogProps) {
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: "Invoice",
    status: "Pending",
    client: "",
    phone: "",
    vehicle: "",
    discount: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    gstNumber: "",
    bankDetails: "Bank: Example Bank\nAccount Name: ABC Trading Pvt. Ltd.\nAccount No.: XXXXXXXX",
    paymentTerms: "50% advance payment.\nBalance before shipment.",
    deliveryTerms: "Delivery within 15 days after receipt of advance payment.",
    authorizedSignatory: "Authorized Signatory",
  });

  const [items, setItems] = useState([{ desc: "Industrial Pump Model X100", qty: 1, price: 0, amount: 0 }]);
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);

  useEffect(() => {
    let subtotal = 0;
    const updatedItems = items.map((item) => {
      const amt = (item.qty || 0) * (item.price || 0);
      subtotal += amt;
      return { ...item, amount: amt };
    });
    setBaseAmount(subtotal);
    setGstAmount((subtotal * 18) / 100);
  }, [items]);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { desc: "", qty: 1, price: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
    } else if (name === "vehicle") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const discountAmount = parseFloat(formData.discount) || 0;
      
      const docTypePrefix = {
        Invoice: "INV",
        Quotation: "QT",
        Estimate: "EST",
        Proforma: "PRF",
      }[formData.type] || "DOC";

      const docNo = `${docTypePrefix}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

      const newDoc = {
        type: formData.type,
        client: formData.client,
        phone: formData.phone,
        vehicle: formData.vehicle,
        service: items.length > 0 ? items[0].desc : "Multiple Items", // fallback
        amount: baseAmount,
        gst: gstAmount,
        discount: discountAmount,
        date: formData.invoiceDate,
        dueDate: formData.dueDate || formData.invoiceDate,
        status: formData.status,
        notes: formData.notes,
        gstNumber: formData.gstNumber || null,
        items: items,
        bankDetails: formData.bankDetails,
        paymentTerms: formData.paymentTerms,
        deliveryTerms: formData.deliveryTerms,
        authorizedSignatory: formData.authorizedSignatory,
      };
      onSubmit(newDoc);
    }
    
    // Reset form
    setFormData({
      type: "Invoice",
      status: "Pending",
      client: "",
      phone: "",
      vehicle: "",
      discount: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
      gstNumber: "",
      bankDetails: "Bank: Example Bank\nAccount Name: ABC Trading Pvt. Ltd.\nAccount No.: XXXXXXXX",
      paymentTerms: "50% advance payment.\nBalance before shipment.",
      deliveryTerms: "Delivery within 15 days after receipt of advance payment.",
      authorizedSignatory: "Authorized Signatory",
    });
    setItems([{ desc: "", qty: 1, price: 0, amount: 0 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">New Document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Type & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                required
              >
                <option>Invoice</option>
                <option>Quotation</option>
                <option>Estimate</option>
                <option>Proforma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Overdue</option>
                <option>Approved</option>
              </select>
            </div>
          </div>

          {/* Row 2: Client & Phone */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
              />
            </div>
          </div>

          {/* Row 3: Vehicle & Dates */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Vehicle No.
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="TN 04 XX 0000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
              />
            </div>
          </div>

          <hr className="my-6" />

          {/* Line Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Line Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleItemChange(index, "desc", e.target.value)}
                      onFocus={() => setFocusedItemIndex(index)}
                      onBlur={() => setTimeout(() => setFocusedItemIndex(null), 200)}
                      placeholder="Service Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      required
                      autoComplete="off"
                    />
                    {focusedItemIndex === index && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto top-full left-0">
                        {COMMON_SERVICES.filter(s => s.toLowerCase().includes(item.desc.toLowerCase())).map((service) => (
                          <div
                            key={service}
                            className="px-4 py-2.5 hover:bg-yellow-50 cursor-pointer text-sm text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-0"
                            onClick={() => {
                              handleItemChange(index, "desc", service);
                              setFocusedItemIndex(null);
                            }}
                          >
                            {service}
                          </div>
                        ))}
                        {item.desc && !COMMON_SERVICES.some(s => s.toLowerCase() === item.desc.toLowerCase()) && (
                          <div
                            className="px-4 py-2.5 bg-gray-50 text-sm text-gray-500 font-medium border-t border-gray-100"
                          >
                            Press Enter or click away to use "{item.desc}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, "qty", parseFloat(e.target.value))}
                      placeholder="Qty"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                      min="1"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))}
                      placeholder="Price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                      min="0"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      placeholder="Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-4 text-sm">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Subtotal:</span>
                  <span>₹{baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">GST (18%):</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">Discount (₹):</span>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-yellow-600">
                    ₹{(baseAmount + gstAmount - (parseFloat(formData.discount) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Additional Terms */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Payment Terms
              </label>
              <textarea
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Delivery Terms
              </label>
              <textarea
                name="deliveryTerms"
                value={formData.deliveryTerms}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Bank Details
              </label>
              <textarea
                name="bankDetails"
                value={formData.bankDetails}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Authorized Signatory Name
              </label>
              <input
                type="text"
                name="authorizedSignatory"
                value={formData.authorizedSignatory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 text-sm mb-4"
              />
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Client GSTIN (Optional)
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 text-sm uppercase"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
          >
            ✓ Generate Document
          </button>
        </form>
      </div>
    </div>
  );
}
