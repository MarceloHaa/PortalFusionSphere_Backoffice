import api from "./api";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/authentication/login", credentials);

    if (response.status === 200 && response.data.token && response.data.user) {
      return response.data;
    }

    throw new Error(response.data?.message || "Credenciais inválidas");
  },
};
