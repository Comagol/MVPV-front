import { HStack, Text, Icon, VStack } from '@chakra-ui/react'
import { Card } from '../ui'
import { FaTimes } from 'react-icons/fa'

interface SponsorPlaceholderProps {
  count?: number
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export const SponsorPlaceholder = ({ 
  count = 2, 
  size = 'md',
  showText = true 
}: SponsorPlaceholderProps) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { w: '60px', h: '60px' }
      case 'md':
        return { w: '80px', h: '80px' }
      case 'lg':
        return { w: '100px', h: '100px' }
      default:
        return { w: '80px', h: '80px' }
    }
  }

  return (
    <VStack gap={4} align="center">
      {showText && (
        <Text fontSize="sm" color="text-secondary" textAlign="center">
          con nuestros sponsors
        </Text>
      )}
      
      <HStack gap={4} justify="center">
        {Array.from({ length: count }, (_, index) => (
          <Card
            key={index}
            variant="outlined"
            {...getSizeStyles()}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderColor="border-light"
            bg="bg-card"
            minW="fit-content"
          >
            <Icon as={FaTimes} boxSize="24px" color="border-light" />
          </Card>
        ))}
      </HStack>
    </VStack>
  )
}