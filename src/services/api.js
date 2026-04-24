const API_BASE_URL = "http://localhost:5000/api";

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(err.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  static async get(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.append(k, v);
    });
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(err.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  static post(endpoint, data) {
    return this.request(endpoint, { method: "POST", body: JSON.stringify(data) });
  }

  static put(endpoint, data) {
    return this.request(endpoint, { method: "PUT", body: JSON.stringify(data) });
  }

  static delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export class SystemService {
  static testSystem() { return ApiService.get("/test"); }
  static healthCheck() { return ApiService.get("/health"); }
}

export class DbService {
  static testConnection() { return ApiService.get("/db-test"); }
  static getTables() { return ApiService.get("/tables"); }
}

export { ApiService };
