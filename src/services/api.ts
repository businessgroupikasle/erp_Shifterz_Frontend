const API_BASE = "http://localhost:5000/api";

async function request<T = any>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sz_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const mergedHeaders = {
    ...headers,
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: mergedHeaders,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
  }
  return res.json();
}


export const api = {
  // Dashboard
  getDashboard: () => request("/dashboard"),

  // Car In / Out
  getCarIn: () => request("/carin"),
  checkInCar: (data: any) => request("/carin", { method: "POST", body: JSON.stringify(data) }),
  checkOutCar: (id: string) => request(`/carin/${id}/checkout`, { method: "PUT" }),

  // Out Pass
  getOutPass: () => request("/outpass"),
  createOutPass: (data: any) => request("/outpass", { method: "POST", body: JSON.stringify(data) }),

  // Leads
  getLeads: () => request("/leads"),
  createLead: (data: any) => request("/leads", { method: "POST", body: JSON.stringify(data) }),
  updateLead: (id: string, data: any) => request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Invoices
  getInvoices: () => request("/invoices"),
  createInvoice: (data: any) => request("/invoices", { method: "POST", body: JSON.stringify(data) }),
  updateInvoice: (id: string, data: any) => request(`/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Payments
  getPayments: () => request("/payments"),
  createPayment: (data: any) => request("/payments", { method: "POST", body: JSON.stringify(data) }),

  // Services
  getServices: () => request("/services"),
  createService: (data: any) => request("/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => request(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (id: string) => request(`/services/${id}`, { method: "DELETE" }),

  // Inventory
  getInventory: () => request("/inventory"),
  createInventoryItem: (data: any) => request("/inventory", { method: "POST", body: JSON.stringify(data) }),
  updateInventoryItem: (id: string, data: any) => request(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInventoryItem: (id: string) => request(`/inventory/${id}`, { method: "DELETE" }),

  // Jobs
  getJobs: () => request("/jobs"),
  createJob: (data: any) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id: string, data: any) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Franchise
  getFranchise: () => request("/franchise"),
  createFranchise: (data: any) => request("/franchise", { method: "POST", body: JSON.stringify(data) }),

  // Customers
  getCustomers: () => request("/customers"),

  // Settings
  getSettings: () => request("/settings"),
  updateSettings: (data: any) => request("/settings", { method: "POST", body: JSON.stringify(data) }),

  // Technicians
  getTechnicians: () => request("/technicians"),
  createTechnician: (data: any) => request("/technicians", { method: "POST", body: JSON.stringify(data) }),
  deleteTechnician: (id: string) => request(`/technicians/${id}`, { method: "DELETE" }),

  // Auth
  login: (username: string, password: string) => request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  getMe: () => request("/auth/me"),
};

