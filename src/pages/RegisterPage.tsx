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
import type { RegisterRequest } from '../types';

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    nombre: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
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
      await register(formData);
      navigate('/vote');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Box maxW="md" w="full" p={8} bg="white" rounded="lg" shadow="md">
        <VStack gap={6}>
          {/* Logo de la app */}
          <Box w="140px" h="140px" rounded="full" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Text fontSize="lg" fontWeight="bold" mb={2} textAlign="center">Rugby MVP Voting</Text>
            <Image src="/favicon.png" alt="Logo" w="140px" h="140px" />
          </Box>
            <Heading size="lg" textAlign="center" p={4}>
            Registrarse
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
                <Text mb={2} fontWeight="medium">Nombre</Text>
                <Input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
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
                loadingText="Registrando..."
              >
                Registrarse
              </Button>
            </VStack>
          </form>

          <Text textAlign="center">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#3182ce', textDecoration: 'underline' }}>
              Inicia sesión aquí
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;