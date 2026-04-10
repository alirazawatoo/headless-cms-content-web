import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { HeaderBlock as HeaderBlockData } from "lib/cms/blocks";
import { HERO_BACKGROUND } from "theme";
import { defineBlock, type BlockProps } from "./registry";

/**
 * The hero band. When it is the first block on the page its heading is the
 * document's `h1`; further down it steps to `h2` so the outline stays valid
 * however the editor orders the dynamic zone.
 */
const HeaderBlock = ({ block, index }: BlockProps<HeaderBlockData>) => (
  <Box
    component="section"
    sx={{
      position: "relative",
      overflow: "hidden",
      color: "common.white",
      px: 2,
      py: { xs: 9, md: 15 },
      textAlign: "center",
      bgcolor: HERO_BACKGROUND,
      borderBottom: 4,
      borderColor: "secondary.main",
      // A warm pool of light from above, like an operating lamp over the field.
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(55% 80% at 50% -15%, rgba(255,240,214,0.2) 0%, rgba(255,240,214,0) 70%)",
        pointerEvents: "none",
      },
    }}
  >
    <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
      <Typography
        variant="h1"
        component={index === 0 ? "h1" : "h2"}
        sx={{ mb: block.action ? 5 : 0, textWrap: "balance" }}
      >
        {block.heading}
      </Typography>

      {block.action ? (
        <Button
          variant="contained"
          size="large"
          href={block.action.href}
          rel="noopener noreferrer"
          sx={{
            bgcolor: "common.white",
            color: "primary.dark",
            "&:hover": { bgcolor: "#F4EFE6" },
            // The theme's green ring disappears against the dark band.
            "&:focus-visible": { outlineColor: "common.white" },
          }}
        >
          {block.action.label}
        </Button>
      ) : null}
    </Container>
  </Box>
);

export const headerBlockDefinition = defineBlock({
  typename: "ComponentCommonHeader",
  component: HeaderBlock,
});

export default HeaderBlock;
