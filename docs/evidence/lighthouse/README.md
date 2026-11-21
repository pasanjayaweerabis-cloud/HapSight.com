# Lighthouse evidence (Appendix D)

Measured on 16 November 2026 with Chrome DevTools (Lighthouse navigation audit + performance
trace), production builds served locally (`next build` + `next start`), mobile emulation
(412 × 915, DPR 2.6, 4× CPU slowdown, Slow 4G).

| Build | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Before: `main` (5b92cd7) | 100 | 100 | 100 | 1.64 s | 0.00 |
| After: `feat/persistent-3d-stage` | 100 | 100 | 100 | 1.65 s | 0.00 |

- Reports: `before-main-mobile/` and `after-branch-mobile/` (`report.html`, `report.json`,
  `trace.json.gz`).
- The Lighthouse **Performance score** is not included: the DevTools audit used here covers
  Accessibility, Best Practices and SEO only. Run the full Lighthouse CLI (or PageSpeed Insights
  on the live https://hapsight.com) to get it.
- Localhost has no CDN or HTTP/2, so live numbers on Vercel will differ.
