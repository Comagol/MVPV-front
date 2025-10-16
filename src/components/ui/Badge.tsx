import { Box, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'number' | 'status' | 'position'
  color?: string
  bg?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    children, 
    variant = 'status', 
    color = 'text-white',
    bg = 'button-primary',
    size = 'md',
    ...props 
  }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'number':
          return {
            bg: 'button-primary',
            color: 'text-white',
            rounded: 'sm',
            minW: '24px',
            h: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        case 'position':
          return {
            bg: 'button-primary',
            color: 'text-white',
            rounded: 'full',
            minW: '32px',
            h: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }
        case 'status':
        default:
          return {
            bg,
            color,
            rounded: 'full',
            px: 3,
            py: 1,
          }
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return { fontSize: 'xs', px: 2, py: 1 }
        case 'md':
          return { fontSize: 'sm', px: 3, py: 1 }
        case 'lg':
          return { fontSize: 'md', px: 4, py: 2 }
        default:
          return { fontSize: 'sm', px: 3, py: 1 }
      }
    }

    return (
      <Box
        ref={ref}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        {...getVariantStyles()}
        {...getSizeStyles()}
        {...props}
      >
        <Text fontSize="inherit" fontWeight="inherit">
          {children}
        </Text>
      </Box>
    )
  }
)

Badge.displayName = 'Badge'