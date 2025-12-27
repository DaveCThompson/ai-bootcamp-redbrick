# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
-   **Draggable Component Actions**: Added `+` button to prompt elements in the component browser for direct addition to the prompt.
-   **Documentation**: Added `docs/STRATEGY-CSS.md` and updated agent protocols (`AGENTS.md`) with strict CSS mandates.

### Changed
-   **Iconography**: Updated `index.html` to load Material Symbols with `opsz` range `15..48` (previously `20..48`) to support 16px icons.
-   **Button Styling**:
    -   Standardized all buttons to use `font-weight: 600` (SemiBold).
    -   Enforced strict concentric radii logic for nested buttons (e.g., Component Browser action buttons: 10px container, 4px spacing, 6px button radius).
    -   Increased small button hit area target to 24px (from 20px) while maintaining 16px icon size.
-   **Output Panel**: Repositioned logic to use the new `PanelHeader` actions prop; switched "Copy" button to `primary` variant.
