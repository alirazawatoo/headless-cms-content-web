import { fireEvent, screen, within } from "@testing-library/react";
import CarouselBlock from "components/blocks/CarouselBlock";
import { renderWithTheme } from "test-utils/render";
import { carouselBlock, twoColumnBlock } from "test-utils/blocks";

describe("CarouselBlock", () => {
  it("renders every slide so the content is there without JavaScript", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    expect(screen.getByText("General surgery")).toBeInTheDocument();
    expect(screen.getByText("Orthopaedics")).toBeInTheDocument();
    expect(screen.getByText("Otolaryngology")).toBeInTheDocument();
  });

  it("announces itself as a carousel with labelled slides", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    const region = screen.getByLabelText("Featured collections");
    expect(region).toHaveAttribute("aria-roledescription", "carousel");

    const slides = within(region).getAllByRole("group");
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute("aria-label", "1 of 3");
    expect(slides[2]).toHaveAttribute("aria-roledescription", "slide");
  });

  it("uses headings one level below a section title", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });

  it("starts on the first slide with the previous control disabled", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Show slide 1 of 3" })
    ).toHaveAttribute("aria-current", "true");
  });

  it("advances when the next control is used", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));

    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" })
    ).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeEnabled();
  });

  it("disables the next control on the last slide", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: "Show slide 3 of 3" }));

    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("jumps to a slide when its indicator is used", () => {
    renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: "Show slide 3 of 3" }));

    expect(
      screen.getByRole("button", { name: "Show slide 3 of 3" })
    ).toHaveAttribute("aria-current", "true");
  });

  it("does not run past the ends of the track", () => {
    renderWithTheme(
      <CarouselBlock
        block={carouselBlock({ items: [twoColumnBlock({ id: "only" })] })}
        index={0}
      />
    );

    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("renders nothing when the carousel has no slides", () => {
    const { container } = renderWithTheme(
      <CarouselBlock block={carouselBlock({ items: [] })} index={0} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  describe("with real slide geometry", () => {
    // jsdom does no layout, so place the slides by hand: each one is a
    // track-width wide and separated by the flex gap, as in a browser.
    const SLIDE_WIDTH = 358;
    const GAP = 16;

    const layOutTrack = (slideTotal: number) => {
      const region = screen.getByLabelText("Featured collections");
      const slides = within(region).getAllByRole("group");
      expect(slides).toHaveLength(slideTotal);
      slides.forEach((slide, slideIndex) => {
        Object.defineProperty(slide, "offsetLeft", {
          configurable: true,
          value: slideIndex * (SLIDE_WIDTH + GAP),
        });
      });

      const track = slides[0].parentElement as HTMLElement;
      Object.defineProperty(track, "clientWidth", {
        configurable: true,
        value: SLIDE_WIDTH,
      });
      const scrollTo = jest.fn();
      track.scrollTo = scrollTo as unknown as HTMLElement["scrollTo"];
      return { track, scrollTo };
    };

    const manySlides = (total: number) =>
      carouselBlock({
        items: Array.from({ length: total }, (_, i) =>
          twoColumnBlock({ id: `slide-${i}`, title: `Slide ${i + 1}` })
        ),
      });

    it("scrolls to the slide's own offset, gap included", () => {
      renderWithTheme(<CarouselBlock block={carouselBlock()} index={0} />);
      const { scrollTo } = layOutTrack(3);

      fireEvent.click(screen.getByRole("button", { name: "Show slide 3 of 3" }));

      expect(scrollTo).toHaveBeenCalledWith({
        left: 2 * (SLIDE_WIDTH + GAP),
        behavior: "smooth",
      });
    });

    it("tracks the visible slide on long carousels when the user swipes", () => {
      renderWithTheme(<CarouselBlock block={manySlides(20)} index={0} />);
      const { track } = layOutTrack(20);

      // Dividing by the track width alone would report slide 15 here.
      track.scrollLeft = 13 * (SLIDE_WIDTH + GAP);
      fireEvent.scroll(track);

      expect(
        screen.getByRole("button", { name: "Show slide 14 of 20" })
      ).toHaveAttribute("aria-current", "true");
    });
  });
});
