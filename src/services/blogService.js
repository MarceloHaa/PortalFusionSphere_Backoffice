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

export const blogImageService = {
  getAll: async (params = {}) => {
    try {
      setAuthHeader();
      const { name, source, pageIndex = 0, pageSize = 10 } = params;
      const response = await api.get("/blogimage", {
        params: { name, source, pageIndex, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao buscar imagens");
    }
  },

  getById: async (id) => {
    try {
      setAuthHeader();
      const response = await api.get(`/blogimage/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao buscar imagem");
    }
  },

  create: async (imageData) => {
    try {
      setAuthHeader();

      const formData = new FormData();
      formData.append("file", imageData.file);
      formData.append("source", imageData.source || "Upload do usuário");
      formData.append("tags", JSON.stringify(imageData.tags || []));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      const response = await api.post("/blogimage/create", formData, config);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao criar imagem");
    }
  },

  delete: async (id) => {
    try {
      setAuthHeader();
      const response = await api.delete(`/blogimage/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Erro ao excluir imagem");
    }
  },
};
