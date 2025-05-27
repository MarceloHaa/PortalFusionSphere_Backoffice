import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { blogImageService } from "../services/blogService";

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [source, setSource] = useState("");
  const [tags, setTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [newTag, setNewTag] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 5,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    if (!source.trim()) {
      alert("Por favor, informe a fonte da imagem");
      return;
    }

    setIsUploading(true);
    const results = [];

    for (const file of files) {
      try {
        const response = await blogImageService.create({
          file: file,
          source: source.trim(),
          tags: tags,
        });
        results.push({
          fileName: file.name,
          success: true,
          message: "Upload realizado com sucesso!",
          data: response,
        });
      } catch (error) {
        results.push({
          fileName: file.name,
          success: false,
          message: error.message || "Erro ao fazer upload",
        });
      }
    }

    setUploadResults(results);
    setIsUploading(false);
    setFiles([]);
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-light rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Upload de Imagens
      </h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 
          ${
            isDragActive
              ? "border-accent bg-tertiary bg-opacity-10"
              : "border-secondary hover:border-accent"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-neutral mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-secondary">
            {isDragActive
              ? "Solte as imagens aqui..."
              : "Arraste e solte imagens aqui, ou clique para selecionar"}
          </p>
          <p className="text-sm text-neutral mt-1">
            Formatos suportados: JPEG, PNG, GIF. Máx. 5 arquivos.
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-primary">
            Arquivos selecionados:
          </h3>
          <ul className="divide-y divide-accent">
            {files.map((file, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span className="text-secondary">{file.name}</span>
                <span className="text-neutral">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-primary">
          Informações adicionais:
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary mb-1">
            Fonte da imagem
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-accent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Ex: Blog, Marketing, etc."
            required
          />
          {!source.trim() && (
            <p className="mt-1 text-sm text-dark">Este campo é obrigatório</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            Tags
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              className="flex-1 px-3 py-2 border border-accent rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Digite uma tag e pressione Enter"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-primary text-light rounded-r-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Adicionar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-primary text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="ml-2 text-primary hover:text-tertiary"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || files.length === 0}
        className={`w-full py-2 px-4 rounded-md text-light font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isUploading || files.length === 0
              ? "bg-neutral cursor-not-allowed"
              : "bg-primary hover:bg-tertiary focus:ring-accent"
          }`}
      >
        {isUploading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-light"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enviando...
          </span>
        ) : (
          "Enviar Imagens"
        )}
      </button>

      {uploadResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-primary">
            Resultados:
          </h3>
          <ul className="space-y-2">
            {uploadResults.map((result, index) => (
              <li
                key={index}
                className={`p-3 rounded-md ${
                  result.success
                    ? "bg-accent bg-opacity-20"
                    : "bg-secondary bg-opacity-20"
                }`}
              >
                <div className="flex items-center">
                  {result.success ? (
                    <svg
                      className="h-5 w-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-secondary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <div>
                    <p className="font-medium text-secondary">
                      {result.fileName}
                    </p>
                    <p
                      className={`text-sm ${
                        result.success ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
