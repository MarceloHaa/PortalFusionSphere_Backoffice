import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "https://portalfusionsphere.onrender.com";
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  register: async (userData) => {
    try {
      const response = await authApi.post("/Authentication/register", userData);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao registrar usuário");
    }
  },

  login: async (credentials) => {
    try {
      const loginData = {
        email: credentials.email,
        password: credentials.password,
        twoFactorCode: credentials.twoFactorCode || "",
        twoFactorRecoveryCode: credentials.twoFactorRecoveryCode || "",
      };
      const response = await authApi.post("/Authentication/login", loginData);

      const data = response.data;

      if (data.isSuccess && data.value) {
        localStorage.setItem("authToken", data.value);
        return data;
      } else {
        throw new Error(data.error || "Falha na autenticação");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },

  getCurrentUser: () => {
    const token = localStorage.getItem("authToken");
    return token ? { token } : null;
  },
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
