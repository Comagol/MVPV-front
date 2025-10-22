// src/pages/VoteHistoryPage.tsx
import { useState, useEffect } from 'react'
import { Box, VStack, Text, Spinner, Button, Grid } from '@chakra-ui/react'
import { useVote } from '../contexts/VoteContext'
import { useAuth } from '../contexts/AuthContext'
import { VoteHistoryItem } from '../components/domain/VoteHistoryItem'
import { Card } from '../components/ui'
import Sponsors from '../components/layout/Sponsors'

const VoteHistoryPage = () => {
  const { user } = useAuth()
  const { voteHistory, getUserVoteHistory, isLoading, error } = useVote()
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const loadVoteHistory = async () => {
      try {
        await getUserVoteHistory()
        setDataLoaded(true)
      } catch (err) {
        console.error('Error al cargar historial:', err)
        setDataLoaded(true)
      }
    }

    loadVoteHistory()
  }, [getUserVoteHistory])

  if (isLoading) {
    return (
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" bg="bg-primary">
        <Spinner size="xl" color="button-primary" />
      </Box>
    )
  }

  return (
    <Box flex="1" bg="bg-primary" minH="100vh">
      <VStack gap={8} maxW={{ base: "full", md: "6xl" }} mx="auto" p={{ base: 4, md: 6 }}>
        
        {/* Header */}
        <Card variant="elevated" textAlign="center" maxW="md">
          <VStack gap={4}>
            <Text fontSize="2xl" fontWeight="bold" color="text-primary">
              Mi Historial de Votos
            </Text>
            <Text fontSize="lg" color="text-secondary">
              {user?.nombre}, aquí están todos tus votos
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

        {/* Lista de votos */}
        {dataLoaded && voteHistory.length > 0 && (
          <VStack gap={4} w="full">
            <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
              {voteHistory.length} voto{voteHistory.length !== 1 ? 's' : ''} registrado{voteHistory.length !== 1 ? 's' : ''}
            </Text>
            
            {/* Grid responsive: 1 columna en mobile, 2 en desktop */}
            <Grid 
              templateColumns={{
                base: "1fr",           // 1 columna en mobile
                md: "repeat(2, 1fr)"   // 2 columnas en desktop
              }}
              gap={4}
              w="full"
            >
              {voteHistory.map((vote) => (
                <VoteHistoryItem key={vote.voteId} vote={vote} />
              ))}
            </Grid>
          </VStack>
        )}

        {/* Mensaje si no hay votos */}
        {dataLoaded && voteHistory.length === 0 && (
          <Card variant="outlined" textAlign="center" maxW="md">
            <VStack gap={4}>
              <Text fontSize="lg" color="text-primary" fontWeight="bold">
                No tienes votos registrados
              </Text>
              <Text color="text-secondary">
                Cuando votes en un partido, aparecerá aquí tu historial.
              </Text>
              <Button 
                variant="solid" 
                colorScheme="primary"
                onClick={() => window.location.href = '/vote'}
              >
                Ir a Votar
              </Button>
            </VStack>
          </Card>
        )}

        {/* Sponsors */}
        <Sponsors />
      </VStack>
    </Box>
  )
}

export default VoteHistoryPage