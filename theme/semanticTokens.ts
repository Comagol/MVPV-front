export const semanticTokens = {
  colors: {
    // Colores principales de tu marca
    'brand.50': { value: '#F0F0FF' },
    'brand.100': { value: '#E0E0FF' },
    'brand.200': { value: '#C0C0FF' },
    'brand.300': { value: '#A0A0FF' },
    'brand.400': { value: '#8080FF' },
    'brand.500': { value: '#1800AD' },
    'brand.600': { value: '#130471' },
    'brand.700': { value: '#0F005A' },
    'brand.800': { value: '#0B0043' },
    'brand.900': { value: '#07002C' },
    
    // Colores de acento
    'accent.50': { value: '#FFF4E6' },
    'accent.100': { value: '#FFE9CC' },
    'accent.200': { value: '#FFD399' },
    'accent.300': { value: '#FFBD66' },
    'accent.400': { value: '#FFA733' },
    'accent.500': { value: '#FF751F' },
    'accent.600': { value: '#E66A1C' },
    'accent.700': { value: '#CC5F19' },
    'accent.800': { value: '#B35416' },
    'accent.900': { value: '#994913' },
    
    // Colores de fondo
    'background.50': { value: '#FFFFFF' },
    'background.100': { value: '#F8F8F8' },
    'background.200': { value: '#F0F0F0' },
    'background.300': { value: '#E8E8E8' },
    
    // Colores de la app
    'app.header': { value: '#1800AD' },
    'app.logo': { value: '#FFFFFF' },
    'app.background': { value: '#FFFFFF' },
    'app.buttonAccent': { value: '#FF751F' },
    'app.buttonText': { value: '#FFFFFF' },
    'app.blue': { value: '#130471' },
    
    // Colores semánticos
    'header-bg': { value: '{colors.app.header}' },
    'footer-bg': { value: '{colors.app.header}' },
    'button-primary': { value: '{colors.app.buttonAccent}' },
    'button-primary-text': { value: '{colors.app.buttonText}' },
    'button-primary-hover': { value: '{colors.accent.600}' },
    'button-secondary': { value: '{colors.app.blue}' },
    'button-secondary-text': { value: '{colors.app.buttonText}' },
    'button-secondary-hover': { value: '{colors.brand.600}' },
    
    // Colores de texto
    'text-primary': { value: '{colors.app.header}' },
    'text-secondary': { value: '{colors.gray.600}' },
    'text-accent': { value: '{colors.app.buttonAccent}' },
    'text-white': { value: '{colors.app.logo}' },
    
    // Colores de fondo
    'bg-primary': { value: '{colors.app.background}' },
    'bg-card': { value: '{colors.app.background}' },
    'bg-header': { value: '{colors.app.header}' },
    'bg-footer': { value: '{colors.app.header}' },
    
    // Colores de borde
    'border-primary': { value: '{colors.app.header}' },
    'border-accent': { value: '{colors.app.buttonAccent}' },
    'border-light': { value: '{colors.gray.200}' },
  }
}