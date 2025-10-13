import { useState } from 'react';
import { Box, VStack, HStack, Text, Input, Grid } from '@chakra-ui/react';
import type { CreatePlayerRequest, PlayerResponse } from '../../types';
import { Card, Button } from '../ui';

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
      await onSubmit(formData as CreatePlayerRequest);
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
    <Card variant="elevated">
      <VStack gap={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="text-primary">
          {isEditing ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
        </Text>
        
        <form onSubmit={handleSubmit}>
          <VStack gap={6} align="stretch">
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
              gap={4}
            >
              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Nombre *
                </Text>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del jugador"
                  required={!isEditing}
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Apodo *
                </Text>
                <Input
                  name="apodo"
                  value={formData.apodo}
                  onChange={handleInputChange}
                  placeholder="Apodo del jugador"
                  required={!isEditing}
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Posición *
                </Text>
                <Input
                  name="posicion"
                  value={formData.posicion}
                  onChange={handleInputChange}
                  placeholder="Ej: Fullback, Wing, etc."
                  required={!isEditing}
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  URL de Imagen *
                </Text>
                <Input
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  required={!isEditing}
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Número de Camiseta *
                </Text>
                <Input
                  name="camiseta"
                  type="number"
                  value={formData.camiseta}
                  onChange={handleInputChange}
                  placeholder="Número"
                  required={!isEditing}
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Camada *
                </Text>
                <Input
                  name="camada"
                  type="number"
                  value={formData.camada}
                  onChange={handleInputChange}
                  placeholder="Ej: 2020"
                  required={!isEditing}
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>
            </Grid>

            <HStack gap={3} justify="flex-end">
              {isEditing && onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
              
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? "Actualizando..." : "Creando...")
                  : (isEditing ? 'Actualizar Jugador' : 'Crear Jugador')
                }
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Card>
  );
};

export default PlayerForm;