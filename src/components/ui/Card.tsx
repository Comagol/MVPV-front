import { Box, type BoxProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

interface CardProps extends BoxProps {
  variant?: 'default' | 'outlined' | 'elevated'
  children: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'outlined':
          return {
            border: '1px solid',
            borderColor: 'border-primary',
            bg: 'bg-card',
          }
        case 'elevated':
          return {
            shadow: 'md',
            bg: 'bg-card',
          }
        default:
          return {
            border: '1px solid',
            borderColor: 'border-primary',
            bg: 'bg-card',
          }
      }
    }

    return (
      <Box
        ref={ref}
        rounded="lg"
        p={6}
        {...getVariantStyles()}
        {...props}
      >
        {children}
      </Box>
    )
  }
)

Card.displayName = 'Card'