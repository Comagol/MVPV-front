import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Input,
  VStack,
  HStack,
  Grid,
  Textarea,
} from '@chakra-ui/react';
import type { CreateMatchRequest, PlayerResponse } from '../../types';
import PlayerSelector from './PlayerSelector';
import { Card, Button } from '../ui';

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
      [name]: name === 'fecha' ? parseDateFromInput(value) : value
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

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const parseDateFromInput = (dateString: string): Date => {
    return new Date(dateString);
  };

  return (
    <Card variant="elevated">
      <VStack gap={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="text-primary">
          {isEditing ? 'Editar Partido' : 'Crear Nuevo Partido'}
        </Text>
        
        {validationError && (
          <Card variant="outlined" borderColor="red.500" bg="red.50">
            <Text color="red.600" fontSize="sm">
              {validationError}
            </Text>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <VStack gap={6} align="stretch">
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
              gap={4}
            >
              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Fecha del Partido *
                </Text>
                <Input
                  name="fecha"
                  type="datetime-local"
                  value={formatDateForInput(formData.fecha)}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium" color="text-primary">
                  Equipo Rival *
                </Text>
                <Input
                  name="rival"
                  value={formData.rival}
                  onChange={handleInputChange}
                  placeholder="Ej: Los Pumas, San Martín, etc."
                  required
                  disabled={isSubmitting}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
              </Box>
            </Grid>

            <Box>
              <Text mb={2} fontWeight="medium" color="text-primary">
                Descripción del Partido *
              </Text>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ej: Partido amistoso de preparación..."
                required
                disabled={isSubmitting}
                bg="bg-primary"
                borderColor="border-primary"
                _focus={{ borderColor: "button-primary" }}
                rows={3}
              />
            </Box>

            {/* Selector de Jugadores */}
            <PlayerSelector
              players={players}
              selectedPlayerIds={formData.jugadores}
              onPlayersChange={handlePlayersChange}
              disabled={isSubmitting}
            />

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
                disabled={isSubmitting || !!validationError}
              >
                {isSubmitting 
                  ? (isEditing ? "Actualizando..." : "Creando...")
                  : (isEditing ? 'Actualizar Partido' : 'Crear Partido')
                }
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Card>
  );
};

export default MatchForm;