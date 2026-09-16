# HMO Design System

## 1. Brand Direction

**Personality:** Confident · Clear · Human · Modern · Trustworthy

The product should feel closer to a consumer app than an insurance/healthcare portal.

**Avoid:**
- Clinical blue healthcare aesthetics
- Corporate navy + green combinations
- Excessive gradients
- Excessive glassmorphism
- Tiny text and dense dashboards

**Visual hierarchy:**

Bold typography → strong color → clean cards → subtle depth

---

## 2. Color System

Built around a bold green direction rather than a clinical blue palette.

### Primary — Electric Green
`#00D632`

Use for:
- Primary CTAs
- Selected states
- Important highlights
- Rating/positive experience accents
- Small brand moments

Don't make the entire interface green.

### Dark — Ink
`#101010`

Use for:
- Main headings
- Navigation
- Primary text
- Dark sections
- Footer

### Background — Warm White
`#F7F8F5`

The main canvas. Softer than pure white, and makes the green feel less aggressive.

### Surface — White
`#FFFFFF`

Cards, inputs, modals, etc.

### Secondary Green
`#0B7A3B`

Use for:
- Secondary accents
- Dark green text
- Success-oriented UI where appropriate

### Supporting Green
`#B8F5C8`

Use for:
- Soft backgrounds
- Tags
- Highlight cards
- Selected filters

### Neutral Scale

| Token   | Hex       |
|---------|-----------|
| Ink 900 | `#101010` |
| Ink 700 | `#333333` |
| Ink 500 | `#666666` |
| Ink 400 | `#8A8A8A` |
| Border  | `#E5E7E3` |
| Surface | `#FFFFFF` |
| Canvas  | `#F7F8F5` |

---

## 3. Semantic Colors

Kept separate from the brand colors.

| Status  | Hex       |
|---------|-----------|
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger  | `#DC2626` |
| Info    | `#2563EB` |

**Important:** never communicate status through color alone.

Use `✓ Verified` rather than just a green dot.

---

## 4. Typography

Primary font: **Plus Jakarta Sans**

Gives a consumer-tech feeling without sacrificing readability.

### Type scale

| Role        | Size     | Weight  |
|-------------|----------|---------|
| Hero        | 56–72px  | 700–800 |
| Display     | 44–56px  | 700–800 |
| H1          | 36–44px  | 700     |
| H2          | 28–32px  | 700     |
| H3          | 22–24px  | 700     |
| Card title  | 18–20px  | 600–700 |
| Body        | 16–18px  | 400–500 |
| Small       | 14px     | 500     |
| Label       | 13–14px  | 600     |

Don't go below 14px for meaningful interface information.

### Hero rule

Don't make every heading huge. Reserve big type for moments like:

> Find an HMO you actually understand.

Then let the rest of the interface breathe.

---

## 5. The Signature Gradient

A green brand gradient, used sparingly, as a brand moment — not the entire UI.

```
#00D632 → #7CF5A1
```

**Good:**
- Hero background
- Promotional card
- Empty state
- Special CTA section

**Bad:**
- Every card
- Every button
- Navigation
- Every heading

---

## 6. Glass

Not the whole product — used selectively.

```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.8);
```

Use on:
- Floating navigation
- Hero search
- Floating filters
- Occasionally, promotional cards

For normal content, solid white cards are better — keeps reviews and healthcare information easy to read.

---

## 7. Cards

Cards carry HMOs, plans, benefits, reviews, ratings, hospitals, and coverage information.

### Standard card

| Property | Value                          |
|----------|---------------------------------|
| Background | `#FFFFFF`                     |
| Radius     | 20px                           |
| Padding    | 24px (desktop: 24–32px, mobile: 16–20px) |
| Border     | `#E5E7E3`                      |
| Shadow     | `0 8px 30px rgba(16,16,16,.06)` |

Keep the shadow extremely subtle. Don't make every card float.

---

## 8. Border Radius

One of the product's visual signatures.

| Token  | Value |
|--------|-------|
| Small  | 10px  |
| Medium | 14px  |
| Card   | 20px  |
| Large  | 28px  |
| Pill   | 999px |

Buttons and tags can be pill-shaped. Cards should generally use 20px rather than full pills.

---

## 9. Buttons

### Primary

| Property   | Value     |
|------------|-----------|
| Background | `#00D632` |
| Text       | `#101010` |
| Radius     | 999px     |
| Height     | 48px      |
| Padding    | 0 22px    |
| Weight     | 600       |

Don't use white text on the green button — black text against electric green gives the bold consumer-tech feeling.

