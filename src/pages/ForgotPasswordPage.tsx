import { Box, Button, Input, VStack, Text, Image } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { authService } from "../services/authService";
import { useState } from "react";

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
    <Box flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
        <VStack gap={6}>
          {/* Logo de la app */}
          <Box w="140px" h="140px" rounded="full" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">Rugby MVP Voting</Text>
            <Image src="/favicon.png" alt="Logo" w="140px" h="140px" />
          </Box>
          <Heading size="lg" textAlign="center" p={4}>
            Recuperar Contraseña
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
                <Text mb={2} fontWeight="medium">Email</Text>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </Box>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                loading={isLoading}
                loadingText="Enviando email..."
              >
                Recuperar Contraseña
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;