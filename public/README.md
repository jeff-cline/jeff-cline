# JEFF-CLINE-444

Jeff's personal favicon and easter egg branding. Use on every deployment.

## Favicon
- `favicon.svg` - Scalable vector (JC + 444, dark bg, orange/teal)
- `favicon.ico` - Browser favicon
- `favicon-16x16.png` / `favicon-32x32.png` - Standard sizes
- `apple-touch-icon.png` - 180x180 for iOS
- `favicon-192x192.png` - Android/PWA

## Deployment Checklist
1. Copy all favicon files to project's `public/` directory
2. Add favicon meta tags to `<head>` (or Next.js layout metadata)
3. Add the easter egg footer link (see below)

## Easter Egg Footer
Add a near-invisible "JC" link in every footer, linking to https://jeff-cline.com.
Style: 6px font, opacity 0.08, barely visible unless you're looking for it.

```jsx
<a href="https://jeff-cline.com" target="_blank" rel="noopener" 
   style={{fontSize:'6px',opacity:0.08,color:'inherit',textDecoration:'none'}}>
  JC
</a>
```

## Colors
- Orange: #FF8900
- Teal: #55BFBF
- Background: #111
