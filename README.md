# Archive Doctrina

An atmospheric conceptual studio world built as a premium interactive 3D exhibition. Navigate a void-like sky environment, gaze at floating film frames, and explore an archive of creative projects.

> **Note:** The full experience is optimized for desktop with a mouse/trackpad. A mobile-friendly fallback grid view is shown on touch or small-screen devices.

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — Three.js renderer for React
- [Drei](https://github.com/pmndrs/drei) — Three.js helpers
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- [TypeScript](https://www.typescriptlang.org)

## Prerequisites

- **Node.js** 18.18 or later
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/cesarroger/archive-doctrina.git
cd archive-doctrina
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Start the production server (requires `build` first) |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & layout
│   ├── layout.tsx        # Root layout (fonts, metadata)
│   ├── page.tsx          # Home page
│   └── projects/[slug]/  # Individual project pages
├── components/           # React components
│   ├── archive-doctrina-experience.tsx  # Main entry component
│   ├── void-scene.tsx    # Three.js 3D scene
│   ├── floating-frame.tsx
│   ├── intro-screen.tsx
│   ├── project-overlay.tsx
│   ├── gaze-detector.tsx
│   └── cloud/            # Cloud-related 3D components
└── data/
    └── projects.ts       # Project definitions (add your own here)
```

## Adding Projects

Edit `src/data/projects.ts` to add or modify projects. Each project requires:

```ts
{
  id: string;           // unique identifier
  slug: string;         // URL slug  (e.g. "my-project")
  title: string;
  tagline: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  duration: string;     // e.g. "08:42"
  location: string;
  accent: string;       // hex colour for UI accents
  posterAccent: string; // hex colour for poster gradient
  frameTone: string;    // hex colour for frame background
  videoUrl: string;     // publicly accessible video URL
  position: [number, number, number]; // 3D world position
  rotationY: number;    // frame Y-axis rotation in radians
  detailSections: Array<{ heading: string; body: string }>;
}
```

## Deployment

The easiest way to deploy is with the [Vercel Platform](https://vercel.com/new):

```bash
npm run build
```

Then follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other hosting options.
