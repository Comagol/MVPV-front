import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import type { CreateMatchRequest, PlayerResponse } from '../../types';
import PlayerSelector from './PlayerSelector';

interface MatchFormProps {
  onSubmit: (data: CreateMatchRequest) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  players: PlayerResponse[];
}

const MatchForm = ({ onSubmit, onCancel, isEditing = false, players }: MatchFormProps) => {
  const [formData, setFormData] = useState<CreateMatchRequest>({
    fecha: new Date(),
    jugadores: [],
    description: '',
    rival: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validación en tiempo real
  useEffect(() => {
    const playerCount = formData.jugadores.length;
    if (playerCount > 0 && (playerCount < 15 || playerCount > 23)) {
      setValidationError(`Debes seleccionar entre 15 y 23 jugadores. Actualmente: ${playerCount}`);
    } else {
      setValidationError(null);
    }
  }, [formData.jugadores]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fecha' ? new Date(value) : value
    }));
  };

  const handlePlayersChange = (selectedPlayerIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      jugadores: selectedPlayerIds
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.jugadores.length < 15 || formData.jugadores.length > 23) {
      setValidationError('Debes seleccionar entre 15 y 23 jugadores');
      return;
    }

    if (!formData.rival.trim() || !formData.description.trim()) {
      setValidationError('Todos los campos son obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Limpiar formulario después de crear
      if (!isEditing) {
        setFormData({
          fecha: new Date(),
          jugadores: [],
          description: '',
          rival: '',
        });
      }
    } catch (error) {
      console.error('Error en formulario:', error);
      setValidationError('Error al procesar el partido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md" borderWidth="1px">
      <Heading size="md" mb={4}>
        {isEditing ? 'Editar Partido' : 'Crear Nuevo Partido'}
      </Heading>
      
      {validationError && (
        <Box 
          bg="red.50" 
          borderColor="red.200" 
          borderWidth="1px" 
          rounded="md" 
          p={3} 
          mb={4}
        >
          <Text color="red.600" fontSize="sm">
            {validationError}
          </Text>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box>
              <Text mb={2} fontWeight="medium">Fecha del Partido *</Text>
              <Input
                name="fecha"
                type="datetime-local"
                value={formData.fecha.toISOString().slice(0, 16)}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Equipo Rival *</Text>
              <Input
                name="rival"
                value={formData.rival}
                onChange={handleInputChange}
                placeholder="Ej: Los Pumas, San Martín, etc."
                required
                disabled={isSubmitting}
              />
            </Box>
          </SimpleGrid>

          <Box>
            <Text mb={2} fontWeight="medium">Descripción del Partido *</Text>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ej: Partido amistoso de preparación..."
              required
              disabled={isSubmitting}
            />
          </Box>

          {/* Selector de Jugadores */}
          <PlayerSelector
            players={players}
            selectedPlayerIds={formData.jugadores}
            onPlayersChange={handlePlayersChange}
            disabled={isSubmitting}
          />

          <Box>
            <Button 
              type="submit" 
              colorScheme="blue" 
              size="lg"
              loading={isSubmitting}
              loadingText={isEditing ? "Actualizando..." : "Creando..."}
              disabled={!!validationError}
            >
              {isEditing ? 'Actualizar Partido' : 'Crear Partido'}
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
        </VStack>
      </form>
    </Box>
  );
};

export default MatchForm;