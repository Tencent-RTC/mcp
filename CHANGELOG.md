# CHANGELOG

## Version 1.7.4 @2026.08.31

### Added
- Added 4 CallKit Flutter best-practice docs: Android background call keep-alive, iOS background audio keep-alive, iOS startup crash troubleshooting, background incoming call notification troubleshooting.
- Added CallKit Android video chat dating scenario (VideoChat Demo) best-practice doc, covering Demo setup and component quick integration.
- Added CallKit HarmonyOS platform support: UIKit integration guide and API reference.
- Added CallKit Mini Program & uni-app docs: UIKit integration guide, API reference, uni-app packaging guide.
- Added CallKit uni-app (Android/iOS) standalone integration docs and API reference.
- Added Chat Vue3/React H5 mobile integration docs.

### Changed
- Optimized Chat UIKit search tags: vue/react framework changed from single tag to dual tags (`['vue','web']` / `['react','web']`), allowing `frameworks=['web']` to match Chat Web docs.

## Version 1.7.3 @2026.08.17

### Added
- Added knowledge base resources for RoomKit multi-platform integration, recording, whiteboard, network proxy, AI noise reduction, and subtitle translation, expanding coverage of the Room product domain.
- Added best-practice docs covering error codes, log levels, automatic screen-share stop, and WeChat Mini Program error troubleshooting.
- Added a generic additive rerank module with anchor selection and phrase extraction, integrated into the search reranking logic to improve recall ranking accuracy.

### Changed
- Optimized the BM25 index to use prototype-less objects, improving the isolation and stability of the index structure.

### Fixed
- Fixed BM25 scoring anomalies caused by prototype-key pollution by adding prototype-key guards, preventing score pollution and NaN issues.

## Version 1.7.2 @2026.08.13

### Changed
- Improved observability into retrieval routing accuracy.

## Version 1.7.1 @2026.08.11

### Added
- Added pre-search normalization: normalizes `product` / `frameworks` based on prompt truth, fixing retrieval bias caused by wrong agent inference.

### Changed
- Optimized the `search_trtc_knowledge` output contract: removed brevity wording such as "1-2 sentence per subsection", replaced with complete synthesized answers.

### Fixed
- Fixed the case where mis-passed dual product / dual frameworks (e.g., "安卓 Web TRTC") were not corrected according to the prompt truth.

## Version 1.7.0 @2026.08.02

### Added
- Added and synchronized best-practice docs across product domains including Chat / Call / Live / Room to improve knowledge coverage.

### Changed
- Continued refactoring of the bilingual retrieval pipeline, including query normalization, intent routing, candidate filtering, and exact-match strategies.
- Improved recall and ranking for best-practice and URL-based documents to increase answer usability and stability.
- Improved `search_trtc_knowledge` definitions and answer constraints for better readability and executability.

### Fixed
- Fixed off-topic retrieval in some complex queries, reducing high-score false-positive hits.

## Version 1.6.6 @2026.07.18

### Added
- Added support for `get_native_live_uikit_integration`, enabling LiveKit(Android/iOS) UI integration guidance.

## Version 1.6.0 @2026.07.01

### Added
- Refactored MCP retrieval capabilities and consolidated the MCP toolset.
- Added support for `search_trtc_knowledge` to retrieve real-time audio/video (TRTC/IM) documentation.
