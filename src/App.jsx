import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GestionItems from './pages/GestionItems';
import ListaItems from './components/ListaItems';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GestionItems />} />
        <Route path="/items" element={<ListaItems />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;