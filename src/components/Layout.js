import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const [activePage, setActivePage] = useState("home");
  const [userName, setUserName] = useState("");
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user && user.token) {
        try {
          const storedUserName = localStorage.getItem("userName");
          if (storedUserName) {
            setUserName(storedUserName);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      } else {
        setUserName("");
      }
    };

    fetchUserName();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "home":
        return "Home";
      case "perfil":
        return "Perfil";
      case "autor":
        return "Autor";
      case "admin":
        return "Administrador";
      default:
        return "Home";
    }
  };

  return (
    <div className="flex h-screen bg-accent">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={userName}
          toggleSidebar={toggleSidebar}
          title={getPageTitle()}
        />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
