import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import AuthorRoute from "./components/AuthorRoute";
import Autor from "./pages/Autor";
import TagManagement from "./pages/adimin/TagMagement";
import UpLoadingImage from "./pages/UploadingImage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>

            <Route element={<AuthorRoute />}>
              <Route path="/autor" element={<Autor />} />
            </Route>

            <Route element={<AuthorRoute />}>
              <Route path="/uploading" element={<UpLoadingImage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/tags" element={<TagManagement />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
