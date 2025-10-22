// src/components/domain/VoteHistoryItem.tsx
import { Box, HStack, VStack, Text, Image, Badge, Flex, Stack } from '@chakra-ui/react'
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
      p={{ base: 3, md: 4 }} 
      borderWidth={1} 
      borderRadius="lg" 
      bg="white"
      shadow="sm"
      borderColor={vote.ganador ? "green.200" : "border-light"}
      borderLeftWidth={vote.ganador ? "4px" : "1px"}
      borderLeftColor={vote.ganador ? "green.500" : "border-light"}
    >
      {/* Layout responsive: Stack en mobile, Flex en desktop */}
      <Stack 
        direction={{ base: "column", md: "row" }} 
        gap={{ base: 3, md: 4 }}
        align={{ base: "stretch", md: "start" }}
      >
        {/* Información del jugador */}
        <HStack gap={3} flex="1" align="start">
          <Image
            src={vote.playerImagen}
            alt={vote.playerName}
            boxSize={{ base: "50px", md: "60px" }}
            borderRadius="full"
            objectFit="cover"
            flexShrink={0}
          />
          <VStack align="start" gap={1} flex="1" minW={0}>
            <HStack gap={2} wrap="wrap">
              <Text 
                fontWeight="bold" 
                fontSize={{ base: "md", md: "lg" }} 
                color="text-primary"
                wordBreak="break-word"
              >
                {vote.playerName}
              </Text>
              {vote.ganador && (
                <Badge colorScheme="green" variant="solid" size="sm">
                  🏆 Ganador
                </Badge>
              )}
            </HStack>
            {vote.playerApodo && (
              <Text 
                fontSize="sm" 
                color="text-secondary" 
                fontStyle="italic"
                wordBreak="break-word"
              >
                "{vote.playerApodo}"
              </Text>
            )}
            <Text 
              fontSize="sm" 
              color="text-secondary"
              wordBreak="break-word"
            >
              {vote.playerPosicion} • #{vote.playerCamiseta}
            </Text>
          </VStack>
        </HStack>

        {/* Información del partido */}
        <VStack 
          align={{ base: "start", md: "end" }} 
          gap={1} 
          minW={{ base: "auto", md: "200px" }}
          flexShrink={0}
        >
          <Text 
            fontWeight="bold" 
            fontSize={{ base: "sm", md: "md" }} 
            color="text-primary"
            textAlign={{ base: "left", md: "right" }}
            wordBreak="break-word"
          >
            vs {vote.matchRival}
          </Text>
          <Text 
            fontSize="sm" 
            color="text-secondary"
            textAlign={{ base: "left", md: "right" }}
          >
            {formatFecha(vote.matchFecha)}
          </Text>
          <Text 
            fontSize="xs" 
            color="text-secondary"
            textAlign={{ base: "left", md: "right" }}
          >
            Votado: {formatFecha(vote.fechaVoto)} {formatHora(vote.fechaVoto)}
          </Text>
        </VStack>
      </Stack>
    </Box>
  )
}