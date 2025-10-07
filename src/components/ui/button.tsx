import React, { forwardRef } from 'react'
import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react'

interface ButtonProps extends Omit<ChakraButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            bg: 'button-primary',
            color: 'button-primary-text',
            _hover: {
              bg: 'button-primary-hover',
            },
          }
        case 'secondary':
          return {
            bg: 'button-secondary',
            color: 'button-secondary-text',
            _hover: {
              bg: 'button-secondary-hover',
            },
          }
        case 'outline':
          return {
            border: '1px solid',
            borderColor: 'border-primary',
            bg: 'transparent',
            color: 'text-primary',
            _hover: {
              bg: 'bg-primary',
            },
          }
        default:
          return {}
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return { px: 3, py: 2, fontSize: 'sm' }
        case 'md':
          return { px: 4, py: 3, fontSize: 'md' }
        case 'lg':
          return { px: 6, py: 4, fontSize: 'lg' }
        default:
          return {}
      }
    }

    return (
      <ChakraButton
        ref={ref}
        rounded="md"
        fontWeight="semibold"
        transition="all 0.2s"
        {...getVariantStyles()}
        {...getSizeStyles()}
        {...props}
      >
        {children}
      </ChakraButton>
    )
  }
)

Button.displayName = 'Button'