import React, { useState, useEffect } from "react";

const TagForm = ({ tag, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [tag]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nome da tag é obrigatório";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome da Tag
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Digite o nome da tag"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-light rounded-md hover:bg-tertiary transition-colors"
        >
          {tag ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
};

export default TagForm;
