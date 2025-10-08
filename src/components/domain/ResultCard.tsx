import { VStack, HStack, Text, Image } from '@chakra-ui/react'
import { Card, Progress, Badge, Button } from '../ui'

interface ResultsCardProps {
  results: {
    mvp: {
      nombre: string
      apodo?: string
      imagen?: string
      porcentaje: number
      votos: number
    }
    top3: Array<{
      nombre: string
      apodo?: string
      imagen?: string
      votos: number
      porcentaje: number
    }>
    totalVotos: number
  }
  onShare?: () => void
}

export const ResultsCard = ({ results, onShare }: ResultsCardProps) => {
  return (
    <VStack gap={6} align="stretch">
      {/* MVP Card */}
      <Card variant="elevated">
        <VStack gap={4} align="center">
          <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
            🏆 ÚLTIMA FECHA
          </Text>
          
          <VStack gap={3} align="center">
            <Image
              src={results.mvp.imagen || '/placeholder-player.jpg'}
              alt={results.mvp.nombre}
              boxSize="80px"
              borderRadius="full"
              objectFit="cover"
              border="3px solid"
              borderColor="button-primary"
            />
            
            <VStack gap={1} align="center">
              <Text fontSize="lg" fontWeight="bold" color="text-primary">
                {results.mvp.nombre}
              </Text>
              {results.mvp.apodo && (
                <Text fontSize="sm" color="text-secondary" fontStyle="italic">
                  "{results.mvp.apodo}"
                </Text>
              )}
              <Badge variant="status" bg="button-primary" color="text-white">
                MVP
              </Badge>
            </VStack>

            <Progress
              value={results.mvp.porcentaje}
              label={`${results.mvp.porcentaje}%`}
              color="button-primary"
              size="md"
            />
          </VStack>
        </VStack>
      </Card>

      {/* Top 3 Card */}
      <Card variant="outlined">
        <VStack gap={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
            TOP 3
          </Text>
          
          <VStack gap={3} align="stretch">
            {results.top3.map((player, index) => (
              <HStack key={player.nombre} justify="space-between" align="center">
                <HStack gap={3}>
                  <Badge variant="position" size="sm">
                    {index + 1}
                  </Badge>
                  <Text fontSize="md" fontWeight="medium" color="text-primary">
                    {player.nombre}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="text-secondary">
                  {player.votos} votos
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Card>

      {/* Share Button */}
      {onShare && (
        <Button
          variant="primary"
          size="lg"
          onClick={onShare}
          w="full"
        >
          COMPARTÍ LOS RESULTADOS
        </Button>
      )}
    </VStack>
  )
}