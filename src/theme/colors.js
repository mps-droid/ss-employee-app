/**
 * Colours from the Social Sanitation website (globals.css). The site defines them in
 * OKLCH; these are the sRGB values a browser shows, including its gamut mapping for
 * the brand green and the destructive red.
 */
export const colors = {
  background: '#fdfefc', // --background
  foreground: '#121918', // --foreground
  card: '#ffffff', // --card
  primary: '#00fc16', // --primary, the logo green
  primaryForeground: '#081008', // --primary-foreground: text on green
  secondary: '#72e8fc', // --secondary
  secondaryForeground: '#011519', // --secondary-foreground
  muted: '#f0f5f3', // --muted
  mutedForeground: '#526161', // --muted-foreground
  accent: '#bdf7ff', // --accent
  accentForeground: '#0b1918', // --accent-foreground
  destructive: '#e7000b', // --destructive
  destructiveForeground: '#f8fafc', // --destructive-foreground
  border: '#d9e0de', // --border and --input
  surface: '#f3f8f6', // --surface
  brandWash: '#ddfcf2', // --brand-wash
  shadow: '#071413', // shadow-editorial colour
  overlay: 'rgba(6, 15, 15, 0.84)', // bg-video-overlay
  placeholder: '#7b8a89', // --muted-foreground lightened for input placeholders
  white: '#ffffff',

  // Derived for app states the website doesn't have.
  primaryPressed: '#00d913', // primary, slightly darker while pressed
  foregroundPressed: '#26302f',
  success: '#00b812', // primary, dark enough to read on the light washes
  dangerWash: '#fde5e6', // destructive tint
  dangerBorder: '#f5b5b8',
  focusRing: 'rgba(0, 252, 22, 0.22)', // the site's focus outline: primary at ~20%
  backdrop: 'rgba(6, 15, 15, 0.5)', // overlay colour at half strength, behind sheets
  toastError: '#ff5a5f', // destructive, lightened to show on the dark toast
  toastSubtext: '#c7d1cf',
};

/**
 * Status tones for pills and badges. Backgrounds are the site's wash, accent and
 * tints of its chart colours; text stays dark for contrast; the dot carries the hue.
 */
export const tones = {
  success: {
    background: colors.brandWash,
    text: colors.foreground,
    dot: colors.success,
  },
  info: {
    background: colors.accent,
    text: colors.secondaryForeground,
    dot: '#009689',
  },
  warning: { background: '#fff1cc', text: '#5c3d00', dot: '#ffba00' },
  danger: {
    background: colors.dangerWash,
    text: '#a1000a',
    dot: colors.destructive,
  },
  neutral: {
    background: colors.muted,
    text: colors.mutedForeground,
    dot: colors.mutedForeground,
  },
};
