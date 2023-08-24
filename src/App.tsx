import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://proyecto-backend-nine.vercel.app/usuarios";
// const BASE_URL = "http://localhost:5000/usuarios";

interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
}

const App: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nuevoUsuario, setNuevoUsuario] = useState<Partial<Usuario>>({
    nombre: "",
    correo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<boolean>(false);
  const [addUsuarioError, setAddUsuarioError] = useState<string[] | null>(null);

  useEffect(() => {
    fetchUsuarios();
  });

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setUsuarios(response.data);
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`${BASE_URL}/${_id}`);
      fetchUsuarios();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleAddUsuario = async () => {
    try {
      await axios.post(BASE_URL, nuevoUsuario);
      setNuevoUsuario({ nombre: "", correo: "" });
      fetchUsuarios();
      setAddUsuarioError(null);
    } catch (error: any) {
      setAddUsuarioError(error.response.data.errores.map((e: any) => e.msg));
    }
  };

  const handleEdit = (user: Usuario) => {
    setUsuario(user);
    setEditando(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/${usuario?._id}`, usuario);
      setEditando(false);
      setUsuario(null);
      fetchUsuarios();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (error.response) {
      setError(error.response.data.message);
    } else {
      setError("Hubo un problema al realizar la solicitud.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Usuarios</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Agregar Nuevo Usuario</h2>
        <input
          type="text"
          value={nuevoUsuario.nombre || ""}
          onChange={(e) =>
            setNuevoUsuario((prevUsuario) => ({
              ...prevUsuario,
              nombre: e.target.value,
            }))
          }
          className="border p-2 mb-2"
          placeholder="Nombre"
        />
        <input
          type="text"
          value={nuevoUsuario.correo || ""}
          onChange={(e) =>
            setNuevoUsuario((prevUsuario) => ({
              ...prevUsuario,
              correo: e.target.value,
            }))
          }
          className="border p-2 mb-2"
          placeholder="Correo"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddUsuario}
        >
          Agregar Usuario
        </button>
        {addUsuarioError && (
          <div className="text-red-500 mt-2">
            {/* Map addUsuarioError array */}
            {addUsuarioError.map((e) => (
              <div key={e}>*{e}</div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Lista de Usuarios</h2>
        <ul>
          {usuarios.map((user) => (
            <li key={user._id} className="mb-2">
              {user.nombre} - {user.correo}
              <button
                className="ml-2 text-green-500"
                onClick={() => handleEdit(user)}
              >
                Editar
              </button>
              <button
                className="ml-2 text-red-500"
                onClick={() => handleDelete(user._id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {editando && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Editar Usuario</h2>
          <input
            type="text"
            value={usuario?.nombre || ""}
            onChange={(e) =>
              setUsuario((prevUsuario) => ({
                ...prevUsuario!,
                nombre: e.target.value,
              }))
            }
            className="border p-2 mb-2"
            placeholder="Nombre"
          />
          <input
            type="text"
            value={usuario?.correo || ""}
            onChange={(e) =>
              setUsuario((prevUsuario) => ({
                ...prevUsuario!,
                correo: e.target.value,
              }))
            }
            className="border p-2 mb-2"
            placeholder="Email"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Guardar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            onClick={() => {
              setEditando(false);
              setUsuario(null);
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
