/**
 * The website pairs Manrope (text) with Sora (headings). Each weight is its own font
 * file, so styles set fontFamily and never fontWeight (Android would look for a
 * synthetic bold of the family otherwise).
 */
export const fonts = {
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semibold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
  extrabold: 'Manrope-ExtraBold',
  display: 'Sora-Medium',
  displaySemibold: 'Sora-SemiBold',
  displayBold: 'Sora-Bold',
};

export const textVariants = {
  // Screen titles on the tab screens.
  display: {
    fontFamily: fonts.displaySemibold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.42,
  },
  // `section-title` on the site: Sora 500, tight tracking.
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.33,
  },
  heading: {
    fontFamily: fonts.displaySemibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  subtitle: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  // `form-label` on the site: 0.72rem, weight 800, uppercase, 0.04em tracking.
  label: {
    fontFamily: fonts.extrabold,
    fontSize: 11.5,
    lineHeight: 14,
    letterSpacing: 0.46,
    textTransform: 'uppercase',
  },
  // `eyebrow` on the site: 0.68rem, weight 700, uppercase, 0.08em tracking.
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fonts.extrabold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.78,
    textTransform: 'uppercase',
  },
  number: {
    fontFamily: fonts.displaySemibold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
};
