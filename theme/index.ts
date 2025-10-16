import { createSystem, defaultConfig } from '@chakra-ui/react'
import { tokens } from './tokens'
import { semanticTokens } from './semanticTokens'

export const customConfig = {
  ...defaultConfig,
  theme: {
    ...defaultConfig.theme,
    tokens: {
      ...defaultConfig.theme?.tokens,
      ...tokens,
    },
    semanticTokens: {
      colors: {
        ...defaultConfig.theme?.semanticTokens?.colors,
        ...semanticTokens.colors,
      },
    },
  },
}

export const system = createSystem(customConfig)