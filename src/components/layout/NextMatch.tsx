import { Box, VStack, Heading, Text, Badge } from '@chakra-ui/react';
import type { MatchResponse } from '../../types';

interface NextMatchProps {
  match: MatchResponse | null;
}

const NextMatch = ({ match}: NextMatchProps) => {
  if (!match) {
    return (
      <Box p={6} bg="gray.50" rounded="lg" textAlign="center">
        <Text color="gray.500">No hay próximos partidos programados</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg="blue.50" rounded="lg" border="1px solid" borderColor="blue.200">
      <VStack gap={3}>
        <Heading size="md" color="blue.700">
          🗓️ Próximo Partido
        </Heading>
        <Text fontSize="lg" fontWeight="semibold">
          vs {match.rival}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {new Date(match.fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        <Badge colorScheme="blue">
          {match.estado}
        </Badge>
      </VStack>
    </Box>
  );
};

export default NextMatch;