import { Box, Flex, Heading, IconButton, HStack } from '@chakra-ui/react'
import { type ReactNode } from 'react'

interface HeaderProps {
  title: string
  icon?: ReactNode
  rightElement?: ReactNode
  onMenuClick?: () => void
}

export const Header = ({ title, icon, rightElement, onMenuClick }: HeaderProps) => {
  return (
    <Box bg="bg-header" color="text-white" px={{ base: 3, md: 4 }} py={3}>
      <Flex justify="space-between" align="center">
        <HStack gap={3}>
          {icon && <Box>{icon}</Box>}
          <Heading 
            size={{ base: "md", md: "lg" }}  // Más pequeño en móvil
            color="text-white"
          >
            {title}
          </Heading>
        </HStack>
        
        {rightElement && (
          <Box>{rightElement}</Box>
        )}
        
        {onMenuClick && (
          <IconButton
            aria-label="Menu"
            variant="ghost"
            color="text-white"
            onClick={onMenuClick}
            display={{ base: "block", md: "none" }}  // Solo en móvil
          >
            ☰
          </IconButton>
        )}
      </Flex>
    </Box>
  )
}