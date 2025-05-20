import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://portalfusionsphere.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const tagService = {
  all: async (params = {}) => {
    try {
      setAuthHeader();
      const { name, pageIndex = 0, pageSize = 10 } = params;
      const response = await api.get("/tag/all", {
        params: { name, pageIndex, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao buscar tags");
    }
  },

  getById: async (id) => {
    try {
      setAuthHeader();
      const response = await api.get(`/tag/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao buscar tag");
    }
  },

  create: async (tagData) => {
    try {
      setAuthHeader();
      const response = await api.post("/tag/create", tagData);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao criar tag");
    }
  },

  update: async (id, tagData) => {
    try {
      setAuthHeader();
      const payload = {
        id: id,
        data: {
          name: tagData.name,
        },
      };

      const response = await api.put(`/Tag/Update`, payload);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao atualizar tag");
    }
  },

  delete: async (id) => {
    try {
      setAuthHeader();
      const response = await api.delete(`/tag/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao excluir tag");
    }
  },
};
