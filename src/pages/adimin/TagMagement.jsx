import React, { useState, useEffect } from "react";
import { tagService } from "../../services/tagService";
import { useAuth } from "../../contexts/AuthContext";
import TagForm from "./TagForm";
import TagList from "./TagList";
import { useNavigate } from "react-router-dom";

const TagManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const result = await tagService.all({
        name: searchTerm || undefined,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      });

      setTags(result.items || []);
      setPagination({
        ...pagination,
        totalItems: result.totalItems || 0,
        totalPages: result.totalPages || 0,
      });
      setError(null);
    } catch (err) {
      setError(
        "Erro ao carregar tags: " + (err.message || "Erro desconhecido")
      );
      console.error("Erro ao carregar tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, pageIndex: 0 });
    fetchTags();
  };

  const handlePageChange = (newPageIndex) => {
    setPagination({ ...pagination, pageIndex: newPageIndex });
  };

  const handleCreateTag = () => {
    setCurrentTag(null);
    setShowForm(true);
  };

  const handleEditTag = (tag) => {
    setCurrentTag(tag);
    setShowForm(true);
  };

  const handleSaveTag = async (tagData) => {
    try {
      setLoading(true);
      if (currentTag) {
        await tagService.update(currentTag.id, tagData);
      } else {
        await tagService.create(tagData);
      }
      setShowForm(false);
      fetchTags();
    } catch (err) {
      setError("Erro ao salvar tag: " + (err.message || "Erro desconhecido"));
      console.error("Erro ao salvar tag:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta tag?")) {
      try {
        setLoading(true);
        await tagService.delete(id);
        fetchTags();
      } catch (err) {
        setError(
          "Erro ao excluir tag: " + (err.message || "Erro desconhecido")
        );
        console.error("Erro ao excluir tag:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Gerenciamento de Tags
          </h1>
          <button
            onClick={handleCreateTag}
            className="bg-primary text-light px-4 py-2 rounded-md hover:bg-tertiary transition-colors"
          >
            Nova Tag
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tags..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-secondary text-light px-4 py-2 rounded-md hover:bg-tertiary transition-colors"
          >
            Buscar
          </button>
        </form>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {currentTag ? "Editar Tag" : "Nova Tag"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <TagForm
                tag={currentTag}
                onSave={handleSaveTag}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : (
          <TagList
            tags={tags}
            onEdit={handleEditTag}
            onDelete={handleDeleteTag}
          />
        )}

        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
              className={`px-3 py-1 rounded ${
                pagination.pageIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-secondary text-light hover:bg-tertiary"
              }`}
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-light text-gray-800">
              Página {pagination.pageIndex + 1} de{" "}
              {Math.max(pagination.totalPages, 1)}
            </span>
            <button
              onClick={() => handlePageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= pagination.totalPages - 1}
              className={`px-3 py-1 rounded ${
                pagination.pageIndex >= pagination.totalPages - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-secondary text-light hover:bg-tertiary"
              }`}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManagement;
