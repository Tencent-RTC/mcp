# CHANGELOG

## Version 1.9.0 @2026.11.10

### Added
- Added structured package/billing queries: a deterministic package knowledge matrix now answers package selection, version pricing, capability lists, billing rules, and component coexistence questions with structured results (exact price + capabilities + version limits + official purchase/activation links), replacing the "retrieve docs + model extracts numbers" path. Tested on 700+ real ticket questions: 97.2% recall, 86.2% exact-price hit rate.
- Added package selection (scenario + capabilities + budget), version lookup, billing-rule FAQ, and component coexistence-constraint queries for CallKit/LiveKit/RoomKit components and TRTC/Chat base packages.

## Version 1.8.6 @2026.10.28

### Fixed
- Fixed the `ERR_REQUIRE_ESM` error when starting in http / studio mode on low Node versions (< 20.19 / 22.12): the `uuid@13` (ESM-only) dependency of `vectra` cannot be loaded by CommonJS `require()`. Locked vectra's uuid to `8.3.2` (CJS) via `overrides`, so the vector index loads normally on low Node versions.
- Fixed the retrieval `ENOENT` crash when a long-running process references deleted files through a stale manifest after resource rebuild: manifest loading now validates mtime to invalidate the cache, and missing source files degrade to empty content instead of failing the entire retrieval.

## Version 1.8.4 @2026.10.23

### Changed
- Optimized retrieval ranking: exact API names, error codes, and document titles are now prioritized, reducing generic-word documents from stealing top results.
- Optimized candidate pool filtering: only the product dimension keeps hard isolation, while framework / types / scenario use soft down-weighting to reduce false filtering.

### Fixed
- Fixed exact API names / error codes not being recallable through natural language queries; they can now be matched via camelCase / underscore / path splitting.
- Fixed table-following content being dropped entirely during chunking of documents containing tables, which made some fields (such as `SendMsgResult`) unsearchable.
- Fixed documents being hard-filtered out and returning empty results when `framework` / `types` parameters were incorrect; this now uses soft down-weighting that only affects ranking.
- Fixed TRTC server-side / product-level questions (cloud API, billing, plans, etc.) triggering pointless platform prompts.

## Version 1.8.0 @2026.10.16

### Added
- Expanded knowledge base coverage: full documentation for Chat / Call / Live / Room / Push / TRTC product lines is now included in retrieval (product overview, purchase guide, client API, server API, UI-less integration, UI integration, API reference, integration guide, advanced features, best practices, etc.).

### Changed
- Optimized retrieval ranking: improved hit accuracy for FAQ, error code, API, and solution-type queries, reducing irrelevant document interference.
- Optimized Chinese/English document chunking granularity for more stable and reasonable retrieval recall.

### Fixed
- Fixed retrieval ranking deviation for some products under FAQ, callback, and solution-type queries.

## Version 1.7.8 @2026.09.20

### Added
- Added RRF-based BM25 + Dense hybrid retrieval, improving recall and ranking stability for complex natural-language queries.
- Added a vector index build pipeline: integrated `build:vectors` to generate/update vector indexes during build, enabling semantic recall in the retrieval flow.

### Changed
- Optimized pre-framework gating rules: expanded cross-platform query recognition and added English `callback` / `server callback` signals, reducing misclassification of server-callback questions as framework-required.
- Enhanced prompt framework detection in `preflight-route`: added explicit `vue/react` signals to improve framework completion accuracy in product-only entry scenarios.

### Fixed
- Fixed false `needs_framework` triggers in some Chat scenarios caused by missing framework signals or English callback phrasing, reducing cases where directly retrievable requests were blocked by preflight gating.

## Version 1.7.7 @2026.09.11

### Changed
- Optimized MCP connection stability and observability, improving exception troubleshooting and runtime diagnostics.

## Version 1.7.6 @2026.09.09

### Changed
- Cleaned traffic-entry content in the knowledge base to reduce retrieval noise.
- Refactored tool definitions: unified invocation boundaries, trigger semantics, and template structures across tools.
- Adjusted global Workflow semantics to be consultation-flow-only, reducing tool-routing ambiguity.

### Fixed
- Fixed boundary conflicts and inconsistent parameter wording in some integration tool definitions (for example, `get_native_callkit_core_integration`), improving invocation stability.

## Version 1.7.5 @2026.09.04

### Changed
- Refactored the `preflight-route` decision model to an **agent-first, minimal-correction** strategy: prioritize agent-provided `product/frameworks`, and use prompt signals only for high-confidence corrections and narrowing to avoid unsupported expansion.
- Optimized framework-axis conflict handling: added/enhanced strong-lock strategies for `react-native` and `miniprogram`, and in strong-lock scenarios, separated host environment (`android/ios`) from the actual framework to reduce over-narrowing.
- Optimized native TRTC correction: when the prompt matches native TRTC classes/methods and no WebRTC hard signal is present, narrow `rtcengine` to `native_trtc_sdk` to reduce web/native cross-routing risk.

### Fixed
- Fixed over-overriding of agent results when strong framework terms are only passively mentioned, reducing false corrections triggered by doc-enumeration terms.

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
