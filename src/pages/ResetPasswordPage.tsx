import { useState } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

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

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50">
      <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
        <VStack gap={6}>
          <Heading size="lg" textAlign="center" p={4}>
            Restablecer Contraseña
          </Heading>
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