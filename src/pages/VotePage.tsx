import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, VStack, Text, Grid, Spinner } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { useMatch } from '../contexts/MatchContext'
import { useVote } from '../contexts/VoteContext'
import { Header, Button, Card } from '../components/ui'
import { SponsorPlaceholder } from '../components/domain/SponsorPlaceholder'
import { PlayerCard } from '../components/domain/PlayerdCard'
import { MatchCard } from '../components/domain/MatchCard'
import type { PlayerResponse, MatchResponse } from '../types'
import type { VoteValidationResponse } from '../types'

const VotePage = () => {
  const { logout } = useAuth()
  const { activeMatches, programmedMatches, isLoading: matchesLoading } = useMatch()
  const { createVote, validateVote, isLoading: votingLoading } = useVote()
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerResponse | null>(null)
  const [voteValidation, setVoteValidation] = useState<VoteValidationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()

  // Obtener el partido activo
  const activeMatch = activeMatches?.[0] || null
  const nextMatch = programmedMatches?.[0] || activeMatch || null

  useEffect(() => {
    const checkVotingStatus = async () => {
      if (activeMatch) {
        try {
          const validationResult = await validateVote(activeMatch.id)
          setVoteValidation(validationResult)
        } catch (err) {
          setError('Error al verificar estado de votación')
        }
      }
    }
    checkVotingStatus()
  }, [activeMatch, validateVote])

  const handleVoteForPlayer = async (playerId: string) => {
    if (!activeMatch) return
    const player = activeMatch.jugadores.find(p => p.id === playerId)
    if (!player) return
  
    try {
      await createVote(player.id, activeMatch.id)
      navigate('/thanks')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al votar')
    }
  }

  if (matchesLoading) {
    return (
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" bg="bg-primary">
        <Spinner size="xl" color="button-primary" />
      </Box>
    )
  }

  if (!activeMatch) {
    return (
      <Box flex="1" bg="bg-primary" minH="100vh">
        <VStack gap={8} maxW={{ base: "full", md: "6xl" }} mx="auto" p={{ base: 4, md: 6 }}>
          {/* Header */}
          <Header 
            title="VICENTINOS"
          />

          {/* Mensaje principal */}
          <Card variant="elevated" textAlign="center" maxW="md">
            <VStack gap={4}>
              <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                Tu voto también juega
              </Text>
              <Text fontSize="lg" color="text-secondary">
                Podés votar por el MVP del partido cada fecha
              </Text>
              <Button variant="primary" size="lg" disabled>
                VOTÁ AHORA
              </Button>
              <SponsorPlaceholder count={2} />
            </VStack>
          </Card>

          {/* Próximo partido */}
          {nextMatch && (
            <MatchCard match={nextMatch as MatchResponse} showVoteButton={false} />
          )}
        </VStack>
      </Box>
    )
  }

  if (voteValidation && !voteValidation.puedeVotar) {
    return (
      <Box flex="1" bg="bg-primary" minH="100vh">
        <VStack gap={8} maxW={{ base: "full", md: "6xl" }} mx="auto" p={{ base: 4, md: 6 }}>
          <Header title="VICENTINOS" />
          
          <Card variant="elevated" textAlign="center" maxW="md">
            <VStack gap={4}>
              <Text fontSize="xl" fontWeight="bold" color="text-primary">
                No puedes votar
              </Text>
              <Text color="text-secondary">
                {voteValidation.razon || 'Ya has realizado tu voto para este partido.'}
              </Text>
              {voteValidation.tiempoRestante && (
                <Text fontSize="sm" color="text-secondary">
                  Tiempo restante: {Math.floor(voteValidation.tiempoRestante / 60)} minutos
                </Text>
              )}
              <Button variant="primary" size="lg" onClick={() => navigate('/thanks')}>
                Ver resultados
              </Button>
            </VStack>
          </Card>
        </VStack>
      </Box>
    )
  }

  return (
    <Box flex="1" bg="bg-primary" minH="100vh">
        <VStack gap={8} maxW={{ base: "full", md: "6xl" }} mx="auto" p={{ base: 4, md: 6 }}>
        {/* Header */}
        <Header 
          title="VICENTINOS" 
          rightElement={
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          }
        />

        {/* Mensaje principal */}
        <Card variant="elevated" textAlign="center" maxW="md">
          <VStack gap={4}>
            <Text fontSize="2xl" fontWeight="bold" color="text-primary">
              Tu voto también juega
            </Text>
            <Text fontSize="lg" color="text-secondary">
              Podés votar por el MVP del partido cada fecha
            </Text>
            <Button variant="primary" size="lg">
              VOTÁ AHORA
            </Button>
            <SponsorPlaceholder count={2} />
          </VStack>
        </Card>

        {/* Partido actual */}
        <MatchCard 
          match={activeMatch as MatchResponse} 
          onVote={() => {}} 
          showVoteButton={false}
        />

        {/* Error message */}
        {error && (
          <Card variant="outlined" borderColor="error.500" bg="error.50">
            <Text color="error.600" textAlign="center">
              {error}
            </Text>
          </Card>
        )}

        {/* Jugadores */}
        <VStack gap={4} w="full">
          <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
            Votá al jugador del partido
          </Text>
          
          <Grid 
            templateColumns={{
              base: "1fr",           // 1 columna en móvil
              sm: "repeat(2, 1fr)",  // 2 columnas en tablet
              md: "repeat(3, 1fr)",  // 3 columnas en desktop
              lg: "repeat(4, 1fr)"   // 4 columnas en pantallas grandes
            }} 
            gap={{ base: 4, md: 6 }} 
            w="full"
          >
            {activeMatch.jugadores.map((player: PlayerResponse) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={selectedPlayer?.id === player.id}
                onVote={handleVoteForPlayer}
                isLoading={votingLoading}
                variant="votable"
              />
            ))}
          </Grid>
        </VStack>
      </VStack>
    </Box>
  )
}

export default VotePage