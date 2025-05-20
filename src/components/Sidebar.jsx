import React, { useState } from "react";
import logo_01 from "../assets/logo_01.png";
import logo from "../assets/logo.png";
import { PiGear, PiHouse, PiUser } from "react-icons/pi";
import { TbArrowBigLeftLines, TbArrowBigRightLines } from "react-icons/tb";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function SidebarItem({ icon, text, active = false, expanded, onClick }) {
  return (
    <div
      className={`flex items-center py-3 px-4 mb-2 rounded-md cursor-pointer ${
        active ? "bg-tertiary" : "hover:bg-tertiary"
      }`}
      onClick={onClick}
    >
      <div className="text-light">{icon}</div>
      {expanded && <span className="ml-3 text-light">{text}</span>}
    </div>
  );
}

export default function Sidebar({ activePage, setActivePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (page) => {
    setActivePage(page);

    switch (page) {
      case "home":
        navigate("/dashboard");
        break;
      case "perfil":
        navigate("/profile");
        break;
      case "autor":
        navigate("/author");
        break;
      case "admin":
        navigate("/admin/tags");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-primary text-tertiary transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-center">
          {sidebarOpen ? (
            <div className="flex items-center justify-center space-x-2">
              <img src={logo} alt="FusionSphere Logo" className="h-16 w-auto" />
              <h1 className="text-2xl font-bold text-accent">Fusion Sphere</h1>
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
              active={activePage === "home"}
              expanded={sidebarOpen}
              onClick={() => handleNavigation("home")}
            />
            <SidebarItem
              icon={<PiUser size={24} />}
              text="Perfil"
              active={activePage === "perfil"}
              expanded={sidebarOpen}
              onClick={() => handleNavigation("perfil")}
            />
            <SidebarItem
              icon={<FaRegPenToSquare size={24} />}
              text="Autor"
              active={activePage === "autor"}
              expanded={sidebarOpen}
              onClick={() => handleNavigation("autor")}
            />
            <SidebarItem
              icon={<PiGear size={24} />}
              text="Adiministrador"
              active={activePage === "admin"}
              expanded={sidebarOpen}
              onClick={() => handleNavigation("admin")}
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
  );
}
