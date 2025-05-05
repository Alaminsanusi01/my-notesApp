
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login.jsx';
import Register from "./pages/register.jsx";
import Dashboard from "./pages/Dashboard";
import Editor from "./components/noteeditor.jsx";
import ViewNote from "./pages/ViewNote";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:id?" element={<Editor />} />
        <Route path="/view/:id" element={<ViewNote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;