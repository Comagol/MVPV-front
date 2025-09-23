// src/components/common/PublicLayout.tsx
import { Box } from '@chakra-ui/react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.50" w="100%">
      {children}
    </Box>
  );
};