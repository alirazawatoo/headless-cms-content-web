# Headless CMS Content Web

A Next.js and Apollo frontend that renders a Strapi homepage dynamic zone as typed header, carousel, and two-column content blocks.

## Architecture

```text
Strapi GraphQL -> generated Apollo types/hooks -> getStaticProps cache
                                            -> HomePageSections dispatcher
                                            -> typed presentation blocks
```

`pages/index.tsx` prefetches the homepage query at build time and hydrates the Apollo cache. `HomePageSections` maps GraphQL `__typename` values to the corresponding React component and ignores unsupported entries.

The companion content model is documented in [`content-blocks-cms-backend`](https://github.com/alirazawatoo/content-blocks-cms-backend).

## Local setup

```bash
cp .env.example .env.local
yarn install
yarn dev
```

Set `STRAPI_CMS_URL`, `STRAPI_URL`, and a valid read token for the local CMS. Values committed in example files must be treated as placeholders and replaced locally.

## Content mapping

- `ComponentCommonHeader` -> `HeaderBlock`
- `ComponentCommonCarousel` -> `CarouselBlock`
- `ComponentCommonTwoColumnBlock` -> `TwoColumnBlock`

The GraphQL document lives in `graphql/cms/homepage.graphql`; generated hooks and types are checked into `graphql/cms/homepage.generated.tsx`.

## Boundaries

- Static generation requires the CMS to be reachable during the build.
- Unknown dynamic-zone types render nothing rather than a fallback block.
- Component tests exist.
- The page still contains assessment-era title and introductory copy in the implementation.
