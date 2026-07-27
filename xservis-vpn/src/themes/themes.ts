export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    surface: string;
    card: string;
    cardBorder: string;
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    danger: string;
  };
  gradients: {
    primary: string;
    accent: string;
    cardHover: string;
    button: string;
  };
  glassStyle: {
    background: string;
    border: string;
    blur: number;
  };
}

export const themes: Record<string, Theme> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Cyan',
    colors: {
      bg: '#05070A',
      surface: '#0C1018',
      card: 'rgba(18,24,34,0.82)',
      cardBorder: 'rgba(255,255,255,0.08)',
      primary: '#15D8EA',
      secondary: '#22C8F5',
      accent: '#2E8BFF',
      glow: '#5CE8FF',
      text: '#FFFFFF',
      textSecondary: '#B8C2D1',
      success: '#00E676',
      warning: '#FFD54F',
      danger: '#FF5252',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #15D8EA, #2E8BFF)',
      accent: 'linear-gradient(135deg, #22C8F5, #2E8BFF)',
      cardHover: 'linear-gradient(135deg, rgba(21,216,234,0.05), rgba(46,139,255,0.05))',
      button: 'linear-gradient(135deg, #15D8EA, #2E8BFF)',
    },
    glassStyle: {
      background: 'rgba(18,24,34,0.82)',
      border: 'rgba(255,255,255,0.08)',
      blur: 24,
    },
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic Blue',
    colors: {
      bg: '#060D14',
      surface: '#0B1520',
      card: 'rgba(15,30,50,0.82)',
      cardBorder: 'rgba(100,180,255,0.1)',
      primary: '#4FC3F7',
      secondary: '#29B6F6',
      accent: '#0288D1',
      glow: '#81D4FA',
      text: '#FFFFFF',
      textSecondary: '#B0D4F1',
      success: '#66BB6A',
      warning: '#FFA726',
      danger: '#EF5350',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
      accent: 'linear-gradient(135deg, #29B6F6, #01579B)',
      cardHover: 'linear-gradient(135deg, rgba(79,195,247,0.05), rgba(2,136,209,0.05))',
      button: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
    },
    glassStyle: {
      background: 'rgba(15,30,50,0.82)',
      border: 'rgba(100,180,255,0.1)',
      blur: 24,
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    colors: {
      bg: '#050D0A',
      surface: '#0A1812',
      card: 'rgba(10,30,20,0.82)',
      cardBorder: 'rgba(100,255,180,0.08)',
      primary: '#2ECC71',
      secondary: '#27AE60',
      accent: '#1ABC9C',
      glow: '#58FFA8',
      text: '#FFFFFF',
      textSecondary: '#A8D5BA',
      success: '#00E676',
      warning: '#F39C12',
      danger: '#E74C3C',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2ECC71, #1ABC9C)',
      accent: 'linear-gradient(135deg, #27AE60, #16A085)',
      cardHover: 'linear-gradient(135deg, rgba(46,204,113,0.05), rgba(26,188,156,0.05))',
      button: 'linear-gradient(135deg, #2ECC71, #1ABC9C)',
    },
    glassStyle: {
      background: 'rgba(10,30,20,0.82)',
      border: 'rgba(100,255,180,0.08)',
      blur: 24,
    },
  },
  purple: {
    id: 'purple',
    name: 'Purple Night',
    colors: {
      bg: '#0A0812',
      surface: '#100E1A',
      card: 'rgba(25,18,40,0.82)',
      cardBorder: 'rgba(180,130,255,0.08)',
      primary: '#BB86FC',
      secondary: '#9C6FE4',
      accent: '#7C4DFF',
      glow: '#DAB8FF',
      text: '#FFFFFF',
      textSecondary: '#C6B8D1',
      success: '#69F0AE',
      warning: '#FFD740',
      danger: '#FF5252',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #BB86FC, #7C4DFF)',
      accent: 'linear-gradient(135deg, #9C6FE4, #651FFF)',
      cardHover: 'linear-gradient(135deg, rgba(187,134,252,0.05), rgba(124,77,255,0.05))',
      button: 'linear-gradient(135deg, #BB86FC, #7C4DFF)',
    },
    glassStyle: {
      background: 'rgba(25,18,40,0.82)',
      border: 'rgba(180,130,255,0.08)',
      blur: 24,
    },
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    colors: {
      bg: '#120A0E',
      surface: '#1C1218',
      card: 'rgba(35,20,30,0.82)',
      cardBorder: 'rgba(255,150,200,0.08)',
      primary: '#FF80AB',
      secondary: '#F48FB1',
      accent: '#EC407A',
      glow: '#FFB0CB',
      text: '#FFFFFF',
      textSecondary: '#E0C0CC',
      success: '#66BB6A',
      warning: '#FFB74D',
      danger: '#EF5350',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF80AB, #EC407A)',
      accent: 'linear-gradient(135deg, #F48FB1, #D81B60)',
      cardHover: 'linear-gradient(135deg, rgba(255,128,171,0.05), rgba(236,64,122,0.05))',
      button: 'linear-gradient(135deg, #FF80AB, #EC407A)',
    },
    glassStyle: {
      background: 'rgba(35,20,30,0.82)',
      border: 'rgba(255,150,200,0.08)',
      blur: 24,
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Neon',
    colors: {
      bg: '#05080D',
      surface: '#0A0F18',
      card: 'rgba(10,18,30,0.82)',
      cardBorder: 'rgba(0,255,200,0.12)',
      primary: '#00FFC8',
      secondary: '#00E5FF',
      accent: '#FF00E5',
      glow: '#00FFC8',
      text: '#FFFFFF',
      textSecondary: '#80E0D0',
      success: '#00E676',
      warning: '#FFEA00',
      danger: '#FF1744',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00FFC8, #00E5FF)',
      accent: 'linear-gradient(135deg, #00E5FF, #FF00E5)',
      cardHover: 'linear-gradient(135deg, rgba(0,255,200,0.05), rgba(0,229,255,0.05))',
      button: 'linear-gradient(135deg, #00FFC8, #00E5FF)',
    },
    glassStyle: {
      background: 'rgba(10,18,30,0.82)',
      border: 'rgba(0,255,200,0.12)',
      blur: 24,
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      bg: '#050508',
      surface: '#0A0A12',
      card: 'rgba(12,12,25,0.85)',
      cardBorder: 'rgba(255,255,255,0.06)',
      primary: '#E0E0FF',
      secondary: '#C0C0E0',
      accent: '#8080FF',
      glow: '#A0A0FF',
      text: '#FFFFFF',
      textSecondary: '#9090B0',
      success: '#70E090',
      warning: '#E0C060',
      danger: '#FF6080',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #E0E0FF, #8080FF)',
      accent: 'linear-gradient(135deg, #C0C0E0, #6060C0)',
      cardHover: 'linear-gradient(135deg, rgba(224,224,255,0.03), rgba(128,128,255,0.03))',
      button: 'linear-gradient(135deg, #8080FF, #4040A0)',
    },
    glassStyle: {
      background: 'rgba(12,12,25,0.85)',
      border: 'rgba(255,255,255,0.06)',
      blur: 24,
    },
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Green',
    colors: {
      bg: '#050D05',
      surface: '#081408',
      card: 'rgba(8,25,8,0.82)',
      cardBorder: 'rgba(0,255,65,0.1)',
      primary: '#00FF41',
      secondary: '#00CC33',
      accent: '#009922',
      glow: '#33FF66',
      text: '#FFFFFF',
      textSecondary: '#80D090',
      success: '#00E676',
      warning: '#CCFF00',
      danger: '#FF3333',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00FF41, #009922)',
      accent: 'linear-gradient(135deg, #00CC33, #006622)',
      cardHover: 'linear-gradient(135deg, rgba(0,255,65,0.05), rgba(0,153,34,0.05))',
      button: 'linear-gradient(135deg, #00FF41, #009922)',
    },
    glassStyle: {
      background: 'rgba(8,25,8,0.82)',
      border: 'rgba(0,255,65,0.1)',
      blur: 24,
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      bg: '#10080A',
      surface: '#1A0E12',
      card: 'rgba(40,18,20,0.82)',
      cardBorder: 'rgba(255,150,100,0.1)',
      primary: '#FF6B35',
      secondary: '#FF8C42',
      accent: '#FF3D00',
      glow: '#FFAB70',
      text: '#FFFFFF',
      textSecondary: '#E0B090',
      success: '#66BB6A',
      warning: '#FFD740',
      danger: '#FF1744',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF6B35, #FF3D00)',
      accent: 'linear-gradient(135deg, #FF8C42, #E64A19)',
      cardHover: 'linear-gradient(135deg, rgba(255,107,53,0.05), rgba(255,61,0,0.05))',
      button: 'linear-gradient(135deg, #FF6B35, #FF3D00)',
    },
    glassStyle: {
      background: 'rgba(40,18,20,0.82)',
      border: 'rgba(255,150,100,0.1)',
      blur: 24,
    },
  },
  gold: {
    id: 'gold',
    name: 'Royal Gold',
    colors: {
      bg: '#0A0805',
      surface: '#141008',
      card: 'rgba(30,22,10,0.82)',
      cardBorder: 'rgba(255,215,0,0.1)',
      primary: '#FFD700',
      secondary: '#FFC107',
      accent: '#FF8F00',
      glow: '#FFE57F',
      text: '#FFFFFF',
      textSecondary: '#D4C080',
      success: '#76FF03',
      warning: '#FFD740',
      danger: '#FF1744',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FFD700, #FF8F00)',
      accent: 'linear-gradient(135deg, #FFC107, #E65100)',
      cardHover: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,143,0,0.05))',
      button: 'linear-gradient(135deg, #FFD700, #FF8F00)',
    },
    glassStyle: {
      background: 'rgba(30,22,10,0.82)',
      border: 'rgba(255,215,0,0.1)',
      blur: 24,
    },
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    colors: {
      bg: '#100508',
      surface: '#1A0A10',
      card: 'rgba(40,12,18,0.82)',
      cardBorder: 'rgba(255,50,80,0.1)',
      primary: '#FF1744',
      secondary: '#D50000',
      accent: '#B71C1C',
      glow: '#FF5252',
      text: '#FFFFFF',
      textSecondary: '#D0A0A8',
      success: '#69F0AE',
      warning: '#FFAB00',
      danger: '#FF1744',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF1744, #B71C1C)',
      accent: 'linear-gradient(135deg, #D50000, #7F0000)',
      cardHover: 'linear-gradient(135deg, rgba(255,23,68,0.05), rgba(183,28,28,0.05))',
      button: 'linear-gradient(135deg, #FF1744, #B71C1C)',
    },
    glassStyle: {
      background: 'rgba(40,12,18,0.82)',
      border: 'rgba(255,50,80,0.1)',
      blur: 24,
    },
  },
  pureblack: {
    id: 'pureblack',
    name: 'Pure Black',
    colors: {
      bg: '#000000',
      surface: '#060606',
      card: 'rgba(255,255,255,0.04)',
      cardBorder: 'rgba(255,255,255,0.06)',
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      accent: '#888888',
      glow: '#FFFFFF',
      text: '#FFFFFF',
      textSecondary: '#888888',
      success: '#00E676',
      warning: '#FFD54F',
      danger: '#FF5252',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FFFFFF, #888888)',
      accent: 'linear-gradient(135deg, #CCCCCC, #666666)',
      cardHover: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06))',
      button: 'linear-gradient(135deg, #FFFFFF, #888888)',
    },
    glassStyle: {
      background: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.06)',
      blur: 24,
    },
  },
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.colors.bg);
  root.style.setProperty('--surface', theme.colors.surface);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--card-border', theme.colors.cardBorder);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--glow', theme.colors.glow);
  root.style.setProperty('--text', theme.colors.text);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--success', theme.colors.success);
  root.style.setProperty('--warning', theme.colors.warning);
  root.style.setProperty('--danger', theme.colors.danger);
};
