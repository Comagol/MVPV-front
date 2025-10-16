import { Box, Input, VStack, Text, Image } from "@chakra-ui/react";
import { authService } from "../services/authService";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Button } from "../components/ui";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await authService.forgotPassword({ email });
      setMessage('Si el email está registrado, recibirás un enlace para restablecer tu contraseña.');
    } catch (err: any) {
      setError('Error al enviar el email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      flex="1" 
      display="flex" 
      flexDirection="column" 
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
            Recuperar Contraseña
          </Text>

          <Text fontSize="sm" color="text-secondary" textAlign="center">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
          
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
                  Email
                </Text>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
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
                {isLoading ? 'Enviando email...' : 'Enviar Enlace de Recuperación'}
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="text-secondary">
            ¿Ya tienes cuenta?{' '}
            <RouterLink 
              to="/login" 
              color="button-primary" 
              style={{ fontSize: "sm", textDecoration: "underline" }}
            >
              Inicia sesión aquí
            </RouterLink>
          </Text>
        </VStack>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;