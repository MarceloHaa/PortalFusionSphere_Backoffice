import React, { useEffect, useState } from "react";
import logo_01 from "../assets/logo_01.png";
import logo from "../assets/logo.png";
import { PiGear, PiHouse, PiSignOut, PiUser } from "react-icons/pi";
import { TbArrowBigLeftLines, TbArrowBigRightLines } from "react-icons/tb";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SidebarItem({ icon, text, active = false, expanded }) {
  return (
    <div
      className={`flex items-center py-3 px-4 mb-2 rounded-md cursor-pointer ${
        active ? "bg-tertiary" : "hover:bg-tertiary"
      }`}
    >
      <div className="text-light">{icon}</div>
      {expanded && <span className="ml-3 text-light">{text}</span>}
    </div>
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { user, logout: authLogout } = useAuth();

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

  const handleLogout = async () => {
    authLogout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-accent">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary text-tertiary transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-center">
            {sidebarOpen ? (
              <div className="flex items-center justify-center space-x-2">
                <img
                  src={logo}
                  alt="FusionSphere Logo"
                  className="h-16 w-auto"
                />
                <h1 className="text-2xl font-bold text-accent">
                  Fusion Sphere
                </h1>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src={logo_01}
                  alt="FusionSphere Logo"
                  className="h-24 w-12 object-contain"
                />
              </div>
            )}
          </div>
          <div className="flex-1 mt-6">
            <nav className="px-2">
              <SidebarItem
                icon={<PiHouse size={24} />}
                text="Home"
                active={true}
                expanded={sidebarOpen}
              />
              <SidebarItem
                icon={<PiUser size={24} />}
                text="Perfil"
                expanded={sidebarOpen}
              />
              <SidebarItem
                icon={<FaRegPenToSquare size={24} />}
                text="Autor"
                expanded={sidebarOpen}
              />
              <SidebarItem
                icon={<PiGear size={24} />}
                text="Adiministrador"
                expanded={sidebarOpen}
              />
            </nav>
          </div>
          <div className="p-4">
            <button
              className={`flex w-full ${
                sidebarOpen ? "justify-end" : "justify-center"
              } text-light`}
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Recolher sidebar" : "Expandir sidebar"}
            >
              {sidebarOpen ? (
                <TbArrowBigLeftLines size={24} className="text-accent" />
              ) : (
                <TbArrowBigRightLines size={24} className="text-accent" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-secondary shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="text-light mr-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-light">Home</h1>
            </div>
            <div className="flex items-center">
              <div className="text-light mr-4">
                Olá,
                <span className="font-medium">
                  {userName || "Visitante"}
                </span>{" "}
              </div>
              <button className="p-2 rounded-full hover:bg-tertiary text-light">
                <PiSignOut onClick={handleLogout} size={24} />
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
