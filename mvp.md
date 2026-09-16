# HMO MVP Build Plan

## The Mission

Build a working MVP, one focused step at a time, that proves one thing:

> **A Nigerian can discover an HMO, understand what it offers, see what real members experienced, compare it with another HMO, and leave their own review.**

At the same time:

> **An HMO can claim its profile and respond to members.**

Everything else is secondary.

---

## The Core Rule

**Do not build the company. Build the proof.**

Do not spend effort on:

- Perfect branding
- Native mobile apps
- Complex architecture
- AI features
- Payment infrastructure
- Automated data collection
- Enterprise features
- Complicated recommendation algorithms

If a feature doesn't help the core loop, cut it.

---

## The Premium Bar

Fast does not mean cheap. A slow, feature-complete product and a broken-looking one both fail the same test: nobody trusts it enough to enter their real experience.

The bar is: **it looks like a real, finished product on day one — even though it only does a few things.**

That means, from the first component you build, not as a final pass:

- Every card, button, and spacing value comes from `design.md`'s tokens — not "close enough" approximations picked while coding.
- The brand font loads with no flash of an unstyled font. Set it up once in Step 2, not retrofitted later.
- No visible native browser defaults — unstyled `<select>`, checkboxes, or `alert()`/`confirm()` dialogs. If a form element can't be styled to match, style a custom one.
- Every HMO logo has a designed fallback (initials on a solid tile), never a broken image icon.
- No layout shift when content loads — reserve space, use skeletons, don't let cards jump.
- A favicon and basic page metadata exist before launch — their absence is the fastest tell that something is unfinished.

Step 14 is a consistency **audit** against this bar, not where visual quality starts. If you wait until Step 14 to make things look good, there won't be enough time left to fix a whole app's worth of inconsistency — that's exactly how MVPs end up looking cheap.

---

## Security Baseline

The goal here is narrow: stop spam and injection, without adding friction that makes the product annoying to use. No CAPTCHA walls, no manual identity verification, no security review process — just the handful of checks that are nearly free to build in and close off the obvious abuse paths.

### Injection

This is mostly free if you don't fight the stack:

- Prisma parameterizes every query — never build raw SQL strings from user input.
- Validate every input server-side with the Zod schema, even though the client already validates it. Client-side validation is a UX nicety; it stops nothing on its own.
- Never render review/claim text with `dangerouslySetInnerHTML`. React escapes output by default — leave it that way.

### Spam

The review system is the obvious spam target, so most of the defense is already in the plan by design:

- Reviews require authentication (Step 7) and start `PENDING` until an admin approves them (Step 8) — this alone kills most drive-by spam, since nothing posted publishes itself.
- Add basic rate limiting on review submission, claim submission, and login (a few requests per minute per account/IP is enough) — a small middleware check, not a service to stand up.
- Add a honeypot field to the public claim form (a hidden input real users never fill in, bots often do) — catches basic bots for free, with zero friction for real people.

### Claim fraud

One check, applied where the claim form is already being built: match the submitted work email's domain against the HMO's official website domain before the claim reaches the admin queue. It doesn't block a legitimate rep (their work email already matches), it just stops an obviously mismatched claim from ever needing a human look.

### Access control

Every `ADMIN` and `HMO_ADMIN` action (approve/reject review, edit HMO profile, respond to review) must check the role server-side, on the action itself — not just hide the button in the UI. This is how the roles already in the User model (Step 3) are meant to be used; it's not extra scope, just doing the role check where it actually matters.

**Explicitly not doing for MVP:** CAPTCHA, formal pen testing, encryption-at-rest key management, a WAF. These add friction or infrastructure disproportionate to a product with no real traffic yet — revisit once usage justifies it.

---

## Step 1 — Lock the Product

Before writing code, write down:

### Product

> Compare HMOs. Understand coverage. Hear from members.

### Primary user

A Nigerian looking for an HMO or unhappy with their current one.

### Secondary user

An HMO employee/representative managing their company's profile.

### Core loop

```text
SEARCH
  ↓
HMO PROFILE
  ↓
COMPARE
  ↓
READ REVIEWS
  ↓
CHOOSE
  ↓
LEAVE REVIEW
```

### HMO loop

```text
CLAIM PROFILE
  ↓
VERIFY
  ↓
UPDATE INFORMATION
  ↓
RESPOND TO REVIEWS
```

