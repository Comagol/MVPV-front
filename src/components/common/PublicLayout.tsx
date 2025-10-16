import { Box } from '@chakra-ui/react'
import Footer from '../layout/Footer'

interface PublicLayoutProps {
  children: React.ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Box 
      minH="100vh" 
      bg="bg-primary" 
      w="100%" 
      display="flex" 
      flexDirection="column"
    >
      <Box 
        flex="1" 
        w="100%" 
        minH="0"
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}