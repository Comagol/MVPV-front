import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useSessionActivity } from './hooks/useSessionActivity';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VotePage from './pages/VotePage';
import ThanksPage from './pages/ThanksPage';
import PlayersPage from './pages/admin/PlayersPage';
import MatchesPage from './pages/admin/MatchesPage';
import { PublicLayout } from './components/common/PublicLayout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const AppWithSessionTracking = () => {
  useSessionActivity(); // This will track user activity
  return null; // This component doesn't render anything
};

function App() {
  return(
    <AuthProvider>
      <AppWithSessionTracking />
      <Router>
        <Routes>
          {/* rutas Publicas */}
          <Route 
            path="/login" 
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            } 
          />  
          <Route 
            path="/forgot-password" 
            element={
              <PublicLayout>
                <ForgotPasswordPage />
              </PublicLayout>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicLayout>
                <ResetPasswordPage />
              </PublicLayout>
            } 
          />
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
                <MatchesPage/>
              </ProtectedRoute>} />

          {/* ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;