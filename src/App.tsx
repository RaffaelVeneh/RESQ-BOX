import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './app/Dashboard';
import Workspace from './app/Workspace';
import Mitigation from './app/Mitigation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/mitigation" element={<Mitigation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
