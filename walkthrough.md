# Aesthetic Optimization Walkthrough

## Surface Screen (表世界)

### 1. Rice Paper / Plaster Texture (宣纸/泥墙质感)
*   **Technique**: Procedural SVG filters (Noise + Turbulence).
*   **Effect**: Subtle, organic material feel.

### 2. Architectural Typography (金石气排印)
*   **Technique**: Wide letter-spacing + Ink bleed shadow.
*   **Effect**: Monumental, inscribed look.

### 3. Cinnabar Pulse (朱砂呼吸)
*   **Technique**: CSS Keyframe Animation.
*   **Effect**: Organic life-force indication.

## Inner Screen (里世界)

### 1. Left Void Image (虚空影像)
*   **File**: `src/components/screens/InnerScreen.tsx`
*   **Detail**: Added the "Buddha/Water" silhouette image to the left void area.
*   **Technique**: `mix-blend-mode: screen`, `opacity: 0.3`.
*   **Effect**: A ghostly, spiritual presence in the void.

### 2. Fluid Typography (流体浮动)
*   **File**: `src/app/globals.css`, `src/components/screens/ArticleEntry.tsx`
*   **Detail**: Articles float up and down with different phases (`float-phase-1/2/3`).
*   **Effect**: Text feels suspended in liquid or smoke.

### 3. Atmospheric Depth (大气景深)
*   **File**: `src/app/globals.css`, `src/components/screens/ArticleEntry.tsx`
*   **Detail**: Unfocused articles have `blur(0.5px)`. Hovering brings them into focus.
*   **Effect**: Simulates looking through a dense atmosphere.

### 4. Ink Texture Overlay (墨迹纹理)
*   **File**: `src/app/globals.css`, `src/components/common/SmokeFilters.tsx`
*   **Detail**: Titles have a granular texture using `background-clip: text` and an SVG `#noise` filter overlay.
*   **Effect**: Text looks like it's written with dissolving ink.

## Verification Checklist

- [x] **Surface**: Texture, Typo, Pulse.
- [x] **Inner**: Image Overlay, Float, Blur, Ink Texture.
