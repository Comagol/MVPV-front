import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { usePasswordReset } from "../hooks/usePasswordReset";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyResetToken } = usePasswordReset();

  // �� NUEVO: Verificar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError('Token no proporcionado');
        setIsValidatingToken(false);
        return;
      }

      try {
        const response = await verifyResetToken(token);
        setIsTokenValid(response.valid);
        if (!response.valid) {
          setTokenError('Token inválido o expirado');
        }
      } catch (error) {
        setTokenError('Error al verificar el token');
        setIsTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await authService.resetPassword({
        token: token!,
        newPassword: formData.newPassword
      });
      setMessage('Contraseña restablecida exitosamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError('Error al restablecer la contraseña. El token puede haber expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  // �� NUEVO: Estados de carga y error del token
  if (isValidatingToken) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50">
        <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
          <VStack gap={6}>
            <Heading size="lg" textAlign="center">
              Verificando Token...
            </Heading>
            <Text textAlign="center" color="gray.600">
              Por favor espera mientras verificamos tu enlace de recuperación.
            </Text>
          </VStack>
        </Box>
      </Box>
    );
  }

  // 🔥 NUEVO: Token inválido
  if (!isTokenValid || tokenError) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50">
        <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
          <VStack gap={6}>
            <Heading size="lg" textAlign="center" color="red.500">
              Enlace Inválido
            </Heading>
            <Box p={4} bg="red.100" color="red.700" rounded="md" w="full">
              <Text textAlign="center">
                {tokenError || 'El enlace de recuperación no es válido o ha expirado.'}
              </Text>
            </Box>
            <VStack gap={3} w="full">
              <Link to="/forgot-password" style={{ width: '100%' }}>
                <Button colorScheme="blue" size="lg" w="full">
                  Solicitar Nuevo Enlace
                </Button>
              </Link>
              <Link to="/login" style={{ width: '100%' }}>
                <Button variant="outline" size="lg" w="full">
                  Volver al Login
                </Button>
              </Link>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  // 🔥 NUEVO: Formulario solo se muestra si el token es válido
  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50">
      <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
        <VStack gap={6}>
          <Heading size="lg" textAlign="center" p={4}>
            Restablecer Contraseña
          </Heading>
          
          {/* �� NUEVO: Mensaje de confirmación de token válido */}
          <Box p={3} bg="green.100" color="green.700" rounded="md" w="full">
            <Text textAlign="center" fontSize="sm">
              ✅ Enlace verificado. Puedes restablecer tu contraseña.
            </Text>
          </Box>

          {error && (
            <Box p={4} bg="red.100" color="red.700" rounded="md">
              {error}
            </Box>
          )}
          {message && (
            <Box p={4} bg="green.100" color="green.700" rounded="md">
              {message}
            </Box>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack gap={4}>
              <Box w="full">
                <Text mb={2} fontWeight="medium">Nueva Contraseña</Text>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Tu nueva contraseña"
                  required
                />
              </Box>
              <Box w="full">
                <Text mb={2} fontWeight="medium">Confirmar Contraseña</Text>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </Box>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                loading={isLoading}
                loadingText="Restableciendo contraseña..."
              >
                Restablecer Contraseña
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;