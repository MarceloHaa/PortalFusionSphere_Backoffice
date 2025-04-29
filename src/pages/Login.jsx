import { useState } from "react";
import { authService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
    twoFactorRecoveryCode: "",
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRecoveryCodeInput, setShowRecoveryCodeInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.login(formData);

      if (result.requiresTwoFactor) {
        setShowTwoFactor(true);
        toast.info("Verificação em duas etapas necessária");
      } else {
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || "Falha na autenticação");
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-accent p-4">
      <div className="w-full max-w-md bg-secondary rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-center">
          <h1 className="text-2xl font-bold text-light">FusionSphere</h1>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold text-primary mb-6">
            Acesse sua conta
          </h2>

          <div>
            <div className="mb-4">
              <label
                className="block text-neutral text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-neutral text-sm font-medium mb-2"
                htmlFor="password"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <PiEyeClosedBold className="text-primary" />
                  ) : (
                    <PiEyeBold className="text-primary" />
                  )}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <Link
                  to="/esqueci-senha"
                  className="text-sm text-primary hover:text-tertiary"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            {showTwoFactor && (
              <div className="mb-6">
                <label
                  className="block text-neutral text-sm font-medium mb-2"
                  htmlFor="twoFactorCode"
                >
                  Código de verificação
                </label>
                <input
                  id="twoFactorCode"
                  name="twoFactorCode"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="000000"
                  value={formData.twoFactorCode}
                  onChange={handleChange}
                />
                <div className="mt-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-tertiary"
                    onClick={() =>
                      setShowRecoveryCodeInput(!showRecoveryCodeInput)
                    }
                  >
                    Usar código de recuperação
                  </button>
                  {showRecoveryCodeInput && (
                    <div className="mt-2">
                      <input
                        name="twoFactorRecoveryCode"
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Código de recuperação"
                        value={formData.twoFactorRecoveryCode}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition ${
                loading ? "bg-secondary" : "bg-primary hover:bg-tertiary"
              }`}
            >
              {loading ? "Processando..." : "Entrar"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-neutral">
              Ainda não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:text-tertiary"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-light py-4 px-8 border-t text-center">
          <p className="text-sm text-secondary">
            &copy; {new Date().getFullYear()} FusionSphere.
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
