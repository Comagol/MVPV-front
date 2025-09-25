import { useState } from "react";
import { authService } from "../services/authService";


export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword({ email });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({ token, newPassword });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetToken = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyResetToken(token);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al verificar token');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { forgotPassword, resetPassword, verifyResetToken, isLoading, error };
};