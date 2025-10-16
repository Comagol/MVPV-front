import { Box, HStack, Text, Image } from '@chakra-ui/react'

interface HistoryItemProps {
  match: {
    id: string
    fecha: string
    rival: string
    resultado?: {
      vicentinos: number
      rival: number
    }
    mvp?: {
      nombre: string
      imagen?: string
    }
  }
  isLast?: boolean
}

export const HistoryItem = ({ match, isLast = false }: HistoryItemProps) => {
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" py={3}>
        <HStack gap={3}>
          <Text fontSize="sm" fontWeight="medium" color="text-secondary">
            Fecha {formatFecha(match.fecha)}
          </Text>
          <Text fontSize="md" color="text-primary">
            Vicentinos vs {match.rival}
          </Text>
        </HStack>
        
        {match.resultado && (
          <HStack gap={2}>
            <Text fontSize="sm" color="text-primary" fontWeight="bold">
              {match.resultado.vicentinos}
            </Text>
            <Text fontSize="sm" color="text-secondary">-</Text>
            <Text fontSize="sm" color="text-primary" fontWeight="bold">
              {match.resultado.rival}
            </Text>
          </HStack>
        )}
      </HStack>

      {/* MVP del partido */}
      {match.mvp && (
        <HStack gap={2} mb={2}>
          <Image
            src={match.mvp.imagen || '/placeholder-player.jpg'}
            alt={match.mvp.nombre}
            boxSize="24px"
            borderRadius="full"
            objectFit="cover"
          />
          <Text fontSize="sm" color="text-secondary">
            MVP: {match.mvp.nombre}
          </Text>
        </HStack>
      )}

      {/* Separador (excepto en el último item) */}
      {!isLast && <Box h="1px" bg="border-light" w="100%" />}
    </Box>
  )
}