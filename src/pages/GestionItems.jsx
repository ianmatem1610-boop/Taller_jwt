import React, { useState, useEffect } from 'react';
import ListaItems from '../components/ListaItems';

export default function GestionItems() {
  const [items, setItems] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [foto, setFoto] = useState(null);

  const obtenerItems = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8080/auth/items', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error al cargar items:', error);
    }
  };

  useEffect(() => {
    obtenerItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('genero', genero);
    if (foto) {
      formData.append('foto', foto);
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/auth/items', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (res.ok) {
        setTitulo('');
        setGenero('');
        setFoto(null);
        obtenerItems();
      } else {
        alert('Error al crear el elemento');
      }
    } catch (error) {
      console.error('Error al crear:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:8080/auth/items/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert('No se pudo eliminar el registro');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleActualizarItem = (itemActualizado) => {
    setItems(items.map(i => i.id === itemActualizado.id ? itemActualizado : i));
  };

  return (
    <div className="gestion-container">
      <h2>Gestión de Videojuegos (CRUD de Imágenes)</h2>
      
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          placeholder="Título del videojuego"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Género"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files[0])}
        />
        <button type="submit" className="btn-submit">Guardar Videojuego</button>
      </form>

      <hr />

      <ListaItems 
        items={items} 
        onEliminar={handleEliminar} 
        onActualizar={handleActualizarItem} 
      />
    </div>
  );
}