**Hover:** background `#00C52E`, `transform: translateY(-1px)`

### Secondary

| Property   | Value     |
|------------|-----------|
| Background | `#FFFFFF` |
| Text       | `#101010` |
| Border     | `#DDE1DC` |

### Destructive

Use red only when the action is genuinely destructive.

---

## 10. Navigation

Avoid the traditional `Logo | Products | About | Services | Contact | Login | Register` layout.

Instead:

```
[ Logo ]

Explore HMOs   Compare   Reviews   For HMOs

                              [Sign in]  [Find an HMO →]
```

Desktop navigation should feel like a consumer product, not an insurance company.

**Mobile:**

```
Logo                         ☰
```

---

## 11. HMO Cards

One of the most important components.

```
┌─────────────────────────────────┐
│  [Logo]                         │
│                                 │
│  HMO Name              ✓ Verified│
│  Health Maintenance Organisation│
│                                 │
│  ★ 4.3    128 member reviews    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Maternity   Dental   Optical   │
│                                 │
│  [View HMO →]                   │
└─────────────────────────────────┘
```

The card should answer immediately:
- Who are they?
- What do they offer?
- What do members say?
- Can I trust the information?

---

## 12. Ratings

Star color: `#FFD75A`

`★★★★★`

Don't make the rating the dominant element. Example:

```
4.3 ★
128 member experiences
```

The breakdown matters more than the single number:

| Category          | Rating |
|-------------------|--------|
| Overall           | 4.3    |
| Coverage          | 4.5    |
| Hospital access   | 4.1    |
| Customer service  | 3.9    |
| Claims experience | 4.2    |

---

## 13. Review Design

Differentiator for the product. Not just:

```
⭐⭐⭐⭐⭐
"Great HMO."
```

Instead, structured member experience:

```
Member experience

★★★★★  4.0

"Getting approval was straightforward..."

Coverage       ★★★★☆
Hospitals      ★★★★☆
Support        ★★★☆☆
Claims         ★★★★☆

Treatment: Maternity
Experience: Resolved

September 2026
Verified experience
```

The experience category is more valuable than generic praise.

---

## 14. Official vs Member Information

Requires a very clear visual distinction.

### Official information

Subtle green indicator: `✓ Official information`

Examples: annual limit, covered hospitals, plan benefits, waiting periods, eligibility.

### Member information

Label: `Member experiences`

Examples: reviews, ratings, claims experiences, customer service experiences.

This prevents the site from presenting someone's review as an established fact.

---

## 15. Tags

Soft backgrounds rather than loud colors.

**Standard (e.g. Maternity, Dental, Optical):**

```css
background: #E8FBEF;
color: #0B7A3B;
```

**International:**

```css
background: #EEF4FF;
color: #2563EB;
```

---

## 16. Search

Search is one of the visual heroes of the product.

```
What are you looking for?

┌───────────────────────────────────────────────────┐
│ 🔍  Search HMOs, plans or hospitals...       [→] │
└───────────────────────────────────────────────────┘
```

Followed by quick filters: `Maternity` `Dental` `International` `Family` `Individual`

---

## 17. Hero Direction

Keep the homepage hero simple.

**Headline:** Find an HMO you actually understand.

**Supporting text:** Compare coverage, explore plans and hear directly from people who use them.

**Search:** Large search box.

**Secondary CTA:** Browse HMOs

Underneath: `50+ HMOs · Member experiences · Official coverage information`

Don't throw ten features at the user.

---

## 18. Spacing

8px system: `8 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

Don't mechanically use every number. Main rhythm should be `16 → 24 → 32 → 48 → 64`. Hero sections can reach 96–128px.

---

## 19. Accessibility

| Requirement              | Minimum              |
|---------------------------|----------------------|
| Normal text contrast       | 4.5:1               |
| Large text contrast        | 3:1                 |
| Touch target                | 44 × 44px          |
| Focus outline               | `2px solid #101010`|

Don't use transparency for important text. Don't put body text over the green gradient — the moment information becomes important, put it on a solid surface.

---

## 20. The Visual Formula

The most important rule for the whole product:

- **70%** warm white / white
- **20%** black / dark neutrals
- **10%** electric green

Not 70% green — the green becomes powerful because it is rare.

Rhythm:

```
Warm white background
        ↓
Huge black headline
        ↓
Electric green search/CTA
        ↓
White HMO cards
        ↓
Tiny green verification accents
        ↓
Black typography
        ↓
Occasional green gradient section
```

This reads as a modern Nigerian consumer-tech product, not a traditional HMO website.
