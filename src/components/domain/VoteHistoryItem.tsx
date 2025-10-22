// src/components/domain/VoteHistoryItem.tsx
import { HStack, VStack, Text, Image, Badge, Stack } from '@chakra-ui/react'
import type { VoteHistoryItem as VoteHistoryItemType } from '../../types/vote'
import { Card } from '../ui'

interface VoteHistoryItemProps {
  vote: VoteHistoryItemType;
}

export const VoteHistoryItem = ({ vote }: VoteHistoryItemProps) => {
  const formatFecha = (fecha: string, includeTime: boolean = false) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
    })
  }

  return (
    <Card p={4} mb={4} w="100%"
      borderColor={vote.ganador ? "green.200" : "gray.200"}
      borderLeftColor={vote.ganador ? "green.500" : "gray.300"}
      borderLeftWidth={vote.ganador ? "4px" : "2px"}
      boxShadow="md"
      borderRadius="lg"
    >
      <Stack direction={{ base: 'column', md: 'row' }} gap={4} align="center" justify="space-between">
        {/* Player Info */}
        <HStack gap={3} flexShrink={0}>
          <Image
            borderRadius="full"
            boxSize="60px"
            src={vote.playerImagen || '/default-player.png'}
            alt={vote.playerName}
            objectFit="cover"
          />
          <VStack align="flex-start" gap={0}>
            <Text fontWeight="bold" fontSize="md" wordBreak="break-word">{vote.playerName}</Text>
            {vote.playerApodo && <Text fontSize="sm" color="gray.500" wordBreak="break-word">"{vote.playerApodo}"</Text>}
            <Text fontSize="xs" color="gray.600" wordBreak="break-word">{vote.playerPosicion} • #{vote.playerCamiseta}</Text>
          </VStack>
        </HStack>

        {/* Match Info */}
        <VStack align={{ base: 'flex-start', md: 'flex-end' }} gap={0} flexGrow={1} textAlign={{ base: 'left', md: 'right' }}>
          <Text fontSize="sm" color="gray.700" wordBreak="break-word">
            vs {vote.matchRival}
          </Text>
          <Text fontSize="xs" color="gray.500" wordBreak="break-word">{formatFecha(vote.matchFecha)}</Text>
          <Text fontSize="xs" color="gray.500" wordBreak="break-word">Votado: {formatFecha(vote.fechaVoto, true)}</Text>
          {vote.ganador && (
            <Badge colorScheme="green" mt={1} wordBreak="break-word">Ganador</Badge>
          )}
        </VStack>
      </Stack>
    </Card>
  )
}