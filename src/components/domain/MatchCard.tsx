import {  VStack, HStack, Text, Badge } from '@chakra-ui/react'
import { Card, Button } from '../ui'

interface MatchCardProps {
  match: {
    id: string
    rival: string
    fecha: string | Date
    estado: 'programado' | 'en_proceso' | 'finalizado'  
    resultado?: {
      vicentinos: number
      rival: number
    }
  }
  onVote?: () => void
  showVoteButton?: boolean
}

export const MatchCard = ({ match, onVote, showVoteButton = true }: MatchCardProps) => {
  const getEstadoColor = () => {
    switch (match.estado) {
      case 'en_proceso':
        return 'button-primary'
      case 'finalizado':
        return 'text-secondary'
      case 'programado':
      default:
        return 'button-secondary'
    }
  }

  const getEstadoText = () => {
    switch (match.estado) {
      case 'en_proceso':
        return 'En Vivo'
      case 'finalizado':
        return 'Finalizado'
      case 'programado':
      default:
        return 'Programado'
    }
  }

  return (
    <Card variant="outlined">
      <VStack gap={4} align="stretch">
        {/* Header del partido */}
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold" color="text-primary">
            VICENTINOS
          </Text>
          <Badge variant="outline" bg={getEstadoColor()} color="text-white">
            {getEstadoText()}
          </Badge>
        </HStack>

        {/* Información del partido */}
        <VStack gap={2}>
          <Text fontSize="xl" fontWeight="bold" color="text-primary" textAlign="center">
            vs {match.rival}
          </Text>
          
          <Text fontSize="sm" color="text-secondary" textAlign="center">
            {new Date(match.fecha).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>

          {/* Resultado (si está disponible) */}
          {match.resultado && (
            <HStack gap={4} justify="center">
              <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                {match.resultado.vicentinos}
              </Text>
              <Text fontSize="lg" color="text-secondary">-</Text>
              <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                {match.resultado.rival}
              </Text>
            </HStack>
          )}
        </VStack>

        {/* Botón de voto */}
        {showVoteButton && onVote && match.estado === 'en_proceso' && (
          <Button
            variant="primary"
            size="lg"
            onClick={onVote}
            w="full"
          >
            Votá al jugador del partido
          </Button>
        )}

        {/* Mensaje según estado */}
        {match.estado === 'programado' && (
          <Text fontSize="sm" color="text-secondary" textAlign="center">
            El partido aún no ha comenzado
          </Text>
        )}
        
        {match.estado === 'finalizado' && (
          <Text fontSize="sm" color="text-secondary" textAlign="center">
            Partido finalizado
          </Text>
        )}
      </VStack>
    </Card>
  )
}