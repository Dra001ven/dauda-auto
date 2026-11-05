# Dauda Motos

Website for Dauda Motos, a car dealership in Lagos and Abuja. Built with React 19, Vite 8 and Lenis.

## Pages

- **Home**: full-screen GT3 RS video hero, video reel, IL CORSA and technology sections, testimonials, inquiry form.
- **Model**: car carousel with live paint, custom colour and gloss / satin / matte finish.
- **Performance**: telemetry board, acceleration bars, power curve and lap times.
- **Technology**: the same carousel with each car's real specs.
- **Stock** (`#/stock`): search, category chips and sorting. Each car opens `#/stock/<car>` with a
  customiser (paint, finish, leather, studio cut-out or photo) and a running build price in naira.
- **Brand** and **Contact**: history, values, showrooms and appointment booking.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Where things live

- `src/dosla/`: app shell and router (`Dosla.jsx`), pages, stock data (`stock.js`), live repaint (`Recolor.jsx`)
  and scroll motion (`motion.js`).
- `public/stock/`: upscaled stock photos, paint masks and background-free cut-outs.
- `public/video/`: muted loops cut from the GT3 RS film.
- `work/`: image and video tooling (`stock.py` upscale, masks and cut-outs; screenshot scripts).
- `docs/IMAGE-WORKFLOWS.md`: how every image and clip was sourced and processed.

## Before going live

- Licence or replace the stock photos and video clips (see the docs).
- Replace the placeholder showroom addresses and phone numbers in `src/dosla/pages.jsx`.
- Set the naira rate in `NGN_RATE` in `src/dosla/stock.js`.
