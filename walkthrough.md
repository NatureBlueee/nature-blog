# Surface Screen Optimization Walkthrough

## Changes Implemented

### 1. Rice Paper / Plaster Texture (宣纸/泥墙质感)
*   **File**: `src/app/globals.css`, `src/components/screens/SurfaceScreen.tsx`
*   **Detail**: Replaced `.bg-grid-pattern` with `.bg-paper-texture`.
*   **Technique**: Used dual SVG filters:
    *   High-frequency noise (`baseFrequency='0.8'`) for paper fibers.
    *   Low-frequency turbulence (`baseFrequency='0.02'`) for wall/plaster unevenness.
*   **Effect**: Creates a subtle, organic texture that feels like "material" rather than "digital white".

### 2. Architectural Typography (金石气排印)
*   **File**: `src/app/globals.css`, `src/components/screens/SurfaceScreen.tsx`
*   **Detail**: Added `.text-architectural` with `0.8em` letter-spacing and ink-bleed text shadow.
*   **Effect**: Transforms text into "monuments" or "ink on paper".

### 3. Cinnabar Pulse (朱砂呼吸)
*   **File**: `src/app/globals.css`, `src/components/screens/SurfaceScreen.tsx`
*   **Detail**: Added `@keyframes pulse-cinnabar` and applied it to the red accent line.
*   **Effect**: Introduces a slow, organic "breath" to the rational structure.

## Verification Checklist

- [x] **Texture**: SVG filter applied to left void area.
- [x] **Typography**: New class created and applied to Logo/Signature.
- [x] **Animation**: Keyframes defined and applied to the accent line.
