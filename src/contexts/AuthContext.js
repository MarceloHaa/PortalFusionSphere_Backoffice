import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token) {
        if (userData && userData !== "undefined" && userData !== "null") {
          try {
            const parsedUser = JSON.parse(userData);
            setUser({
              token,
              ...parsedUser,
            });
          } catch (error) {
            console.error("Erro ao parsear userData:", error);
            await fetchUserData(token);
          }
        } else {
          await fetchUserData(token);
        }
      }
      setLoading(false);
    };

    const fetchUserData = async (token) => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const userData = {
            ...currentUser,
            isAdmin:
              currentUser.isAdmin === true || currentUser.isadmin === "1",
            isAuthor:
              currentUser.isAuthor === true || currentUser.isauthor === "1",
            isActive: true,
          };

          localStorage.setItem("userData", JSON.stringify(userData));
          setUser({
            token,
            ...userData,
          });
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.token) {
        localStorage.setItem("authToken", response.token);

        if (response.user) {
          const userData = {
            ...response.user,
            isAdmin:
              response.user.isAdmin === true || response.user.isadmin === "1",
            isAuthor:
              response.user.isAuthor === true || response.user.isauthor === "1",
            active: response.user.active !== false,
          };

          localStorage.setItem("userData", JSON.stringify(userData));
          setUser({
            token: response.token,
            ...userData,
          });
        } else {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            const userData = {
              ...currentUser,
              isAdmin:
                currentUser.isAdmin === true || currentUser.isadmin === "1",
              isAuthor:
                currentUser.isAuthor === true || currentUser.isauthor === "1",
              active: currentUser.active !== false,
            };

            localStorage.setItem("userData", JSON.stringify(userData));
            setUser({
              token: response.token,
              ...userData,
            });
          }
        }
      }
      return response;
    } catch (error) {
      console.error("Login falhou:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.token && response.user) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user));
        setUser({
          token: response.token,
          ...response.user,
        });
      }
      return response;
    } catch (error) {
      console.error("Registro falhou:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const userData = {
            ...currentUser,
            isAdmin:
              currentUser.isAdmin === true || currentUser.isadmin === "1",
            isAuthor:
              currentUser.isAuthor === true || currentUser.isauthor === "1",
            active: currentUser.active !== false,
          };

          localStorage.setItem("userData", JSON.stringify(userData));
          setUser({
            token,
            ...userData,
          });
        }
      } catch (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
      }
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    logout,
    register,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin === true || user?.isadmin === "1",
    isAuthor: user?.isAuthor === true || user?.isauthor === "1",
    isActive: true,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
