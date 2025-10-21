// src/pages/VoteHistoryPage.tsx
import { useState, useEffect } from 'react'
import { Box, VStack, Text, Spinner, Button } from '@chakra-ui/react'
import { useVote } from '../contexts/VoteContext'
import { useAuth } from '../contexts/AuthContext'
import { VoteHistoryItem } from '../components/domain/VoteHistoryItem'
import { Card } from '../components/ui'
import Sponsors from '../components/layout/Sponsors'
import type { VoteHistoryItem as VoteHistoryItemType } from '../types/vote'

const VoteHistoryPage = () => {
  const { user } = useAuth()
  const { voteHistory, getUserVoteHistory, isLoading, error } = useVote()
  const [history, setHistory] = useState<VoteHistoryItemType[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const loadVoteHistory = async () => {
      try {
        const response = await getUserVoteHistory()
        setHistory(response.history)
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
        {dataLoaded && history.length > 0 && (
          <VStack gap={4} w="full">
            <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
              {history.length} voto{history.length !== 1 ? 's' : ''} registrado{history.length !== 1 ? 's' : ''}
            </Text>
            
            {history.map((vote) => (
              <VoteHistoryItem key={vote.voteId} vote={vote} />
            ))}
          </VStack>
        )}

        {/* Mensaje si no hay votos */}
        {dataLoaded && history.length === 0 && (
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