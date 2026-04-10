import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { CarouselBlock as CarouselBlockData } from "lib/cms/blocks";
import { INDICATOR_IDLE, sectionSurface } from "theme";
import TwoColumnContent from "./TwoColumnContent";
import { defineBlock, type BlockProps } from "./registry";

/**
 * Index of the slide whose left edge is closest to the track's scroll
 * position. The track is the slides' offset parent, so `offsetLeft` is
 * measured from its scroll origin and already includes the gaps.
 */
function nearestSlide(track: HTMLElement): number {
  const slides = Array.from(track.children) as HTMLElement[];
  let nearest = 0;
  slides.forEach((slide, slideIndex) => {
    const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
    if (distance < Math.abs(slides[nearest].offsetLeft - track.scrollLeft)) {
      nearest = slideIndex;
    }
  });
  return nearest;
}

/**
 * A scroll-snap carousel over the block's items.
 *
 * The track is a plain horizontally scrollable element, so it works with touch,
 * a trackpad and a keyboard before any JavaScript runs; the arrows and dots
 * drive the same `scrollTo`. There is no auto-advance — content that moves on
 * its own is hostile to screen-reader and low-vision users, and the CMS gives
 * no signal about how long a slide should hold.
 */
const CarouselBlock = ({ block, index }: BlockProps<CarouselBlockData>) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const surface = sectionSurface(index);
  const slideCount = block.items.length;

  const syncActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setActiveIndex(nearestSlide(track));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    track.addEventListener("scroll", syncActiveIndex, { passive: true });
    return () => track.removeEventListener("scroll", syncActiveIndex);
  }, [syncActiveIndex]);

  const scrollToSlide = useCallback(
    (target: number) => {
      const track = trackRef.current;
      const clamped = Math.max(0, Math.min(slideCount - 1, target));
      setActiveIndex(clamped);
      if (!track) return;

      // Slides sit one track-width plus the flex gap apart, so the offset is
      // read from the slide itself rather than derived from the track width.
      const slide = track.children[clamped] as HTMLElement | undefined;
      const left = slide?.offsetLeft ?? 0;
      // jsdom and older browsers have no smooth `scrollTo`.
      if (typeof track.scrollTo === "function") {
        track.scrollTo({ left, behavior: "smooth" });
      } else {
        track.scrollLeft = left;
      }
    },
    [slideCount]
  );

  if (slideCount === 0) return null;

  return (
    <Box
      component="section"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      sx={{ bgcolor: surface.background, py: { xs: 7, md: 12 } }}
    >
      <Container maxWidth="lg">
        <Box
          ref={trackRef}
          sx={{
            position: "relative",
            display: "flex",
            gap: { xs: 2, md: 4 },
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {block.items.map((item, slideIndex) => (
            <Box
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${slideCount}`}
              sx={{
                flex: "0 0 100%",
                minWidth: 0,
                scrollSnapAlign: "start",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  bgcolor: surface.card,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: { xs: 3, md: 5 },
                  height: "100%",
                }}
              >
                <TwoColumnContent block={item} dense headingComponent="h3" />
              </Paper>
            </Box>
          ))}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack direction="row" component="div">
            {block.items.map((item, slideIndex) => (
              <ButtonBase
                key={item.id}
                onClick={() => scrollToSlide(slideIndex)}
                aria-label={`Show slide ${slideIndex + 1} of ${slideCount}`}
                aria-current={slideIndex === activeIndex ? "true" : undefined}
                // The visible dot is small, but the button around it keeps the
                // 24px minimum target size for touch and pointer users.
                sx={{
                  minWidth: 24,
                  height: 24,
                  px: 0.5,
                  borderRadius: 999,
                  "&::before": {
                    content: '""',
                    display: "block",
                    width: slideIndex === activeIndex ? 28 : 10,
                    height: 10,
                    borderRadius: 999,
                    transition: "width 200ms ease, background-color 200ms ease",
                    bgcolor:
                      slideIndex === activeIndex
                        ? "primary.main"
                        : INDICATOR_IDLE,
                  },
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => scrollToSlide(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous slide"
              sx={{ border: 1, borderColor: "divider" }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => scrollToSlide(activeIndex + 1)}
              disabled={activeIndex === slideCount - 1}
              aria-label="Next slide"
              sx={{ border: 1, borderColor: "divider" }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export const carouselBlockDefinition = defineBlock({
  typename: "ComponentCommonCarousel",
  component: CarouselBlock,
});

export default CarouselBlock;
