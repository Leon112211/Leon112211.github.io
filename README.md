# Ziwen Liao — Portfolio

A dark, research-led engineering portfolio built with React, Vite and HashRouter.

## Open the website

On Windows, double-click `打开个人网站.vbs`. It starts the local server in the background and opens the portfolio in the default browser.

For terminal-based development:

```bash
npm install
npm run dev
```

## Project routes

- `/#/projects/gmaster`
- `/#/projects/solar-pv`
- `/#/projects/force-sensor`
- `/#/projects/cardiopulmonary-sensor`

Project content is centralized in `src/projectData.js`. Page templates and shared components are in `src/App.jsx`; the visual and responsive system is in `src/styles.css`.

## Production build

```bash
npm run build
npm run preview
```
