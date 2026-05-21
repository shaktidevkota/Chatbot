import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Chat from "./pages/Chat"

export default function App() {
  return (
    <BrowserRouter>
      {/* Simple Navbar */}
      <nav className="bg-black text-white p-4 flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
      </nav>

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}