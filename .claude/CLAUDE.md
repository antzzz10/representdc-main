# Represent DC Main Site - Project Memory

## Project Overview
Landing page for RepresentDC.org that explains D.C.'s lack of representation and links to the bill tracker. Persuasive advocacy site using loss-framing and American values messaging.

**Tech Stack:** React 19 + Vite

**Live URLs:**
- Production: https://www.representdc.org (GitHub Pages)
- Bill Tracker: https://billtracker.representdc.org (separate repository)

## Project Structure

```
representdc-main/
├── src/
│   ├── App.jsx          # Main landing page component
│   ├── App.css          # All styling
│   └── main.jsx         # React entry point
├── public/
│   ├── CNAME            # Custom domain: www.representdc.org
│   ├── .nojekyll        # Disables Jekyll on GitHub Pages
│   └── vite.svg
├── dist/                # Build output (not in git)
├── package.json
├── vite.config.js
└── STRATEGY.md          # Messaging strategy document
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Deployment
```bash
npm run deploy       # Build and deploy to GitHub Pages (www.representdc.org)
```

## Site Content

### Key Messaging
- **Problem Framing:** "Congress Is Blocking D.C. Laws Right Now"
- **Loss Framing:** Shows what Congress has already taken away (not just threats)
- **American Values:** "No taxation without representation"
- **Solution:** D.C. statehood for full democracy

### Sections
1. **Hero** - Breaking news, urgency, CTA to bill tracker
2. **Facts** - 0 Senators, 0 voting members, 71 bills
3. **Impact** - What Congress has blocked (healthcare, policing, traffic, etc.)
4. **American Values** - No taxation without representation quote
5. **Trend** - Getting worse narrative with stats
6. **Solution** - D.C. statehood benefits
7. **Footer** - Links to bill tracker, about section, copyright

### Current Stats (as of 2025-11-19)
- **71 bills** pending in Congress (54 bills + 17 riders)
- **2 bills** just passed the House (H.R. 5214, H.R. 5107)
- **700,000** D.C. residents without representation

## Design System

### Colors
- **Primary Red:** `#DC143C` (matches bill tracker)
- **Dark Red:** `#A00000`
- **Accent Gold:** `#FFD700`
- **Dark Background:** `#1a1a1a`
- **Light Background:** `#f8f9fa`

### Typography
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', etc.
- Hero title: 3.5rem, weight 800
- Section titles: 2.5rem, weight 700
- Body text: 1.1rem, line-height 1.6

### Components
- **Hero section** - Red gradient background with urgency badge
- **Fact cards** - Grid layout with large numbers
- **Impact cards** - Icon + heading + description
- **CTA buttons** - Primary (white on page), Secondary (red)
- **Footer** - Matches bill tracker design

## Deployment Configuration

### GitHub Pages Setup
- Repository: `representdc-main`
- Branch: `gh-pages` (auto-created by gh-pages package)
- Custom domain: `www.representdc.org`
- CNAME file in `/public/` directory
- `.nojekyll` file to disable Jekyll processing

### DNS Configuration
Your DNS provider should have:
- CNAME record: `www` → `[your-github-username].github.io`
- Or A records pointing to GitHub Pages IPs

### Important Files
- `public/CNAME` - Contains "www.representdc.org"
- `public/.nojekyll` - Empty file, prevents Jekyll processing
- `vite.config.js` - `base: '/'` for custom domain
- `package.json` - `"deploy": "gh-pages -d dist --dotfiles"`

## Content Updates

### When Bills Pass
Update in `src/App.jsx`:
- Line 19: Update date and note (e.g., "2 bills just passed the House")
- Update stats in Facts section if needed

### Updating Bill Count
If total bill count changes:
- Line 14: Update subtitle count
- Line 17: Update CTA text
- Line 39: Update fact card number
- Line 127-133: Update trend stats

## Relationship to Bill Tracker

**Main Site (www.representdc.org):**
- Educational/advocacy landing page
- Explains the problem and solution
- Drives traffic to bill tracker

**Bill Tracker (billtracker.representdc.org):**
- Detailed tracking of all 71 bills
- Searchable, filterable database
- PDF/CSV exports
- Separate repository: `dc-bills-tracker`

**Links:**
- Main site links to tracker in hero CTA
- Main site links to tracker in trend section
- Main site links to tracker in footer
- Both sites share same branding and copyright

## Copyright & Attribution

**Copyright:** © 2025 Represent DC

**About:**
"This is an independent, volunteer-run project created by a proud DC resident
to track anti-DC legislation and advocate for full democracy for D.C. residents.
Not affiliated with any organization."

Same attribution appears on both main site and bill tracker.

## Troubleshooting

### Custom Domain Not Working
1. Check `public/CNAME` contains `www.representdc.org`
2. Verify DNS settings at your domain registrar
3. Check GitHub Pages settings in repository
4. Ensure `--dotfiles` flag in deploy script

### Build Errors
- Run `npm install` to ensure dependencies are up to date
- Clear `node_modules` and reinstall if needed
- Check ESLint errors with `npm run lint`

### Deployment Issues
- Ensure `gh-pages` package is installed
- Check that `dist/` folder is being created during build
- Verify `gh-pages` branch exists in GitHub repository

## Future Enhancements

- Add analytics tracking
- Create blog/news section
- Add email signup form
- Integrate with bill tracker data API
- Add social sharing functionality
- Create additional landing pages for specific issues

## Related Documentation

- **STRATEGY.md** - Detailed messaging strategy
- **Bill Tracker CLAUDE.md** - Documentation for billtracker.representdc.org
- **FEEDBACK-SETUP.md** (in bill tracker repo) - Feedback system setup
