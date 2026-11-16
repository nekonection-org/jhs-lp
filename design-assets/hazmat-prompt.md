# Hero Hazmat

- Built-in tool: `image_gen.imagegen` (`transparent_background: true`). CLI/API fallback was not used.
- Project asset: `public/images/hazmat-operative.webp`.
- Dimensions: 1024 × 1536, preserved alpha, 199,838 bytes.
- Generated PNG was encoded to WebP with the existing Next.js Sharp dependency (quality 86, alpha quality 100). No new dependency was added.
- Original illustration created for this project; no game screenshot or official character model is used. The existing background and brand colors are retained in code.
- Presentation: next/image, decorative empty alt, desktop right-side cutout and mobile upper-body crop. Cropping and the lower edge mask are CSS presentation, preserving the asset's alpha.

## Final prompt

```text
Use case: stylized-concept. Asset type: transparent character cutout for an existing modern, minimal Rust community server landing page, Japan Hideaway Server. Primary request: a single original hazmat survival operative, recognizable as a grounded survival-game hazmat character, premium cinematic game-character render. Subject: weathered muted ochre/yellow hooded protective suit, charcoal black industrial respirator with circular filter and dark glass visor, practical charcoal harness and gloves, subtle worn canvas and rubber materials, no exposed face. Full body from hood to boots, relaxed but alert standing pose with slight asymmetry; body three-quarter turned toward the viewer's left, eyes/visor facing left toward page typography. Hands relaxed at sides, no weapons or held objects. Strong sculptural silhouette and accurate human anatomy. Composition: portrait, one complete isolated character centered, boots fully within frame, approximately 8 percent clear margin around the silhouette; suitable for right side of a landing-page hero. Lighting: refined neutral studio key light from upper left, crisp controlled cool-white edge separation, deep but legible shadows, physically plausible materials. Restrained colors, desaturated ochre and charcoal, no neon glow. Genuinely transparent background with preserved alpha; no floor, cast shadow, scenery, backdrop, frame, text, letters, watermarks, logos, insignia or official Rust/Facepunch branding. Original illustration, not a game screenshot, not a copied official character model.
```
