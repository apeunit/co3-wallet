// default theme preset

export const preset = {
  colors: {
    text: '#222',
    background: '#fff',
    primary: '#3948FF',
    secondary: '#03FFC2',
    muted: '#f6f6f9',
    gray: '#dddddf',
    highlight: 'hsla(205, 100%, 40%, 0.125)',
    shadow: 'rgba(0, 0, 0, 0.12)',
    current: 'currentColor',
    blue100: '#F0F3FF',
    blue200: '#E2E6FC',
    blue500: '#3948FF',
    blue600: '#323FE5',
    gray100: '#F0F0F0',
    white: '#ffffff',
    white70: 'rgba(255, 255, 255, 0.7)',
    black: '#000000',
    overlay20: 'rgba(27, 32, 106, 0.2)',
    dark: '#191919',
    lightGray: '#474747',
    gray200: '#F1F3F6',
  },
  fonts: {
    sans: "'Inter-regular', sans-serif",
    mono: 'monospace',
  },
  fontSizes: [11, 13, 16, 20, 24, 32, 40, 90],
  fontWeights: {
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
  },
  lineHeights: {
    body: 1.4,
    heading: 1.2,
    solid: 1.1,
  },
  letterSpacing: {
    xxNarrow: '-.05em',
    xNarrow: '-.03em',
    xTracked: '.06em',
  },
  space: [0, 2, 4, 8, 10, 12, 16, 20, 24, 32, 40, 64, 128, 256, 512],
  sizes: {
    s8: 32,
    s10: 40,
    s12: 48,
    s14: 56,
    s30: 120,
    s40: 160,
    s50: 200,
    s64: 256,
    s2: 8,
    avatar: 48,
  },
  radii: {
    r1: 4,
    r5: 20,
    r6: 24,
    r10: 40,
    full: 99999,
  },

  shadows: {
    card: '0 0 4px rgba(0, 0, 0, .125)',
    base: '0 0 20px rgba(0, 0, 0, .1)',
  },
  // rebass variants
  text: {
    base: {
      fontFamily: 'sans',
      lineHeight: 'body',
      fontWeight: 'regular',
    },
    heading: {
      fontFamily: 'sans',
      fontSize: 3,
      letterSpacing: 'xNarrow',
      fontWeight: 'medium',
    },
    headingXl: {
      fontFamily: 'sans',
      fontSize: 5,
      fontWeight: 'regular',
      letterSpacing: 'xNarrow',
      lineHeight: 'solid',
    },
    headingX2l: {
      fontFamily: 'sans',
      fontSize: 7,
      fontWeight: 'extraLight',
      letterSpacing: 'xxNarrow',
      lineHeight: 'solid',
    },
    display: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: [5, 6, 7],
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  variants: {
    avatar: {
      width: 'avatar',
      height: 'avatar',
      borderRadius: 'circle',
    },
    card: {
      p: 2,
      bg: 'background',
      boxShadow: 'card',
    },
    link: {
      color: 'primary',
    },
    nav: {
      fontSize: 1,
      fontWeight: 'bold',
      display: 'inline-block',
      p: 2,
      color: 'inherit',
      textDecoration: 'none',
      ':hover,:focus,.active': {
        color: 'primary',
      },
    },
  },
  buttons: {
    primary: {
      fontSize: 2,
      fontWeight: 'medium',
      p: 7,
      color: 'background',
      bg: 'primary',
      borderRadius: 'default',
    },
    outline: {
      variant: 'buttons.primary',
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 2px',
    },
    ghost: {
      variant: 'buttons.primary',
      color: 'primary',
      bg: 'transparent',
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'background',
      bg: 'secondary',
    },
  },
  styles: {
    root: {
      fontFamily: 'sans',
      fontWeight: 'regular',
      lineHeight: 'body',
    },
  },
};

export default preset;
