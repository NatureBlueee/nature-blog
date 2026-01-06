<div align="center">

# 🌓 Surface & Inner

**A personal blog merging Song Dynasty aesthetics with Swiss design, exploring the boundary between rationality and sensibility.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-natureblueee.com-black)](https://natureblueee.com)
[![中文](https://img.shields.io/badge/🇨🇳_中文-README-gray)](./README.md)

</div>

---

## ✨ Highlights

- 🎭 **Three-Screen Immersion** — Surface (rational) → Inner (emotional) → Ground (spiritual)
- 🖌️ **Song Dynasty × Swiss Style** — Restrained emptiness meets precise grids
- 💨 **Poetic Interactions** — Smoke, breathing, kintsugi visual motifs
- 🤖 **AI-Collaborated Development** — Built with Antigravity and Kiro
- ⚡ **Blazing Fast** — ISR static generation, instant first paint
- 🌐 **Bilingual** — Notion CMS powered multilingual support

---

## 📖 Overview

This is not just a blog — it's a visual experiment on the **unity of dualities**.

We all have rational thoughts and emotional expressions. This project uses three spatial dimensions to present the completeness of humanity: as you scroll, you journey from "daylight" into "night," ultimately arriving at the "origin."

**Design Philosophy:**
| Space | Colors | Experience |
|-------|--------|------------|
| Surface | Rice Paper + Ink Black | Order, Logic |
| Inner | Crow Blue + Moon White | Intuition, Dreams |
| Ground | Aged Silk + Gold Kintsugi | Spirituality, Unity |

**Development Tools:**
- **Antigravity** (Google DeepMind) — Architecture, implementation
- **Kiro** (Amazon) — Debugging, iteration

---

## 🎨 Visual Preview

```
┌─────────────────────────────────────────────────────┐
│  SURFACE WORLD                                       │
│  Rice Paper #F9F9F9 │ Ink #111 │ Cinnabar #CC281C   │
│  68% void ──│── 32% content                         │
├─────────────────────────────────────────────────────┤
│  INNER WORLD                                         │
│  Crow Blue #1A1C1E │ Moon White #D6ECF0 │ Smoke     │
├─────────────────────────────────────────────────────┤
│  GROUND                                              │
│  Aged Silk #E6E4D5 │ Gold #C5A059 │ Mandala         │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  ISR Cache   │  │  Version     │  │  SEO Structured  │   │
│  │  1h refresh  │  │  Detection   │  │  RSS/Atom/JSON   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Notion API (CMS)                       │
│       Article Database │ Rational/Emotional │ zh/en         │
└─────────────────────────────────────────────────────────────┘
```

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Framer Motion · Notion API · Vercel

---

## 🚀 Installation

### Requirements
- Node.js ≥ 18.18.0
- Notion account

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/NatureBlueee/nature-blog.git
cd nature-blog

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
NOTION_TOKEN=your-notion-integration-token
NOTION_DATABASE_ID=your-database-id
```

```bash
# 4. Start development server
npm run dev
```

Open http://localhost:3000 to see the result.

---

## 📁 Project Structure

```
src/
├── app/                # Page routes
├── components/
│   ├── screens/        # Three screens (Surface/Inner/Ground)
│   ├── article/        # Article components
│   └── common/         # Shared (cursor/smoke/texture)
├── config/             # Site config, theme variables
├── services/notion/    # Notion API service
└── lib/seo/            # SEO optimization
```

---

## 🤝 Contributing

Issues and PRs are welcome!

For design ideas, check [AESTHETIC_DNA.md](./AESTHETIC_DNA.md) to understand the design language.

---

## 📄 License

MIT License © 2024 [Zhang Chenxi / Nature](mailto:hi@natureblueee.com)
