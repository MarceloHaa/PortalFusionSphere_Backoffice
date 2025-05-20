import { PiSignOut } from "react-icons/pi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar, title = "Home" }) {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    authLogout();
    navigate("/login");
  };

  return (
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
          <h1 className="text-xl font-semibold text-light">{title}</h1>
        </div>
        <div className="flex items-center">
          <div className="text-light mr-4">
            Olá,
            <span className="font-medium ml-1">
              {user?.name || user?.firstName || user?.username || "Visitante"}
            </span>
          </div>
          <button
            className="p-2 rounded-full hover:bg-tertiary text-light"
            onClick={handleLogout}
          >
            <PiSignOut size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
