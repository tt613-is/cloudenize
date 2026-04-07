# Changelog

All notable changes to Cloudenize.

## [0.1.1.0] - 2026-04-07

### Added
- **幻想云识别 (Fantasy Cloud Recognition):** App now recognizes non-real cloud images — cartoons, kawaii illustrations, 3D renders, art installations, etc. — and assigns one of 7 invented fantasy cloud types (梦境积云, 彩霞幻云, 星织云, 画境云, 糖棉云, 水墨幻云, 童话云). If no fixed type fits, GPT freely invents a poetic new name. Card format is identical to real cloud cards — fully immersive, no distinction shown.
- **season: "梦境"** — fantasy clouds without seasonal cues now return 梦境 instead of 未知.

### Changed
- `lib/cloudIdentify.ts` prompt expanded from 10-type meteorological list to dual-section structure (real clouds + fantasy clouds + free-naming fallback). No API or UI changes.

## [0.1.0.0] - 2026-04-07

### Added
- **Instant Film Plastic card design (variant-E):** Polaroid-style card now renders with a plastic sheen, layered box shadows, left-edge highlight strip, chemical film iridescence, vignette, and a hard frame border — feels like an Instax print ejecting from a camera
- **Card eject animation:** `.card-enter` now uses a `cardEject` keyframe that slides the card up from below with a subtle overshoot, replacing the previous fade-in
- **星雾 design system:** Warm parchment background (radial gradient `#ede5d8 → #d4c9b6`), deeper title letterSpacing (0.45em), italic subtitle, warm-tinted upload zone with inner glow, and unified `#4a3828` action color across buttons and spinner

### Fixed
- Card no longer overflows on iPhone SE (375px): changed photo area from fixed `width: 336, height: 336` to `width: "100%", aspectRatio: "1"` with `maxWidth: calc(100vw - 32px)` on the card
- Removed duplicate cloud name + description box that appeared below the card; the PolaroidFrame already shows all the text

### Changed
- Photo filter upgraded to `contrast(1.06) saturate(1.10) brightness(1.01)` for richer Instax-style color
- Cloud name color changed to `#181818` (higher contrast), meta text to `#b4b0ac` (cooler neutral), description to `#444040`
- Frame selector UI removed in earlier session; card is now locked to the polaroid frame
- URL input hidden behind `?debug=1` backdoor; upload-only UI is the primary flow
- Confidence badge and English cloud name removed from previous display
