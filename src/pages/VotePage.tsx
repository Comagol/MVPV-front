import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, VStack, Text, Grid, Spinner } from '@chakra-ui/react'
import { useMatch } from '../contexts/MatchContext'
import { useVote } from '../contexts/VoteContext'
import { Header, Button, Card } from '../components/ui'
import { SponsorPlaceholder } from '../components/domain/SponsorPlaceholder'
import { PlayerCard } from '../components/domain/PlayerdCard'
import { MatchCard } from '../components/domain/MatchCard'
import type { PlayerResponse, MatchResponse } from '../types'
import type { VoteValidationResponse } from '../types'
import Sponsors from '../components/layout/Sponsors'

const VotePage = () => {
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
              <Sponsors />
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
          
          <Card variant="elevated" textAlign="center" maxW="md">
            <VStack gap={4}>
              <Text fontSize="xl" fontWeight="bold" color="text-primary">
                Gracias por tu voto
              </Text>
              <Text color="text-secondary">
                {voteValidation.razon || 'Ya has realizado tu voto para este partido. Verás los resultados en breve.'}
              </Text>
              <Button variant="primary" size="lg" onClick={() => navigate('/thanks')}>Ver resultados</Button>
              <Sponsors />
            </VStack>
          </Card>
        </VStack>
      </Box>
    )
  }

  return (
    <Box flex="1" bg="bg-primary" minH="100vh">
        <VStack gap={8} maxW={{ base: "full", md: "6xl" }} mx="auto" p={{ base: 4, md: 6 }}>

        {/* Mensaje principal */}
        <Card variant="elevated" textAlign="center" maxW="md">
          <VStack gap={4}>
            <Text fontSize="2xl" fontWeight="bold" color="text-primary">
              Tu voto también juega
            </Text>
            <Text fontSize="lg" color="text-secondary">
              Podés votar por el MVP del partido cada fecha
            </Text>
            <Sponsors />
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
              base: "1fr",           
              sm: "repeat(2, 1fr)",  
              md: "repeat(3, 1fr)",  
              lg: "repeat(4, 1fr)"   
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