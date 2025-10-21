// src/components/domain/VoteHistoryItem.tsx
import { Box, HStack, VStack, Text, Image, Badge, Flex } from '@chakra-ui/react'
import type { VoteHistoryItem as VoteHistoryItemType } from '../../types/vote'

interface VoteHistoryItemProps {
  vote: VoteHistoryItemType;
}

export const VoteHistoryItem = ({ vote }: VoteHistoryItemProps) => {
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatHora = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box 
      p={4} 
      borderWidth={1} 
      borderRadius="lg" 
      bg="white"
      shadow="sm"
      borderColor={vote.ganador ? "green.200" : "border-light"}
      borderLeftWidth={vote.ganador ? "4px" : "1px"}
      borderLeftColor={vote.ganador ? "green.500" : "border-light"}
    >
      <Flex justify="space-between" align="start" gap={4}>
        {/* Información del jugador */}
        <HStack gap={3} flex="1">
          <Image
            src={vote.playerImagen || '/placeholder-player.jpg'}
            alt={vote.playerName}
            boxSize="60px"
            borderRadius="full"
            objectFit="cover"
          />
          <VStack align="start" gap={1} flex="1">
            <HStack gap={2}>
              <Text fontWeight="bold" fontSize="lg" color="text-primary">
                {vote.playerName}
              </Text>
              {vote.ganador && (
                <Badge colorScheme="green" variant="solid" size="sm" aria-label="Jugador ganador">
                🏆 Ganador
              </Badge>
              )}
            </HStack>
            {vote.playerApodo && (
              <Text fontSize="sm" color="text-secondary" fontStyle="italic">
                "{vote.playerApodo}"
              </Text>
            )}
            <Text fontSize="sm" color="text-secondary">
              {vote.playerPosicion} • #{vote.playerCamiseta}
            </Text>
          </VStack>
        </HStack>

        {/* Información del partido */}
        <VStack align="end" gap={1} minW="200px">
          <Text fontWeight="bold" fontSize="md" color="text-primary">
            vs {vote.matchRival}
          </Text>
          <Text fontSize="sm" color="text-secondary">
            {formatFecha(vote.matchFecha)}
          </Text>
          <Text fontSize="xs" color="text-secondary">
            Votado: {formatFecha(vote.fechaVoto)} {formatHora(vote.fechaVoto)}
          </Text>
        </VStack>
      </Flex>
    </Box>
  )
}