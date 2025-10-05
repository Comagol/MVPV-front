// src/components/common/PublicLayout.tsx
import { Box } from '@chakra-ui/react';
import Footer from '../layout/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Box 
      minH="100vh" 
      bg="gray.50" 
      w="100%" 
      display="flex" 
      flexDirection="column"
    >
      <Box 
        flex="1" 
        w="100%" 
        display="flex" 
        flexDirection="column"
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};