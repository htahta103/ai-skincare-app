# ROAST - UI Specification
## Design System & Component Library

> **Style**: Sassy Minimalist (Apple-style 2.0 with Bold Editorial Typography)  
> **Version**: 1.0 MVP  
> **Last Updated**: 2026-01-02

---

# 1. Design Philosophy

ROAST's UI is built on the concept of **"High-End Honesty"**. It looks like a luxury skincare brand but talks like a brutally honest best friend.

- **Layout**: Bento-box grids for organized information.
- **Typography**: High-contrast weights (Light body vs. Extra Bold headlines).
- **Interactions**: Playful but sharp. Components should feel "aware" of the data they show.

---

# 2. Design Tokens

## 2.1 Color Palette (Premium Roast)

| Token | Hex | Usage |
|-------|-----|-------|
| **Pure White** | `#FFFFFF` | Primary background |
| **Rich Black** | `#0A0A0A` | Text & primary buttons |
| **Roast Red** | `#FF3B30` | Accent, errors, "Roasted" status |
| **Glow Green** | `#34C759` | Success, high scores |
| **Soft Grey** | `#F2F2F7` | Card backgrounds (Bento) |
| **Translucent Glass** | `rgba(255,255,255,0.7)` | Overlays with blur |

## 2.2 Typography (Editorial Bold)

- **Headlines**: `Outfit` or `Space Grotesk` (Bold/Black)
- **Body**: `Inter` (Regular/Medium)
- **Monospace (Scores)**: `JetBrains Mono` or `Space Mono`

| Style | Weight | Size | Usage |
|-------|--------|------|-------|
| **Display 1** | Black | 48px | Huge scores, main headlines |
| **Headline 1** | Bold | 24px | Section titles |
| **Body 1** | Regular | 16px | Standard text |
| **Sassy Caption** | Medium | 13px | Small sarcastic remarks |

---

# 3. Component Library

## 3.1 The Bento Dashboard
The dashboard uses a non-uniform grid system where cards expand or contract based on their importance.

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
}

.card-large { grid-column: span 2; }
.card-square { grid-column: span 1; aspect-ratio: 1; }
```

## 3.2 The "Roast-o-meter" (Score Card)
A central component that displays the Glow Score with a dynamic color ring.

- **Excellent (80-100)**: "Okay, you're actually doing it. Keep it up." (Green)
- **Moderate (50-79)**: "Average. Like a participation trophy." (Yellow/Orange)
- **Poor (0-49)**: "We need to talk. Seriously." (Roast Red)

## 3.3 Sassy Toast Notifications
Toasts shouldn't just be informative; they should have personality.

| Type | Message Example |
|------|-----------------|
| **Success** | "Done. Try not to mess it up tonight." |
| **Error** | "Even I couldn't fix that error. Try again." |
| **Warning** | "You're getting close to your scan limit. Pay up?" |

---

# 4. Micro-interactions & Animations (Framer Motion)

## 4.1 "The Shiver" (Bad Data Animation)
If a user's hydration or acne score drops significantly, the card should subtly "shiver" when it enters the viewport.

```typescript
const shiverAnimation = {
  x: [0, -2, 2, -2, 2, 0],
  transition: { duration: 0.4 }
};
```

## 4.2 Score Counter
Scores should quickly "count up" from 0 to the target number with a `backOut` easing.

## 4.3 Image Comparison (Before/After)
A smooth slider interaction with a vertical white line and a handle. The handle should have a "Sass Mode" where it snaps back if you try to hide the "Before" photo for too long.

---

# 5. Visual Language

## 5.1 Corner Radius
- **Main Cards**: 32px (Extra round for a soft premium feel)
- **Buttons**: 16px
- **Inputs**: 12px

## 5.2 Shadows
- Use a single, layered soft shadow for focus:
  `box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02);`

## 5.3 Iconography
- Use **Lucide React** with 1.5px stroke width.
- Icons should be paired with bold text for a balanced look.

---

# 6. Page Layouts (Bento Examples)

## 6.1 Dashboard
- **Top Card (Large)**: Current Glow Score + Trend.
- **Left Middle (Square)**: Last Scan Thumbnail.
- **Right Middle (Square)**: Today's AM/PM status.
- **Bottom Card (Large)**: Daily "Roast" (Insight/Tip).

## 6.2 Routine
- Vertical list of bento cards.
- Each card has a large icon and a status badge (Locked/Unlocked/Done).

---

# 7. Sassy UI Patterns

| Scenario | UI Element | Copy Direction |
|----------|------------|----------------|
| **No Scan Yet** | Empty State | "Is your camera broken or are you shy?" |
| **Subscription Redirect** | Button | "Feed the AI (Upgrade)" |
| **Profile Setup** | Placeholder | "Put a face to the name." |
| **No Internet** | Banner | "Offline. Go look in a real mirror for a bit." |

---

# Document References

| Document | Purpose |
|----------|---------|
| [WORKFLOW.md](./WORKFLOW.md) | User flows & screens |
| [FRONTEND.md](./FRONTEND.md) | Technical implementation |
| [TECHNICAL.md](./TECHNICAL.md) | Architecture |