**Done when:** you can explain the product in 30 seconds.

---

## Step 2 — Project Setup

Pick one stack and do not change it.

Suggested:

```text
Next.js
TypeScript
Tailwind CSS
PostgreSQL
Prisma
NextAuth/Auth.js
Vercel
```

Set up:

```text
/app
/components
/lib
/prisma
```

Create:

- Git repository
- Database
- Environment variables
- Authentication
- Basic layout
- Deployment

Also, before building any page:

- Load the brand font (Plus Jakarta Sans) via `next/font` so it's self-hosted and never flashes an unstyled font.
- Wire `design.md`'s colors, radius, and spacing into the Tailwind theme config as named tokens (e.g. `brand-green`, `ink`, `radius-card`) instead of letting components hardcode hex/px values as they're written.

This is a few minutes of work now and it's what keeps every later page consistent with `design.md` instead of drifting further from it component by component.

Deploy immediately.

Your app should already have a URL, even if it looks terrible.

**Done when:** `/` loads online.

---

## Step 3 — Database

Create only the models you actually need.

### User

```text
id
name
email
role
createdAt
```

Roles:

```text
USER
HMO_ADMIN
ADMIN
```

### HMO

```text
id
name
slug
logo
description
website
phone
email
verificationStatus   (UNVERIFIED | PENDING | VERIFIED)
createdAt
```

### Plan

```text
id
hmoId
name
description
price
```

### Benefit

```text
id
hmoId or planId
name
category
```

Store benefits/tags as rows here, not as a text blob on Plan. The directory, HMO profile, and compare page all render the same benefit tags — a normalized table means they render from one join instead of three separate string-parsing hacks, and comparing two HMOs is a query instead of text matching.

### Review

```text
id
hmoId
userId
rating
title
body
experienceType
customerServiceRating
approvalRating
hospitalRating
medicationRating
status
createdAt
```

### HMO Claim

```text
id
hmoId
userId
status
createdAt
```

### HMO Response

```text
id
reviewId
userId
body
createdAt
```

Don't build 20 tables.

**Done when:** migrations run and you can create/read an HMO.

---

## Step 4 — Seed Real HMOs

Add **10 HMOs manually**.

Do not automate this yet.

Each should have:

- Name
- Logo
- Description
- Website
- Contact information
- Plans
- Benefits
- Basic coverage information

Use real, publicly available information.

Clearly label information that has not been verified by the HMO.

Example:

> **Information last updated: September 2026**

And:

> **Not yet verified by this HMO**

This creates the initial marketplace.

**Done when:** the directory doesn't look empty.

---

## Step 5 — Build the HMO Directory

Build:

```text
/
```

Landing page.

Then:

```text
/hmos
```

Directory.

Features:

- Search
- Basic filtering
- HMO cards showing: name, rating, number of reviews, main benefits, "View HMO" action

Don't build advanced filters.

**Done when:** someone can find an HMO in under 10 seconds.

---

## Step 6 — HMO Profile

This is the **most important page in the entire MVP**.

Route:

```text
/hmos/[slug]
```

Build these sections:

### Header

```text
HMO name
Logo
Rating
Reviews
Verified status
Claim profile
```

### About

Basic HMO information.

### Plans

Show available plans.

### Benefits

Use clear categories.

### Hospitals

For MVP, even a simple list is enough.

### Member Experience

Show:

```text
Overall       3.8/5
Customer      3.4/5
Approval      3.2/5
Hospitals     4.1/5
Medication    3.0/5
```

### Reviews

Show member experiences.

### HMO Responses

Display official responses beneath reviews.

**Done when:** this page feels like the product.

---

## Step 7 — Review System

Build:

```text
/hmos/[slug]/review
```

The user must be authenticated.

Review form:

### Overall experience

⭐ 1–5

### What was your experience about?

- Hospital
- Medication
- Maternity
- Emergency
- Dental
- Optical
- Specialist
- Claims
- Other

### Rate:

- Customer service
- Approval
- Hospital access
- Medication

### Title

> "Approval took too long"

### Experience

> "Tell us what happened."

### Was your issue resolved?

Yes / No / Partially

Submit.

New reviews start as:

```text
PENDING
```

**Done when:** a user can submit a review and it appears in the admin queue.

---

## Step 8 — Admin Moderation

Build the simplest possible admin page:

```text
/admin/reviews
```

Show:

