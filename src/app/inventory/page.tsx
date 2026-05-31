"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Boxes, Plus, Search, Edit2, Trash2, AlertTriangle, MapPin, Tag } from "lucide-react";
import InventoryItemDialog from "@/components/inventory/InventoryItemDialog";

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modals
  const [itmModal, setItmModal] = useState(false);
  const [editItm, setEditItm] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    unit: "Meter",
    category: "PPF",
    stock: 0,
    reorder: 0,
    cost: 0,
    supplier: "",
    location: "",
  });

  const loadData = async () => {
    try {
      const data = await api.getInventory();
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveItm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.stock < 0) {
      alert("Item Name and Stock Level are required!");
      return;
    }
    try {
      if (editItm) {
        await api.updateInventoryItem(editItm.id, form);
      } else {
        await api.createInventoryItem(form);
      }
      setItmModal(false);
      setEditItm(null);
      setForm({
        name: "",
        unit: "Meter",
        category: "PPF",
        stock: 0,
        reorder: 0,
        cost: 0,
        supplier: "",
        location: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save item.");
    }
  };

  const handleEditTrigger = (itm: any) => {
    setEditItm(itm);
    setForm({
      name: itm.name,
      unit: itm.unit,
      category: itm.category,
      stock: itm.stock,
      reorder: itm.reorder,
      cost: itm.cost,
      supplier: itm.supplier,
      location: itm.location,
    });
    setItmModal(true);
  };

  const handleDeleteItm = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      await api.deleteInventoryItem(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    }
  };

  const fmt = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  const lowStockCount = items.filter(i => i.stock <= i.reorder).length;
  const totalStockVal = items.reduce((sum, i) => sum + (i.cost * i.stock), 0);

  const filtered = items.filter(i => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || i.category === categoryFilter;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-dashed pb-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-syne)" }}>
            <Boxes className="text-[var(--accent)]" size={22} /> Stock Control Inventory
          </h2>
          <p className="text-xs text-[var(--text2)] mt-0.5">Monitor paint protection films, detailing chemistry stock, and safety reorder levels.</p>
        </div>
        <button
          onClick={() => {
            setEditItm(null);
            setForm({
              name: "",
              unit: "Meter",
              category: "PPF",
              stock: 10,
              reorder: 5,
              cost: 100,
              supplier: "",
              location: "",
            });
            setItmModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[var(--accent)] hover:bg-[var(--accent2)] text-black font-extrabold transition-all cursor-pointer text-xs justify-center"
        >
          <Plus size={14} /> New Inventory Item
        </button>
      </div>

      {/* 3-Column Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Stat 1 - Total Items */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Total Stock Items
              </span>
              <div className="text-2xl font-extrabold text-[var(--accent)] mt-1 tracking-tight">
                {items.length} Unique SKUs
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--accent-glow)] border border-amber-500/20 text-[var(--accent)]">
              <Boxes size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Total categorized catalog elements</span>
        </div>

        {/* Stat 2 - Low Stock Warnings */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-400 to-rose-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Low Stock Alerts
              </span>
              <div className={`text-2xl font-extrabold mt-1 tracking-tight ${lowStockCount > 0 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                {lowStockCount} Warnings
              </div>
            </div>
            <div className={`p-2 rounded-lg border text-red-400 ${lowStockCount > 0 ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Items requiring urgent reorder</span>
        </div>

        {/* Stat 3 - Valuation */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 group"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-600 opacity-60" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[var(--text3)]">
                Total Valuation (Cost)
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                {fmt(totalStockVal)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Boxes size={16} />
            </div>
          </div>
          <span className="text-[10px] text-[var(--text2)] mt-3 block">Est. cash tied up in safety stock</span>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row gap-4 items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-extrabold text-sm text-white">Stock Control Register</h3>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">List of active workshop materials and supply points.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-[var(--text3)]" size={16} />
              <input
                type="text"
                placeholder="Search stock item..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-xs w-full sm:w-60 border"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border2)",
                  color: "var(--text)",
                }}
              />
            </div>
            {/* Category selection */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-xs border"
              style={{
                background: "var(--bg3)",
                borderColor: "var(--border2)",
                color: "var(--text)",
              }}
            >
              <option value="">All Categories</option>
              <option value="PPF">PPF</option>
              <option value="Coating">Coating</option>
              <option value="Consumable">Consumable</option>
              <option value="Chemical">Chemical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[750px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  SKU
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Item Name
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Category
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Stock Level
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Reorder Limit
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Cost Price
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Location / Supplier
                </th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text3)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(itm => {
                const isLow = itm.stock <= itm.reorder;
                return (
                  <tr
                    key={itm.id}
                    className={`transition-colors ${
                      isLow ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-[var(--bg3)]/40"
                    }`}
                  >
                    <td className="p-4 font-mono text-xs text-[var(--text3)]">{itm.id}</td>
                    <td className="p-4 font-bold">
                      <div className="flex items-center gap-1.5">
                        {itm.name}
                        {isLow && <AlertTriangle size={14} className="text-red-500 shrink-0" />}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold">{itm.category}</td>
                    <td className={`p-4 text-xs font-extrabold ${isLow ? "text-red-500" : "text-green-500"}`}>
                      {itm.stock} {itm.unit}
                    </td>
                    <td className="p-4 text-xs text-[var(--text2)]">
                      {itm.reorder} {itm.unit}
                    </td>
                    <td className="p-4 text-xs font-bold text-yellow-500">{fmt(itm.cost)}</td>
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-[var(--text3)]" /> {itm.location || "—"}
                      </div>
                      <div className="text-[var(--text3)] text-[10px] mt-0.5">{itm.supplier}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTrigger(itm)}
                          className="p-1.5 rounded hover:bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)] transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteItm(itm.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InventoryItemDialog
        open={itmModal}
        onClose={() => setItmModal(false)}
        onSubmit={handleSaveItm}
        form={form}
        setForm={setForm}
        isEdit={!!editItm}
      />
    </div>
  );
}
