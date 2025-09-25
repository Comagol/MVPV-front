import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Image
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../types';

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      await login(formData);
      navigate('/vote');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50">
      <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
        <VStack gap={6}>
          {/* Logo de la app */}
          <Box w="140px" h="140px" rounded="full" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">Rugby MVP Voting</Text>
            <Image src="/favicon.png" alt="Logo" w="140px" h="140px" />
          </Box>
          
          <Heading size="lg" textAlign="center" p={4}>
            Iniciar Sesión
          </Heading>
          
          {error && (
            <Box p={4} bg="red.100" color="red.700" rounded="md">
              {error}
            </Box>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack gap={4}>
            <Box w="full">
              <Text mb={2} fontWeight="medium">Email</Text>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </Box>

            <Box w="full">
              <Text mb={2} fontWeight="medium">Contraseña</Text>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
              />
            </Box>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                loading={isLoading}
                loadingText="Iniciando sesión..."
              >
                Iniciar Sesión
              </Button>
            </VStack>
          </form>

          <Text textAlign="center">
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#3182ce', textDecoration: 'underline' }}>
              Regístrate aquí
            </Link>
          </Text>
          <Text textAlign="center" mt={2}>
            <Link to="/forgot-password" style={{ color: '#3182ce', textDecoration: 'underline' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;