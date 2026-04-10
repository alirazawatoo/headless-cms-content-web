import { createTheme } from "@mui/material/styles";

/**
 * A single source of truth for typography, colour and spacing.
 *
 * The blocks render CMS content that an editor controls, so the only way to
 * keep the page coherent is for every block to draw from the same tokens
 * instead of styling itself.
 *
 * The look borrows from a printed surgical journal rather than a SaaS landing
 * page: an editorial serif for headings, a plain sans for body copy, scrub
 * green as the working colour and an iodine orange used sparingly as the
 * accent. Both families come from Google Fonts with `display=swap`, and each
 * stack falls back to system faces of similar proportions, so text is never
 * invisible while the webfont loads.
 */

export const HEADING_FONT_STACK = [
  '"Newsreader"',
  '"Iowan Old Style"',
  "Charter",
  "Georgia",
  "serif",
].join(",");

export const BODY_FONT_STACK = [
  '"Public Sans"',
  "system-ui",
  "-apple-system",
  '"Segoe UI"',
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
].join(",");

/** The stylesheet `_document` links; weights match the typography below. */
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;600;700&display=swap";

/** Warm paper tint used to separate alternating sections. */
export const SURFACE_TINT = "#F4EFE6";

/** Deep scrub green behind the header block. */
export const HERO_BACKGROUND = "#12302A";

export const FOOTER_BACKGROUND = "#0F1F1B";

/**
 * Inactive carousel indicators. Dark enough to meet the 3:1 non-text contrast
 * minimum on both section surfaces, which the divider colour is not.
 */
export const INDICATOR_IDLE = "#7D8C87";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1D5E52",
      dark: "#134339",
      light: "#3D8C7C",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A84A25",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#14231F",
      secondary: "#4E5D58",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    divider: "rgba(20, 35, 31, 0.14)",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: BODY_FONT_STACK,
    // `clamp` keeps display type readable from 360px up to a wide desktop
    // without a pile of breakpoint overrides.
    h1: {
      fontFamily: HEADING_FONT_STACK,
      fontSize: "clamp(2.375rem, 1.5rem + 3.4vw, 4rem)",
      fontWeight: 600,
      lineHeight: 1.06,
      letterSpacing: "-0.015em",
    },
    h2: {
      fontFamily: HEADING_FONT_STACK,
      fontSize: "clamp(1.875rem, 1.3rem + 1.9vw, 2.75rem)",
      fontWeight: 600,
      lineHeight: 1.12,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: HEADING_FONT_STACK,
      fontSize: "clamp(1.5rem, 1.2rem + 1vw, 1.875rem)",
      fontWeight: 600,
      lineHeight: 1.18,
    },
    subtitle1: { fontSize: "1.125rem", lineHeight: 1.65 },
    body1: { fontSize: "1.0625rem", lineHeight: 1.7 },
    body2: { fontSize: "0.9375rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0.1 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: "antialiased", scrollBehavior: "smooth" },
        body: { backgroundColor: "#FFFFFF" },
        // A visible, consistent focus ring everywhere, including on the
        // carousel controls and CMS-driven links.
        ":focus-visible": {
          outline: "3px solid #3D8C7C",
          outlineOffset: "2px",
          borderRadius: "4px",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "*": {
            animationDuration: "0.01ms !important",
            transitionDuration: "0.01ms !important",
            scrollBehavior: "auto !important",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        // Squarer than a pill: closer to a journal's print furniture.
        root: { borderRadius: 6, paddingInline: 22, paddingBlock: 10 },
        sizeLarge: { paddingInline: 30, paddingBlock: 13, fontSize: "1rem" },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
    },
  },
});

export default theme;

/**
 * Alternating section surfaces. Blocks call this with their position in the
 * dynamic zone so neighbouring sections never share a background, whatever
 * order the editor puts them in. `card` is the contrasting colour for content
 * sitting on top of the section (carousel slides).
 */
export function sectionSurface(index: number): {
  background: string;
  card: string;
} {
  const tinted = index % 2 === 1;
  return {
    background: tinted ? SURFACE_TINT : "#FFFFFF",
    card: tinted ? "#FFFFFF" : SURFACE_TINT,
  };
}
