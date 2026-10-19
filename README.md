# Service Loop

A responsive construction equipment and site-services marketplace frontend for Nigeria, built in your React + TypeScript + Vite project.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The existing development server uses http://localhost:5173.

## What works

- Equipment search by name, category and location, with price sorting and operator filters.
- Responsive equipment categories and listings with local equipment imagery.
- Equipment details, rental duration, and a transparent equipment subtotal.
- Quote and service requests saved in browser localStorage.
- Saved equipment that survives refreshes.
- A sample equipment listing form that adds to the local marketplace.
- Mobile navigation, keyboard-accessible native dialogs, FAQ accordions, empty states, and reduced-motion support.
- Custom Service Loop logo, SVG favicon, and a downloadable SVG wordmark in `public/service-loop-logo.svg`.

## Scope

This is a frontend preview. Sample vendors, prices, specifications and availability are illustrative. Photos represent equipment types. Requests are not sent to suppliers, listings are not published to a live marketplace, and no payments are collected. Use the footer's privacy and demo information dialog to clear local data.

Production authentication, vendor verification, inventory availability, payments, logistics, and request delivery need backend integration.

## Project map

- `src/App.tsx`: marketplace UI, dialogs, filtering, and local interactions.
- `src/App.css`: component styles and responsive layouts.
- `src/index.css`: typography, global styles, and color variables.
- `src/data.ts`: typed sample inventory, currency formatting, date and storage helpers.
- `src/components/Icons.tsx`: original SVG loop logo, interface icons and equipment category drawings.
- `tests/marketplace.spec.ts`: browser tests for search, saving, quote calculations, listing creation, images, and mobile navigation.

## Validation

```sh
npm run build
npm run test:e2e
```

The browser tests use installed Microsoft Edge on Windows and Playwright Chromium elsewhere. On a non-Windows machine, install the browser with `npx playwright install chromium`. Tests run a separate Vite server on port 5182 and save screenshots to ignored `test-results/`.

## Visual direction

Forest green `#173f35`, warm cream `#f6f5ef`, orange `#e98142`, and muted botanical greens. Typography uses Manrope and DM Sans from Google Fonts, with system sans-serif fallbacks. The loop mark represents two sides of the rental marketplace coming together.

## Photo references

Equipment photos are illustrative, downloaded locally so cards do not depend on remote image availability. Replace these with your own vendor listing images when integrating inventory.

- Excavator: Evan Porter, [Unsplash](https://unsplash.com/photos/a-bulldozer-digging-through-a-construction-site-N8gLtdr4xLI).
- Crane: [Apollo Property](https://apolloproperty.com.au/), construction imagery.
- Generator: [Caterpillar product imagery via Mustang Cat](https://www.mustangcat.com/new-equipment/power-systems/electric-power/3516-diesel-generator-set/).
- Mixer: [OMAER](https://www.omaer.com/en/omaerworld/concrete-mixer-characteristics-and-use/).
