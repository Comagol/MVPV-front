// src/components/common/PublicLayout.tsx
import { Box } from '@chakra-ui/react';
import Footer from '../layout/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Box minH="calc(100vh - 120px)" bg="gray.50" w="100%">
      <Box w="100%">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};