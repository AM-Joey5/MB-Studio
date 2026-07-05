# MB Studio — Website

A production-quality, fully responsive marketing website for **MB Studio**, a modern music recording and production studio. Built with plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step, no dependencies to install.

**[Live Demo](#)** *(update this link once deployed)*

---

## Overview

This repository contains a complete 7-page website:

| Page | Purpose |
|---|---|
| `index.html` | Homepage — hero, featured services, stats, why-choose-us, latest projects, testimonials preview, contact CTA |
| `about.html` | Company story, mission & vision, team, studio timeline, studio photos |
| `services.html` | All 8 studio services with detailed breakdowns and process steps |
| `gallery.html` | Filterable masonry gallery with lightbox + video showcase |
| `testimonials.html` | Animated review slider + star-rated review grid |
| `contact.html` | Validated contact form, map placeholder, hours, socials |
| `404.html` | Custom not-found page |

The design direction is **dark, premium and gold-accented**, with glassmorphism panels, an animated waveform motif (nodding to the studio's actual product — sound), scroll-reveal animation, and a mobile-first responsive layout.

---

## Features

- Fully responsive layout (mobile, tablet, desktop)
- Sticky, glassmorphic navbar with animated mobile menu
- Dark luxury theme with antique-gold accents and gradient text
- Animated hero waveform + page-load animation
- Scroll-reveal animations via `IntersectionObserver`
- Filterable masonry gallery with keyboard-accessible lightbox
- Auto-playing, swipeable testimonials slider with dot/arrow controls
- Contact form with real-time client-side validation (no backend wired up)
- Back-to-top button, animated loader, custom 404 page
- Lazy-loaded images (`loading="lazy"`) with explicit width/height to avoid layout shift
- Semantic HTML5, ARIA labels, visible keyboard focus states, `prefers-reduced-motion` support
- SEO: unique meta titles/descriptions per page, canonical tags, Open Graph + Twitter Card tags, JSON-LD structured data (`LocalBusiness`, `Service`, `BreadcrumbList`, `ContactPage`)
- `sitemap.xml` and `robots.txt` included
- GitHub Actions workflow for one-click GitHub Pages deployment

---

## Folder Structure

```
MB-STUDIO/
│
├── index.html
├── about.html
├── services.html
├── gallery.html
├── testimonials.html
├── contact.html
├── 404.html
├── style.css
├── script.js
├── README.md
├── LICENSE
├── sitemap.xml
├── robots.txt
├── favicon.ico
│
├── assets/
│   ├── images/     → studio, team, gallery & client photography
│   ├── icons/      → optional icon assets
│   ├── videos/     → gallery video showcase (e.g. session-reel.mp4)
│   └── fonts/      → optional self-hosted fonts (Google Fonts CDN used by default)
│
└── .github/
    └── workflows/
        └── deploy.yml    → GitHub Pages deployment workflow
```

---

## Installation

No build tools or package manager are required.

```bash
git clone https://github.com/your-username/MB-STUDIO.git
cd MB-STUDIO
```

## Local Development

Open `index.html` directly in a browser, or serve the folder locally so relative paths and lazy-loading behave the way they would in production:

```bash
# Python 3
python3 -m http.server 8000

# or Node.js
npx serve .
```

Then visit `http://localhost:8000`.

---

## Adding Real Media

This template ships with **placeholder image and video filenames** already wired into the HTML (see the `README.txt` inside each `assets/` subfolder for the exact filenames expected). Drop your own optimized photos and video into the matching folders using the same filenames, or update the `src`/`href` attributes in the HTML to match your own filenames.

Recommended formats: `.webp` or optimized `.jpg` for photos, `.mp4` (H.264) for the gallery video reel.

---

## Deploying to GitHub Pages

This repo includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push this repository to GitHub.
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to the `main` branch (or run the workflow manually from the **Actions** tab) — the site will build and deploy automatically.
5. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

If you're deploying to a custom domain or a different path, update every `canonical`, Open Graph and sitemap URL (currently placeholder `https://www.example.com/...`) to match your real domain.

---

## Customization Guide

- **Colors** — all colors are CSS custom properties defined at the top of `style.css` under `:root`. Change `--color-gold`, `--color-bg`, etc. to re-theme the whole site.
- **Typography** — swap the Google Fonts `<link>` in each page's `<head>` and update `--font-display` / `--font-body` / `--font-mono` in `style.css`.
- **Content** — all copy lives directly in the HTML files; there is no CMS or templating layer, so edit the markup directly.
- **Contact form backend** — the form in `contact.html` validates client-side only. To make it functional, connect it to a form backend (Formspree, Netlify Forms, a custom API endpoint, etc.) inside the submit handler in `script.js` (see the comment marked "No backend is connected in this template").
- **Google Map** — `contact.html` includes a placeholder map block; swap in a real `<iframe>` embed URL from Google Maps (see the HTML comment above the placeholder for the exact spot).
- **Business info** — the phone number, email, address and hours appear in the footer of every page and in `contact.html`; update all instances together, and update the `LocalBusiness` JSON-LD block in `index.html` to match.

---

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `backdrop-filter`, CSS Grid, and `IntersectionObserver` — all broadly supported, with graceful fallbacks where reasonable (e.g. reveal animations degrade to "always visible" without `IntersectionObserver`).

---

## Credits

- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Inter](https://fonts.google.com/specimen/Inter), and [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts.
- Design & build: MB Studio template, built with plain HTML/CSS/JS.
- All studio, team and client photography referenced in this template are placeholders — replace with licensed or original photography before production use.

## License

Released under the [MIT License](LICENSE) — free to use, modify and distribute.
