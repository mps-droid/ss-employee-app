import { Platform } from 'react-native';
import { colors, tones } from './colors';
import { fonts, textVariants } from './typography';

export { colors, tones, fonts, textVariants };

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// The site's --radius is 0.2rem, so corners stay nearly square.
export const radius = { sm: 2, md: 3, lg: 4, xl: 8, xxl: 12, pill: 999 };

export const layout = {
  gutter: space.lg,
  minTouch: 44,
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
};

// `shadow-editorial` on the site: 0 24px 60px -32px of the dark teal at 32%.
export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    default: { elevation: 3, shadowColor: colors.shadow },
  }),
};
