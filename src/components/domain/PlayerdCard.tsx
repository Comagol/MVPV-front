import { Box, VStack, HStack, Text, Image, Icon } from '@chakra-ui/react'
import { Card, Button, Badge } from '../ui'
import { FaUser } from 'react-icons/fa'
import { memo } from 'react'

interface PlayerCardProps {
  player: {
    id: string
    nombre: string
    apodo?: string
    posicion: string
    camiseta: number
    imagen?: string
  }
  isSelected?: boolean
  onVote?: (playerId: string) => void
  isLoading?: boolean
  variant?: 'votable' | 'result' | 'winner'
}

export const PlayerCard = memo(({ 
  player, 
  isSelected = false, 
  onVote, 
  isLoading = false,
  variant = 'votable'
}: PlayerCardProps) => {
  const handleVote = () => {
    if (onVote && !isLoading) {
      onVote(player.id)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'result':
        return {
          border: '1px solid',
          borderColor: 'border-light',
          bg: 'bg-card',
        }
      case 'winner':
        return {
          border: '2px solid',
          borderColor: 'button-primary',
          bg: 'bg-card',
          shadow: 'md',
        }
      case 'votable':
      default:
        return {
          border: isSelected ? '2px solid' : '1px solid',
          borderColor: isSelected ? 'button-primary' : 'border-primary',
          bg: 'bg-card',
          cursor: 'pointer',
          _hover: {
            shadow: 'sm',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s',
        }
    }
  }

  return (
    <Card
      variant="outlined"
      {...getVariantStyles()}
      onClick={variant === 'votable' ? handleVote : undefined}
    >
      <VStack gap={4} align="center">
        {/* Imagen del jugador */}
        <Box position="relative">
            <Image
              src={player.imagen || '/placeholder-player.jpg'}
              alt={player.nombre}
              boxSize={{ base: "100px", md: "120px" }}
              borderRadius="full"
              objectFit="cover"
              border="3px solid"
              borderColor={isSelected ? 'button-primary' : 'border-light'}
            />
          {variant === 'winner' && (
          <Box
            position="absolute"
            top="-8px"
            right="-8px"
          >
            <Badge
              variant="position"
              bg="button-primary"
              color="text-white"
            >
              🏆
            </Badge>
          </Box>
        )}
        </Box>

        {/* Información del jugador */}
        <VStack gap={2} align="center">
          <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
            {player.nombre}
          </Text>
          
          {player.apodo && (
            <Text fontSize="sm" color="text-secondary" fontStyle="italic" textAlign="center">
              "{player.apodo}"
            </Text>
          )}

          <HStack gap={2}>
            <Badge variant="status" size="sm" bg="button-secondary" color="text-white">
              {player.posicion}
            </Badge>
            <Badge variant="number" size="sm">
              #{player.camiseta}
            </Badge>
          </HStack>
        </VStack>

        {/* Botón de voto (solo en variante votable) */}
        {variant === 'votable' && onVote && (
          <Button
            variant="primary"
            size="md"
            onClick={handleVote}
            loading={isLoading}
            loadingText="Votando..."
            w="full"
          >
            Votar por {player.nombre}
          </Button>
        )}

        {/* Icono de persona (fallback) */}
        {!player.imagen && (
          <Icon as={FaUser} boxSize="60px" color="border-light" />
        )}
      </VStack>
    </Card>
  )
})