import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VotePage from './pages/VotePage';
import ThanksPage from './pages/ThanksPage';
import PlayersPage from './pages/admin/PlayersPage';
import MatchPage from './pages/admin/MatchesPage';

function App() {
  return(
    <AuthProvider>
      <Router>
        <Routes>
          {/* rutas Publicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* rutas Protegidas */}
          <Route 
            path='vote' 
            element={
            <ProtectedRoute>
              <VotePage/>
            </ProtectedRoute>} />
          <Route 
            path='thanks' 
            element={
              <ProtectedRoute>
                <ThanksPage/>
              </ProtectedRoute>} />

          {/* rutas de Admin */}
          <Route 
            path='/admin/players' 
            element={
              <ProtectedRoute>
                <PlayersPage/>
              </ProtectedRoute>} />

          <Route 
            path='/admin/matches' 
            element={
              <ProtectedRoute>
                <MatchPage/>
              </ProtectedRoute>} />

          {/* ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;