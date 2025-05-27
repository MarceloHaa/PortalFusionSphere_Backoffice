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

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

const fetchCurrentUser = async (token) => {
  try {
    const response = await api.get("/User/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await authApi.post("/Authentication/register", userData);
      const data = response.data;

      if (data && data.token) {
        return {
          token: data.token,
          user: {
            id: data.id,
            email: data.email,
            name: data.name,
            isAdmin: data.isAdmin === true || data.isadmin === "1",
            isAuthor: data.isAuthor === true || data.isauthor === "1",
            active: true,
          },
        };
      }

      throw new Error("Resposta inválida do servidor");
    } catch (error) {
      throw error.response?.data || new Error("Erro ao registrar usuário");
    }
  },

  login: async (credentials) => {
    try {
      console.log("🚀 authService.login - Enviando dados:", {
        email: credentials.email,
        twoFactorCode: credentials.twoFactorCode || "",
        twoFactorRecoveryCode: credentials.twoFactorRecoveryCode || "",
      });

      const loginData = {
        email: credentials.email,
        password: credentials.password,
        twoFactorCode: credentials.twoFactorCode || "",
        twoFactorRecoveryCode: credentials.twoFactorRecoveryCode || "",
      };

      const response = await authApi.post("/Authentication/login", loginData);
      console.log("📡 Resposta RAW do backend:", response.data);

      const data = response.data;

      if (data.isSuccess && data.value) {
        const token = data.value;
        console.log("🎫 Token extraído:", token);

        const decodedToken = decodeJWT(token);
        console.log("🔓 Token decodificado:", decodedToken);

        if (decodedToken) {
          const user = {
            id: decodedToken.sub || decodedToken.userId || decodedToken.id,
            email: decodedToken.email || decodedToken.useremail,
            name: decodedToken.name,
            isAdmin:
              decodedToken.isadmin === "1" || decodedToken.isAdmin === true,
            isAuthor:
              decodedToken.isauthor === "1" || decodedToken.isAuthor === true,
            active: true,
          };

          console.log("👤 Usuário extraído do token:", user);
          return { token, user };
        } else {
          console.log(
            "⚠️ Não conseguiu decodificar token, tentando buscar via API..."
          );
          const userData = await fetchCurrentUser(token);

          if (userData) {
            const user = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              isAdmin: userData.isAdmin === true || userData.isadmin === "1",
              isAuthor: userData.isAuthor === true || userData.isauthor === "1",
              active: userData.active !== false,
            };
            return { token, user };
          }
        }

        return {
          token,
          user: {
            isAdmin: false,
            isAuthor: false,
            active: true,
          },
        };
      } else {
        throw new Error(data.error || "Falha na autenticação");
      }
    } catch (error) {
      console.error("❌ Erro no authService.login:", error);
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
      const userData = await fetchCurrentUser(token);
      if (userData) {
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          isAdmin: userData.isAdmin === true || userData.isadmin === "1",
          isAuthor: userData.isAuthor === true || userData.isauthor === "1",
          active: userData.active !== false,
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      return null;
    }
  },

  validateToken: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      await api.get("/User/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
