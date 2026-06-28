---
name: build-academic-portfolio
description: Create or refactor this React portfolio into a serious, reliable, responsive academic homepage for an Electrical and Electronic Engineering student. Use when working on the portfolio's visual system, homepage sections, project cards, research interests, skills, awards, experience, contact information, Merriweather typography, or academic content presentation in App.jsx, projectData.js, and styles.css.
---

# Build Academic Portfolio

Create a calm academic personal homepage that foregrounds engineering evidence and readable content. Preserve the repository's React/Vite structure and existing routes unless the user explicitly requests an architectural change.

## Workflow

1. Inspect `src/App.jsx`, `src/projectData.js`, `src/styles.css`, assets, routes, and existing user changes.
2. Reuse verified resume and project content. Do not invent awards, metrics, dates, institutions, research results, or contact details.
3. Establish the typography and color tokens before styling individual components.
4. Implement the requested sections with semantic, data-driven React components.
5. Check desktop and mobile layouts, keyboard focus, overflow, readable contrast, and reduced-motion behavior.
6. Run `npm run build` and report any content assumptions.

## Visual System

- Use Merriweather as the main font for headings, body copy, navigation, labels, and buttons.
- Import Merriweather from Google Fonts when network-loaded fonts are permitted. Use `Georgia, 'Times New Roman', serif` as fallback.
- Use a soft off-white or light-gray page background, white cards, dark charcoal text, and one muted navy or deep-blue accent.
- Use thin light-gray borders, restrained rounded corners, and subtle low-contrast shadows.
- Provide generous whitespace and comfortable paragraph line height.
- Use small pill-shaped tags for skills, project types, technologies, and research keywords.
- Prefer static clarity and restrained hover feedback. Avoid neon colors, large gradients, decorative glass effects, aggressive parallax, and commercial landing-page animation.
- Keep the page recognizably academic rather than corporate: emphasize authorship, technical scope, evidence, chronology, and research direction.

## Information Architecture

Build or preserve these sections when relevant to the request:

1. **Hero**: name, `Electrical and Electronic Engineering Student`, a concise academic introduction, `View Projects`, and `Contact Me`.
2. **About**: electronics, embedded systems, sensors, circuits, software development, and practical engineering work.
3. **Research Interests**: Embedded Systems, Circuit Design, Signal Processing, Sensors, PCB Design, Microcontrollers, and Software Engineering.
4. **Featured Projects**: formal project cards with title, concise description, technologies, engineering value, and links to detail routes.
5. **Skills**: compact pill tags such as STM32, C/C++, Java, PCB Design, Sensor Systems, Signal Processing, Embedded Development, and Circuit Analysis. Only include skills supported by project data or resume evidence.
6. **Awards and Experience**: a clean chronological timeline with dates, organizations, roles, and outcomes.
7. **Contact**: one simple contact card containing verified email, GitHub, LinkedIn, and portfolio links.

## Project-Specific Guardrails

- Keep `HashRouter` and existing `/#/projects/:id` detail routes working unless explicitly told to replace them.
- Source repeated project content from `src/projectData.js`; do not hardcode individual project entries in JSX.
- Keep detail page templates and media working when the request only concerns the homepage.
- Preserve unrelated user edits and existing local assets.
- Do not add dependencies when native React and CSS are sufficient.
- Make layout rules work at approximately 390px, 1440px, and 1920px widths.

## Quality Checklist

- Confirm Merriweather is applied consistently and has a serif fallback.
- Confirm section order and headings communicate an academic narrative.
- Confirm cards remain readable without hover and links have visible focus states.
- Confirm tags wrap without overflow.
- Confirm project, GitHub, LinkedIn, email, and contact links use correct destinations.
- Confirm mobile navigation and long technical titles do not overflow.
- Confirm `npm run build` succeeds.
