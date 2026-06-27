import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Tutors from './pages/Tutors'
import Marketplace from './pages/Marketplace'
import Opportunities from './pages/Opportunities'

const Protected = ({ children }) => localStorage.getItem('campus_token') ? children : <Navigate to="/login" replace />

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tutors" element={<Protected><Tutors /></Protected>} />
      <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
      <Route path="/opportunities" element={<Protected><Opportunities /></Protected>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
