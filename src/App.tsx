import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './app/Dashboard';
import Workspace from './app/Workspace';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