```text
Pending Reviews

Review
HMO
User
Rating
Experience
Date

[Approve] [Reject]
```

Clicking approve:

```text
PENDING → APPROVED
```

Clicking reject:

```text
PENDING → REJECTED
```

That's enough.

Do not build a sophisticated moderation system yet.

**Done when:** you can control what appears publicly.

---

## Step 9 — HMO Claim + Response

Build:

```text
/hmos/[slug]/claim
```

A representative can request ownership.

For the MVP, don't build complicated corporate verification.

Simply collect:

```text
Name
Work email
Role
HMO
Reason for claiming profile
```

Admin can manually approve the claim.

Once approved, the HMO representative gets:

```text
HMO_ADMIN
```

permissions.

They can:

- Edit official profile
- Respond to reviews

**Done when:** an HMO can participate instead of simply being reviewed.

---

## Step 10 — Compare

Allow users to select up to **3 HMOs**.

Route:

```text
/compare
```

Comparison:

|           | HMO A | HMO B |
| --------- | ----- | ----- |
| Rating    | 4.1   | 3.8   |
| Reviews   | 420   | 217   |
| Dental    | ✓     | ✓     |
| Optical   | ✓     | —     |
| Maternity | ✓     | ✓     |
| Emergency | ✓     | ✓     |
| Hospitals | 1,200 | 850   |

Don't create a complicated comparison engine.

Just compare structured fields.

**Done when:** users can make a basic side-by-side decision.

---

## Step 11 — Make Ratings Actually Work

Calculate aggregate ratings from approved reviews.

For example:

```text
Overall rating
=
average(approved review ratings)
```

Category scores:

```text
Customer service
Approval
Hospital access
Medication
```

Only approved reviews count.

Don't manually type ratings once the review system exists.

Also show:

```text
Based on 126 member experiences
```

instead of pretending the rating is an objective truth.

**Done when:** submitting another review changes the aggregate correctly after approval.

---

## Step 12 — HMO Dashboard

Create:

```text
/hmo/dashboard
```

Keep it simple.

### Overview

```text
Your rating

3.8 ⭐

426 experiences

New reviews this month
23
```

### Recent Reviews

Show reviews and:

```text
[Respond]
```

### Profile

```text
[Edit official information]
```

That's it.

Do not build fancy analytics yet.

**Done when:** an HMO representative has a reason to log in.

---

## Step 13 — Trust + Safety Pass

This is extremely important because you're dealing with reputations and potentially sensitive healthcare experiences.

Implement:

### Review guidelines

Tell users:

> Share your experience, not accusations.

Avoid:

> "This company is a scam."

Prefer:

> "My claim was not approved after I submitted the required documents."

### Remove personal information

Don't allow:

- Phone numbers
- Addresses
- Membership numbers
- Medical record numbers
- Other people's personal information

### Add report button

Every review:

```text
Report
```

Reason:

- Spam
- Personal information
- Harassment
- False/inaccurate information
- Other

Reports go to admin.

**Done when:** you have a basic mechanism for handling problematic content.

---

## Step 14 — Product Polish

This is a consistency audit against "The Premium Bar" above, not the first time anything gets styled. If a page fails one of these checks, it means a component was built without the design tokens from Step 2 — fix the component, not just this instance of it.

Audit for:

- Every card/button matches `design.md`'s tokens exactly, no one-off values
- No unstyled native form elements or browser dialogs left in
- Every logo has a fallback treatment, none show a broken-image icon
- Favicon and page metadata are set

Then focus on:

### Mobile

Most users will likely encounter this through mobile.

Check:

- 375px
- 390px
- 430px

### Empty states

Don't show:

> "No data."

Say:

> **No member experiences yet.**
> Be the first to share yours.

### Loading states

Add basic skeletons.

### Errors

Don't expose raw database errors.

**Done when:** you can show the app to someone without apologising for the experience.

---

## Step 15 — Seed Reviews

Your app will feel dead without reviews.

Create a small set of **clearly labelled demo/test reviews** if you don't yet have genuine user submissions.

Do not fabricate reviews and present them as real.

For example:

> **Demo experience**

This allows you to test:

- Ratings
- Categories
- HMO responses
- Comparison
- Review UI

**Done when:** every major HMO page has enough content to demonstrate the experience.

---

## Step 16 — Full User Journey Test

Pretend you are a new user.

Start here:

