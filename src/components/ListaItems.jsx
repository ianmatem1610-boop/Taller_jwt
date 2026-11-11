import React, { useState } from 'react';

export default function ListaItems({ items, onEliminar, onActualizar }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editGenero, setEditGenero] = useState('');
  const [editFoto, setEditFoto] = useState(null);

  const iniciarEdicion = (item) => {
    setEditingId(item.id);
    setEditTitulo(item.titulo);
    setEditGenero(item.genero);
    setEditFoto(null);
  };

  const cancelarEdicion = () => {
    setEditingId(null);
  };

  const guardarEdicion = async (id) => {
    const formData = new FormData();
    formData.append('titulo', editTitulo);
    formData.append('genero', editGenero);
    if (editFoto) {
      formData.append('foto', editFoto);
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/auth/items/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (response.ok) {
        const itemActualizado = await response.json();
        onActualizar(itemActualizado);
        setEditingId(null);
      } else {
        alert('Error al actualizar el registro');
      }
    } catch (error) {
      console.error('Error en la petición PUT:', error);
    }
  };

  return (
    <div className="items-grid">
      {items.map((item) => {
        let imageUrl = '';
        if (item.foto) {
          const mime = item.mimeType || 'image/jpeg';
          imageUrl = `data:${mime};base64,${item.foto}`;
        }

        const isEditing = editingId === item.id;

        return (
          <div className="card" key={item.id}>
            {imageUrl && <img src={imageUrl} alt={item.titulo} className="card-img" />}
            
            <div className="card-body">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    placeholder="Título"
                  />
                  <input
                    type="text"
                    value={editGenero}
                    onChange={(e) => setEditGenero(e.target.value)}
                    placeholder="Género"
                  />
                  <input
                    type="file"
                    onChange={(e) => setEditFoto(e.target.files[0])}
                  />
                  <div className="card-actions">
                    <button className="btn-save" onClick={() => guardarEdicion(item.id)}>Guardar</button>
                    <button className="btn-cancel" onClick={cancelarEdicion}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{item.titulo}</h3>
                  <p className="card-subtitle">{item.genero}</p>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => iniciarEdicion(item)}>Editar</button>
                    <button className="btn-delete" onClick={() => onEliminar(item.id)}>Eliminar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}