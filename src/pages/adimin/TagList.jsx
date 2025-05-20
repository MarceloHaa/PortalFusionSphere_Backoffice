import React from "react";

const TagList = ({ tags, onEdit, onDelete }) => {
  if (!tags || tags.length === 0) {
    return (
      <div className="text-center py-8 bg-light rounded-lg">
        <p className="text-gray-600">Nenhuma tag encontrada.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-secondary text-light">
          <tr>
            <th className="py-3 px-4 text-left">Nome</th>
            <th className="py-3 px-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tags.map((tag) => (
            <tr key={tag.id} className="hover:bg-light">
              <td className="py-3 px-4">{tag.name}</td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(tag)}
                    className="px-3 py-1 bg-accent text-primary rounded hover:bg-primary hover:text-light transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(tag.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-700 hover:text-white transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TagList;
