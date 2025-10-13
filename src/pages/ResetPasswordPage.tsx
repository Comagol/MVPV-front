import { useState, useEffect } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Box, VStack, Text, Image, Input, Spinner } from "@chakra-ui/react";
import { usePasswordReset } from "../hooks/usePasswordReset";
import { Card, Button } from "../components/ui";

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

  // Verificar token al cargar la página
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

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
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

  // Estado de carga
  if (isValidatingToken) {
    return (
      <Box 
        flex="1" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        py={{ base: 8, md: 16 }}
        px={4}
      >
        <Card variant="elevated" maxW="md" w="full">
          <VStack gap={6}>
            <Spinner size="xl" color="button-primary" />
            <Text fontSize="xl" fontWeight="semibold" color="text-primary" textAlign="center">
              Verificando Token...
            </Text>
            <Text textAlign="center" color="text-secondary" fontSize="sm">
              Por favor espera mientras verificamos tu enlace de recuperación.
            </Text>
          </VStack>
        </Card>
      </Box>
    );
  }

  // Token inválido
  if (!isTokenValid || tokenError) {
    return (
      <Box 
        flex="1" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        py={{ base: 8, md: 16 }}
        px={4}
      >
        <Card variant="elevated" maxW="md" w="full">
          <VStack gap={6} align="stretch">
            <VStack gap={3}>
              <Image src="/favicon.png" alt="Logo" boxSize="120px" />
              <Text fontSize="2xl" fontWeight="bold" color="text-primary" textAlign="center">
                VICENTINOS MVP
              </Text>
            </VStack>

            <Text fontSize="xl" fontWeight="semibold" color="red.500" textAlign="center">
              Enlace Inválido
            </Text>

            <Card variant="outlined" borderColor="red.500" bg="red.50">
              <Text color="red.600" fontSize="sm" textAlign="center">
                {tokenError || 'El enlace de recuperación no es válido o ha expirado.'}
              </Text>
            </Card>

            <VStack gap={3} w="full">
              <Button
                onClick={() => navigate('/forgot-password')}
                variant="primary"
                size="lg"
                w="full"
              >
                Solicitar Nuevo Enlace
              </Button>
              <RouterLink
                to="/login"
                color="button-primary"
                style={{ fontSize: "sm", textDecoration: "underline" }}
              >
                Volver al Login
              </RouterLink>
            </VStack>
          </VStack>
        </Card>
      </Box>
    );
  }

  // Formulario (token válido)
  return (
    <Box 
      flex="1" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      py={{ base: 8, md: 16 }}
      px={4}
    >
      <Card variant="elevated" maxW="md" w="full">
        <VStack gap={6} align="stretch">
          {/* Logo de la app */}
          <VStack gap={3}>
            <Image src="/favicon.png" alt="Logo" boxSize="120px" />
            <Text fontSize="2xl" fontWeight="bold" color="text-primary" textAlign="center">
              VICENTINOS MVP
            </Text>
          </VStack>
          
          <Text fontSize="xl" fontWeight="semibold" color="text-primary" textAlign="center">
            Restablecer Contraseña
          </Text>
          
          {/* Mensaje de confirmación de token válido */}
          <Card variant="outlined" borderColor="green.500" bg="green.50">
            <Text color="green.600" fontSize="sm" textAlign="center">
              ✅ Enlace verificado. Puedes restablecer tu contraseña.
            </Text>
          </Card>

          {error && (
            <Card variant="outlined" borderColor="red.500" bg="red.50">
              <Text color="red.600" fontSize="sm" textAlign="center">
                {error}
              </Text>
            </Card>
          )}

          {message && (
            <Card variant="outlined" borderColor="green.500" bg="green.50">
              <Text color="green.600" fontSize="sm" textAlign="center">
                {message}
              </Text>
            </Card>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack gap={4}>
              <Box w="full">
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Nueva Contraseña
                </Text>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box w="full">
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Confirmar Contraseña
                </Text>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirma tu nueva contraseña"
                  required
                  minLength={6}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                w="full"
                disabled={isLoading}
              >
                {isLoading ? 'Restableciendo contraseña...' : 'Restablecer Contraseña'}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage;