import { useState } from 'react';
import { Box, VStack, Heading, Text, Input, Button, SimpleGrid } from '@chakra-ui/react';
import type { CreatePlayerRequest, PlayerResponse } from '../../types';

interface PlayerFormProps {
  onSubmit: (data: CreatePlayerRequest) => Promise<void>;
  onCancel?: () => void;
  initialData?: PlayerResponse | null;
  isEditing?: boolean;
}

const PlayerForm = ({ onSubmit, onCancel, initialData, isEditing = false }: PlayerFormProps) => {
  const [formData, setFormData] = useState<CreatePlayerRequest>({
    nombre: initialData?.nombre || '',
    apodo: initialData?.apodo || '',
    posicion: initialData?.posicion || '',
    imagen: initialData?.imagen || '',
    camiseta: initialData?.camiseta || 0,
    camada: initialData?.camada || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'camiseta' || name === 'camada' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Limpiar formulario solo si no está editando
      if (!isEditing) {
        setFormData({
          nombre: '',
          apodo: '',
          posicion: '',
          imagen: '',
          camiseta: 0,
          camada: 0,
        });
      }
    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md" borderWidth="1px">
      <Heading size="md" mb={4}>
        {isEditing ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Box>
            <Text mb={2} fontWeight="medium">Nombre *</Text>
            <Input
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del jugador"
              required
              disabled={isSubmitting}
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium">Apodo *</Text>
            <Input
              name="apodo"
              value={formData.apodo}
              onChange={handleInputChange}
              placeholder="Apodo del jugador"
              required
              disabled={isSubmitting}
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium">Posición *</Text>
            <Input
              name="posicion"
              value={formData.posicion}
              onChange={handleInputChange}
              placeholder="Ej: Fullback, Wing, etc."
              required
              disabled={isSubmitting}
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium">URL de Imagen *</Text>
            <Input
              name="imagen"
              value={formData.imagen}
              onChange={handleInputChange}
              placeholder="https://..."
              required
              disabled={isSubmitting}
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium">Número de Camiseta *</Text>
            <Input
              name="camiseta"
              type="number"
              value={formData.camiseta}
              onChange={handleInputChange}
              placeholder="Número"
              required
              disabled={isSubmitting}
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium">Camada *</Text>
            <Input
              name="camada"
              type="number"
              value={formData.camada}
              onChange={handleInputChange}
              placeholder="Ej: 2020"
              required
              disabled={isSubmitting}
            />
          </Box>
        </SimpleGrid>

        <Box mt={4}>
          <Button 
            type="submit" 
            colorScheme="blue" 
            size="lg"
            loading={isSubmitting}
            loadingText={isEditing ? "Actualizando..." : "Creando..."}
          >
            {isEditing ? 'Actualizar Jugador' : 'Crear Jugador'}
          </Button>
          
          {isEditing && onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              ml={4} 
              size="lg"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default PlayerForm;