import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login" 
import Register from "./pages/Register"
import Home from "./pages/Home"
import Game from "./pages/Game"
import PageNotFound from "./pages/PageNotFound"

function Logout () {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/register" element={<Register />} /> 
        <Route path="/game/:id" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        <Route path="/game" element={<Game />} />

        <Route path ="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
