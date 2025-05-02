import api from "./api";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/authentication/login", credentials);
      const { token, user } = response.data;

      return { token, user };
    } catch (error) {
      throw error.response?.data || new Error("Erro ao autenticar");
    }
  },
};
