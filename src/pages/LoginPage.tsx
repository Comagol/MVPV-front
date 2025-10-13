import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Input,
  VStack,
  Text,
  Image,
  HStack
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import type { LoginRequest } from '../types';
import { Card, Button } from '../components/ui';

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, loginWithGoogle } = useAuth();
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

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      navigate('/vote');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setIsGoogleLoading(false);
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
            Iniciar Sesión
          </Text>
          
          {error && (
            <Card variant="outlined" borderColor="red.500" bg="red.50">
              <Text color="red.600" fontSize="sm" textAlign="center">
                {error}
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box w="full">
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Contraseña
                </Text>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
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
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <HStack w="full" gap={2}>
                <Box flex="1" h="1px" bg="border-light" />
                <Text fontSize="sm" color="text-secondary">o</Text>
                <Box flex="1" h="1px" bg="border-light" />
              </HStack>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                size="lg"
                w="full"
                disabled={isGoogleLoading}
                leftIcon={<FaGoogle />}
              >
                {isGoogleLoading ? 'Iniciando con Google...' : 'Continuar con Google'}
              </Button>
            </VStack>
          </form>

          <VStack gap={2}>
            <Text textAlign="center" fontSize="sm" color="text-secondary">
              ¿No tienes cuenta?{' '}
              <RouterLink 
                to="/register" 
                color="button-primary" 
                style={{ textDecoration: "underline" }}
              >
                Regístrate aquí
              </RouterLink>
            </Text>
            <RouterLink 
              to="/forgot-password" 
              color="button-primary" 
              style={{ fontSize: "sm", textDecoration: "underline" }}
            >
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </VStack>
        </VStack>
      </Card>
    </Box>
  );
};

export default LoginPage;