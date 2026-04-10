import theme, {
  BODY_FONT_STACK,
  GOOGLE_FONTS_URL,
  HEADING_FONT_STACK,
  SURFACE_TINT,
  sectionSurface,
} from "theme";

describe("sectionSurface", () => {
  it("alternates the background with the block's position", () => {
    expect(sectionSurface(0).background).toBe("#FFFFFF");
    expect(sectionSurface(1).background).toBe(SURFACE_TINT);
    expect(sectionSurface(2).background).toBe("#FFFFFF");
  });

  it("gives content sitting on the section the contrasting colour", () => {
    expect(sectionSurface(0).card).toBe(SURFACE_TINT);
    expect(sectionSurface(1).card).toBe("#FFFFFF");
  });
});

describe("theme", () => {
  it("falls back to system faces while the webfonts load", () => {
    expect(theme.typography.fontFamily).toMatch(/^"Public Sans",/);
    expect(theme.typography.fontFamily).toContain("system-ui");
    expect(theme.typography.h1.fontFamily).toMatch(/^"Newsreader",/);
    expect(theme.typography.h1.fontFamily).toContain("Georgia");
  });

  it("loads the webfonts with swap, so text is never invisible", () => {
    const url = new URL(GOOGLE_FONTS_URL);
    expect(url.searchParams.get("display")).toBe("swap");
    expect(url.searchParams.getAll("family").join(" ")).toMatch(
      /Newsreader.*Public Sans/
    );
  });

  it("sets headings in the serif and body copy in the sans", () => {
    for (const level of ["h1", "h2", "h3"] as const) {
      expect(theme.typography[level].fontFamily).toBe(HEADING_FONT_STACK);
    }
    expect(theme.typography.body1.fontFamily).toBe(BODY_FONT_STACK);
  });

  it("scales display type fluidly instead of per breakpoint", () => {
    expect(String(theme.typography.h1.fontSize)).toContain("clamp(");
  });

  it("defines a visible focus ring for keyboard users", () => {
    const baseline = theme.components?.MuiCssBaseline?.styleOverrides as
      | Record<string, Record<string, unknown>>
      | undefined;

    expect(baseline?.[":focus-visible"]?.outline).toBeDefined();
  });
});
