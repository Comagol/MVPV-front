import React, { useState, useEffect } from 'react'
import { Box, VStack, Text, Spinner } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { useMatches } from '../hooks/useMatches'
import { useVoting } from '../hooks/useVoting'
import { Header, Button, Card } from '../components/ui'
import { ResultsCard } from '../components/domain/ResultCard'
import { SponsorPlaceholder } from '../components/domain/SponsorPlaceholder'
import type { VoteStatistics } from '../types/vote'

const ThanksPage = () => {
  const { user, logout } = useAuth()
  const { activeMatches, isLoading: matchesLoading } = useMatches()
  const { getTotalVotes, getTop3Players, isLoading: votingLoading } = useVoting()
  const [top3, setTop3] = useState<VoteStatistics[]>([])
  const [winner, setWinner] = useState<VoteStatistics | null>(null)
  const [totalVotes, setTotalVotes] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  // Obtener el partido activo
  const activeMatch = activeMatches?.[0] || null

  useEffect(() => {
    const loadVotingData = async () => {
      if (activeMatch) {
        try {
          const [total, top3Data] = await Promise.all([
            getTotalVotes(activeMatch.id),
            getTop3Players(activeMatch.id)
          ])
          
          setTop3(top3Data)
          setTotalVotes(total)
          
          if (top3Data.length > 0) {
            const winnerData = top3Data.reduce((prev, current) => 
              (prev.totalVotos > current.totalVotos) ? prev : current
            )
            setWinner(winnerData)
          }
          
          setDataLoaded(true)
        } catch (err) {
          console.error('Error al cargar datos de votación:', err)
          setError('Error al cargar datos de votación')
          setDataLoaded(true)
        }
      }
    }
    
    const timer = setTimeout(loadVotingData, 1000)
    return () => clearTimeout(timer)
  }, [activeMatch?.id])

  if (matchesLoading || votingLoading) {
    return (
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" bg="bg-primary">
        <Spinner size="xl" color="button-primary" />
      </Box>
    )
  }

  if (!activeMatch) {
    return (
      <Box flex="1" bg="bg-primary" minH="100vh">
        <VStack gap={8} maxW="6xl" mx="auto" p={6}>
          <Header title="VICENTINOS" />
          <Card variant="elevated" textAlign="center">
            <Text fontSize="xl" color="text-primary">
              No hay partidos activos
            </Text>
          </Card>
        </VStack>
      </Box>
    )
  }

  return (
    <Box flex="1" bg="bg-primary" minH="100vh">
      <VStack gap={8} maxW="6xl" mx="auto" p={6}>
        {/* Header */}
        <Header 
          title="VICENTINOS" 
          rightElement={
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          }
        />

        {/* Mensaje de agradecimiento */}
        <Card variant="elevated" textAlign="center" maxW="md">
          <VStack gap={4}>
            <Text fontSize="2xl" fontWeight="bold" color="text-primary">
              ¡Gracias por tu voto!
            </Text>
            <Text fontSize="lg" color="text-secondary">
              Vicentinos vs {activeMatch.rival} - {new Date(activeMatch.fecha).toLocaleDateString()}
            </Text>
            <Text fontSize="md" color="text-secondary">
              {user?.nombre}, tu voto ha sido registrado exitosamente
            </Text>
          </VStack>
        </Card>

        {/* Error message */}
        {error && (
          <Card variant="outlined" borderColor="error.500" bg="error.50">
            <Text color="error.600" textAlign="center">
              {error}
            </Text>
          </Card>
        )}

        {/* Resultados */}
        {dataLoaded && top3.length > 0 && (
          <ResultsCard 
            results={{
              mvp: {
                nombre: winner?.playerName || '',
                apodo: winner?.playerApodo,
                imagen: winner?.playerImagen,
                porcentaje: winner?.porcentaje || 0,
                votos: winner?.totalVotos || 0
              },
              top3: top3.map(player => ({
                nombre: player.playerName,
                apodo: player.playerApodo,
                imagen: player.playerImagen,
                votos: player.totalVotos,
                porcentaje: player.porcentaje || 0
              })),
              totalVotos: totalVotes
            }}
            onShare={() => {
              // Implementar compartir resultados
              console.log('Compartir resultados')
            }}
          />
        )}

        {/* Mensaje si no hay votos aún */}
        {dataLoaded && top3.length === 0 && (
          <Card variant="outlined" textAlign="center">
            <Text color="text-secondary">
              Los resultados se mostrarán cuando haya más votos registrados.
            </Text>
          </Card>
        )}

        {/* Sponsors */}
        <SponsorPlaceholder count={2} />

        {/* Botón de cerrar sesión */}
        <Button variant="outline" size="lg" onClick={logout} maxW="300px">
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  )
}

export default ThanksPage