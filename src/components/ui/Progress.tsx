import { Box, Text, HStack } from '@chakra-ui/react'
import { forwardRef } from 'react'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    value, 
    max = 100, 
    label, 
    showPercentage = true, 
    color = 'button-primary',
    size = 'md',
    ...props 
  }, ref) => {
    const percentage = Math.min((value / max) * 100, 100)
    
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return { height: '4px' }
        case 'md':
          return { height: '6px' }
        case 'lg':
          return { height: '8px' }
        default:
          return { height: '6px' }
      }
    }

    return (
      <Box ref={ref} {...props}>
        {label && (
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="text-secondary">
              {label}
            </Text>
            {showPercentage && (
              <Text fontSize="sm" fontWeight="semibold" color="text-primary">
                {Math.round(percentage)}%
              </Text>
            )}
          </HStack>
        )}
        
        <Box
          bg="border-light"
          rounded="full"
          overflow="hidden"
          {...getSizeStyles()}
        >
          <Box
            bg={color}
            height="100%"
            width={`${percentage}%`}
            transition="width 0.3s ease"
            rounded="full"
          />
        </Box>
      </Box>
    )
  }
)

Progress.displayName = 'Progress'