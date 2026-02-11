# NCR RealtyHub

Indianized real-estate web app for Noida, Greater Noida, and Delhi NCR.

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this repo to GitHub (already done).
2. In Vercel, click "New Project" and import the repository.
3. Use the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy. The `vercel.json` rewrite ensures React Router routes work on refresh.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Leaflet (maps)