```text
Landing
 ↓
Search HMO
 ↓
Open profile
 ↓
Read benefits
 ↓
Read reviews
 ↓
Compare
 ↓
Sign up
 ↓
Submit review
 ↓
Admin approves
 ↓
Review appears
 ↓
HMO responds
 ↓
Response appears
```

Do this on:

- Desktop
- Mobile

Fix anything that breaks.

Don't add features.

**Done when:** the entire loop works without manual database manipulation.

---

## Step 17 — Launch

Before launch:

### Must work

- [ ] Landing page
- [ ] HMO directory
- [ ] Search
- [ ] HMO profile
- [ ] Plans
- [ ] Benefits
- [ ] Reviews
- [ ] Ratings
- [ ] Review submission
- [ ] Review moderation
- [ ] HMO claim
- [ ] HMO response
- [ ] Compare
- [ ] Mobile experience
- [ ] Authentication

### Nice-to-have

- [ ] Fancy animations
- [ ] Advanced filters
- [ ] AI summaries
- [ ] Email notifications
- [ ] Analytics
- [ ] Payments
- [ ] SEO perfection

If the nice-to-haves aren't done:

**Ship anyway.**

---

## The MVP Architecture

Keep the architecture boring.

```text
                 ┌──────────────┐
                 │   Next.js    │
                 │   Frontend   │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Server/API   │
                 │    Logic     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ PostgreSQL   │
                 └──────────────┘
```

Authentication:

```text
User
HMO Admin
Admin
```

Hosting:

```text
Vercel
```

Database:

```text
PostgreSQL
```

That's enough for the MVP.

---

## What You Should Actually Vibe-Code

Don't ask the AI:

> "Build me an HMO platform."

Break the work into tiny prompts.

### Prompt 1

> Build the HMO directory page using the existing HMO Prisma model. Don't change the database schema. Use the existing design system.

### Prompt 2

> Build the HMO profile page. Show official information separately from member experiences. Don't invent any data.

### Prompt 3

> Build the review submission form using the existing Review model. Validate all inputs and create reviews with status PENDING.

### Prompt 4

> Build an admin review moderation page. Admins can approve or reject pending reviews.

### Prompt 5

> Add aggregate ratings using only APPROVED reviews.

### Prompt 6

> Add HMO profile claiming and HMO responses.

This keeps you in control of the architecture.

---

## Definition of Done

At the end of the build, open the website and ask:

### Consumer

> "Can I find an HMO?"

Yes.

> "Can I understand what they offer?"

Yes.

> "Can I see what other members experienced?"

Yes.

> "Can I compare two HMOs?"

Yes.

> "Can I share my experience?"

Yes.

### HMO

> "Can I claim my profile?"

Yes.

> "Can I correct my official information?"

Yes.

> "Can I respond to a customer?"

Yes.

### Platform

> "Can I moderate content?"

Yes.

If all three sides work:

**Ship it.**

---

## The First 7 Days After Launch

Do **not** immediately add features.

Instead, find out whether people actually use it.

Talk to:

### 10 consumers

Ask:

- How do you currently choose an HMO?
- What information do you struggle to find?
- Would you trust member reviews?
- What would make you switch HMOs?
- What would you want to compare?

### 5 HMO employees

Ask:

- Would you claim your profile?
- What information would you want to control?
- Would member-experience analytics be useful?
- What would make you trust an independent platform?
- Would you pay for qualified leads?

The answers should determine version 2.

---

## Version 2

Only after the MVP gets usage should you consider:

- HMO analytics
- Sentiment analysis
- Provider/hospital reviews
- Better verification
- HMO lead generation
- HMO subscriptions
- Email notifications
- WhatsApp notifications
- Employer HMO comparison
- Insurance marketplace
- Public HMO rankings

The MVP earns the right to become a business.

---

## The One Metric to Watch

Don't obsess over:

> Number of registered users.

Watch:

> **Number of useful HMO experiences submitted per week.**

Because the product gets more valuable as genuine experiences accumulate.

The flywheel becomes:

```text
More HMOs
     ↓
More consumers
     ↓
More experiences
     ↓
Better HMO information
     ↓
More consumers
     ↓
More HMOs want to claim profiles
     ↓
More data
```

That is the business.

---

## The Build Challenge

Your only job is to get this sentence to be true:

> **"I can send someone this link, tell them to search for their HMO, and they can actually learn something useful."**

If that's true, you've won.

Everything else can be built afterward.
