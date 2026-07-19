// public/js/api.js — thin fetch wrapper for the Bluecamo API
const API = {
  base: "/api",

  token() {
    return localStorage.getItem("bc_token");
  },

  async request(path, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    const t = this.token();
    if (t) headers.Authorization = `Bearer ${t}`;

    const res = await fetch(`${this.base}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "request failed");
    return data;
  },

  get(path) {
    return this.request(path);
  },
  post(path, body) {
    return this.request(path, { method: "POST", body });
  },
  patch(path, body) {
    return this.request(path, { method: "PATCH", body });
  },
  del(path) {
    return this.request(path, { method: "DELETE" });
  },
};
    
