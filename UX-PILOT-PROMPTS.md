# UX Pilot Prompts — Live Sales Coach

> Copy-paste these into UX Pilot one at a time. Start with the MASTER PROMPT, then each page.
> After each page, give the HTML output back to Claude Code to convert into React components.

---

## MASTER PROMPT (paste this BEFORE every page prompt)

```
DESIGN SYSTEM — Live Sales Coach App

Brand: "Live Sales Coach" by AIwithDhruv
Tagline: "Your AI co-pilot for every sales call"
Purpose: Real-time AI coaching during live sales calls. Used by salespeople on calls.

DARK THEME (primary):
- Background: #060610 (deep space black)
- Surface level 1: #0d0d1a (card backgrounds)
- Surface level 2: #14142b (elevated cards, modals)
- Surface level 3: #1c1c3a (hover states, active items)
- Border: rgba(99, 102, 241, 0.15) (subtle indigo glow)
- Border active: rgba(99, 102, 241, 0.4) (brighter on hover/active)

ACCENT COLORS:
- Primary: #6366f1 (indigo-500) — buttons, active states, primary actions
- Cyan: #22d3ee (cyan-400) — coaching tips, "say this" suggestions, rep indicators
- Green: #4ade80 (green-400) — positive sentiment, good scores, connected status
- Yellow: #facc15 (yellow-400) — warnings, medium scores, caution
- Red: #f87171 (red-400) — negative sentiment, low scores, objections, end call
- Purple: #a78bfa (violet-400) — practice mode, AI/prospect speech

TEXT:
- Primary text: #e2e8f0 (slate-200)
- Secondary text: #94a3b8 (slate-400)
- Muted text: #475569 (slate-600)
- Headings: #f8fafc (slate-50)

TYPOGRAPHY:
- Font: Inter (sans-serif), fallback system-ui
- Mono numbers/code: JetBrains Mono or monospace
- Section headers: 11px, uppercase, letter-spacing 0.08em, slate-400, font-weight 500
- Body text: 14px
- Large numbers (scores, timers): 28-36px, font-weight 700, monospace

EFFECTS:
- Cards: rounded-2xl (16px radius), border 1px solid rgba(99,102,241,0.15), subtle inner shadow
- Glow effect on active elements: box-shadow 0 0 20px rgba(99,102,241,0.15)
- Active coaching tip: left border 3px cyan + subtle cyan background glow
- Transitions: all 300ms ease, use transform for animations
- Pulse animation on live recording indicator (red dot)
- Gradient accents: linear-gradient(135deg, #6366f1, #8b5cf6) for premium buttons

LAYOUT RULES:
- Max width: 1440px, centered
- Padding: 24px page padding
- Card gap: 20px
- Inner card padding: 24px
- Use CSS Grid for dashboard layout
- Mobile: single column stack
- Desktop: 3-column grid (2:1 ratio — left takes 2 cols, right takes 1)

BRANDING:
- Top-left: app icon (indigo rounded square with mic icon) + "Live Sales Coach" text
- Top-right: "Built by AIwithDhruv" link in muted text
- Bottom status bar: connection status + session info

DO NOT use any emojis. This is a professional B2B SaaS tool.
Use Lucide icons (or similar SVG line icons) for all iconography.
```

---

## PAGE 1: PRE-CALL LANDING SCREEN

```
Using the design system above, create a landing/start screen for "Live Sales Coach".

This is what the user sees BEFORE starting a call. It should feel premium, confident, and ready-to-go — like a mission control preparing for launch.

LAYOUT (full viewport height, centered content):

TOP BAR (sticky, 64px height):
- Left: App icon (indigo rounded-xl square, 36px, with a headset/mic SVG icon inside) + "Live Sales Coach" in 18px font-weight 600 + "Powered by Gemini Live API" in 11px muted text below
- Right: "Built by AIwithDhruv" as a subtle link

HERO SECTION (centered vertically in remaining space):
- Large heading: "Your AI Sales Coach" in 32px, font-weight 700, with a subtle gradient text (indigo to violet)
- Subheading: "Real-time coaching, objection detection, and performance scoring — powered by Gemini" in 16px slate-400, max-width 520px, centered
- 32px gap below

TWO MODE CARDS (side by side, each ~340px wide, 240px tall):

Card 1 — "Live Coach" mode:
- Icon: headset icon in a green circle (48px)
- Title: "Live Coaching" in 18px white font-weight 600
- Description: "Get real-time coaching during an actual sales call. Silent dashboard overlay — your prospect won't hear a thing." in 14px slate-400
- Visual indicator: green pulsing dot + "Ready" text
- Button: "Start Live Session" — full width, green-600 background, white text, rounded-xl, 48px height, hover glow effect
- Subtle green border glow on hover

Card 2 — "Practice" mode:
- Icon: users/roleplay icon in a purple circle (48px)
- Title: "Practice Mode" in 18px white font-weight 600
- Description: "Role-play with an AI buyer persona. Get scored in real-time. Practice objection handling with voice." in 14px slate-400
- Persona selector dropdown below description: styled dark select with border, showing "Sarah Chen (Easy)" as default, with options for 4 personas
- Button: "Start Practice" — full width, purple-600 background, white text, rounded-xl, 48px height
- Subtle purple border glow on hover

Both cards: surface-level-2 background, 1px border with glow, rounded-2xl, 24px padding, transition on hover (slight scale 1.02 + border brighten)

PERSONA DETAILS (appears below when Practice card is selected/hovered):
- Small card showing selected persona info:
  - Avatar placeholder (colored circle with initials)
  - Name: "Sarah Chen"
  - Title: "CEO & Co-founder at TechFlow Startup"
  - Difficulty badge: "Easy" in green, "Medium" in yellow, "Hard" in red — small pill shape
  - Industry: "SaaS / Technology"
  - Common objections: 2-3 short example lines in italic muted text

BOTTOM BAR (fixed, 48px):
- Left: connection status dot (gray = ready, green = connected) + "Server Status: Ready"
- Center: "Gemini Live API" badge with subtle indigo background
- Right: version "v0.1.0"

IMPORTANT:
- The entire page should feel like a premium SaaS app dashboard — NOT a generic landing page
- No marketing fluff, no illustrations, no stock photos
- Clean, data-driven, professional aesthetic
- Dark, minimal, with accent glows creating depth
- Should look impressive in a 4-minute hackathon demo video
```

---

## PAGE 2: ACTIVE CALL DASHBOARD (Live Coaching Mode)

```
Using the design system above, create the main dashboard for an ACTIVE live coaching session.

This is the primary view during a sales call. Information density is critical — the salesperson needs to see coaching tips, scores, objections, transcript, and metrics ALL AT ONCE without scrolling. Think Bloomberg Terminal meets sales coaching.

LAYOUT: 3-column grid on desktop (fr fr 380px). Full viewport height minus header.

TOP BAR (sticky, 56px):
- Left: App icon + "Live Sales Coach"
- Center: LIVE indicator — red pulsing dot + "LIVE COACHING" text in red-400, uppercase, letter-spacing 0.1em + call duration timer "02:45" in monospace white
- Right: "End Call" button (red-600, rounded-lg, with phone-off icon)

COLUMN 1 (left, wide — takes 1fr):

Panel A — "COACHING TIPS" (top, takes ~45% of column height):
- Section header: "COACHING TIPS" in uppercase muted text + small brain/lightbulb icon
- Latest tip is HIGHLIGHTED: surface-level-3 background, left border 3px solid cyan-400, subtle cyan glow, slightly larger text (15px), with a small "NEW" badge in cyan
- Previous tips stack below in regular style (14px, surface-level-1 background, left border 1px slate-700)
- Each tip is actionable text like: "Try asking: 'What's your biggest pain point with your current solution?'"
- Tips prefixed with small colored icons: 💡 (say this) vs ⚠️ (warning) — use actual SVG icons not emoji
- Scrollable area with max-height, fade gradient at bottom edge

Panel B — "LIVE TRANSCRIPT" (bottom, takes ~55% of column height):
- Section header: "LIVE TRANSCRIPT" + mic icon
- Chat-bubble style layout:
  - REP messages: right-aligned, cyan left-border, slightly brighter background, "You" label in cyan-400
  - PROSPECT messages: left-aligned, purple left-border, dimmer background, "Prospect" label in purple-400
- Auto-scrolls to bottom
- Fade gradient at top edge
- Each message has a tiny timestamp on the right (HH:MM:SS format, muted text)
- Empty state: subtle waveform animation placeholder + "Listening..."

COLUMN 2 (middle — takes 1fr):

Panel C — "OBJECTIONS DETECTED" (top, ~40%):
- Section header: "OBJECTIONS" + shield/alert icon + count badge (e.g., "3" in red pill)
- Objection type pills at top: colored badges showing types detected (e.g., "Price (2)" in red, "Trust (1)" in yellow) — horizontal wrap layout
- Below: most recent objection expanded:
  - Prospect said: quoted text in italic slate-300
  - Suggested response: in cyan text, boxed with dashed cyan border, with a small "copy" icon button
  - Objection type label + category framework name (e.g., "Sandler Method")
- Older objections collapsed below (click to expand)

Panel D — "KEY MOMENTS" (bottom, ~60%):
- Section header: "KEY MOMENTS" + timeline icon
- Vertical timeline layout with connecting line (thin, slate-700)
- Each moment is a dot + text:
  - Green dot = positive moment ("Prospect asked about pricing — buying signal")
  - Yellow dot = warning ("You've been talking for 45 seconds straight")
  - Red dot = objection ("Price objection raised")
- Dots are 10px, connected by thin vertical line
- Timestamp next to each (relative: "1:23 ago" or absolute "02:15")
- Most recent at top

COLUMN 3 (right sidebar — fixed 380px):

Panel E — "CALL CONTROLS" (top, compact):
- Mode badge: "LIVE COACHING" in green with signal icon
- Mic status: green dot + "Mic Active" or red dot + "Mic Muted"
- Screen share toggle button: "Share Screen" / "Sharing..." with monitor icon
- End Call button: full width, red-600, large (48px height), "End Call" with phone-off icon

Panel F — "CALL VITALS" (below controls):
- 3 metric boxes in a row:
  - Sentiment: large icon (😊→😐→😠 but use colored circles, NOT emoji) + label "Positive"/"Neutral"/"Negative" with matching color
  - Duration: "04:32" in large monospace
  - Talk ratio: "62% / 38%" — your time vs prospect time
- Talk ratio progress bar below: dual-color horizontal bar (cyan for you, purple for prospect)
- Warning text if rep > 65%: "You're talking too much — ask a question!" in red-400
- The sentiment indicator should feel like a traffic light — unmistakable at a glance

Panel G — "PERFORMANCE SCORES" (bottom of sidebar):
- Overall score: large circle with number inside (like a speedometer), colored by score level (green 70+, yellow 40-69, red <40)
- 4 individual score bars below:
  - Discovery (0-100): horizontal progress bar with label + score number
  - Rapport (0-100): same
  - Objection Handling (0-100): same
  - Next Steps (0-100): same
- Bars are colored: green if ≥70, yellow if ≥40, red if <40
- Each bar has smooth transition animation
- Overall average shown as the big number

IMPORTANT DESIGN DETAILS:
- Every panel must have subtle depth — don't just put flat cards next to each other
- Use subtle inner shadows and border glows to create visual hierarchy
- The coaching tip panel should DRAW THE EYE first (most important during a call)
- The whole dashboard should feel like you're looking at a high-tech mission control
- Information should be scannable in <2 seconds — the salesperson is MULTITASKING
- All numbers in monospace font
- No empty/wasted space — this is a dense data dashboard
- Use scrollable areas with max-heights to prevent layout overflow
- This is a 1440px+ desktop app — do NOT optimize for mobile here
```

---

## PAGE 3: ACTIVE CALL DASHBOARD (Practice Mode)

```
Using the design system above, create the practice mode dashboard variant.

Same layout as the Live Coaching dashboard but with these differences:

TOP BAR changes:
- Center indicator changes to: purple pulsing dot + "PRACTICE MODE" in purple-400 + duration timer
- Small persona badge next to it: "vs Sarah Chen (Easy)" with avatar circle

COLUMN 1 changes:

Panel A — "AI COACH WHISPERS" (instead of Coaching Tips):
- Same layout but header says "AI COACH WHISPERS"
- Tips have a small speaker/headphone icon indicating these are SPOKEN to the user
- Visual: subtle pulse/wave animation on the latest tip (indicating it was whispered via audio)

Panel B — Transcript changes:
- REP label: "You" in cyan
- PROSPECT label: Shows persona name "Sarah Chen" in purple with small avatar circle
- Prospect messages have slightly different style to emphasize this is an AI persona speaking

COLUMN 2 changes:
- Same objection tracker and key moments — no changes needed

COLUMN 3 changes:

Panel E — Controls changes:
- Mode badge: "PRACTICE MODE" in purple with theater/masks icon
- New element: "Current Persona" card showing:
  - Small avatar circle with initials (colored by difficulty)
  - Name: "Sarah Chen"
  - Title: "CEO, TechFlow Startup"
  - Difficulty badge: "Easy" pill in green
  - "Switch Persona" text button below
- Audio output indicator: "AI Voice Active" with speaker icon + volume wave animation

Everything else (scores, vitals, key moments) stays the same.

The overall feel should be: "training simulator" — like a flight simulator but for sales calls. Purple accent instead of green to distinguish from live mode.
```

---

## PAGE 4: POST-CALL REPORT

```
Using the design system above, create the post-call analysis report page.

This appears after a call ends. It's the "results screen" — like getting your score after a game. Should feel rewarding and data-rich.

LAYOUT: centered content, max-width 960px, scrollable page

TOP BAR: same as before but center shows "CALL COMPLETE" in white + checkmark icon

HERO SECTION (top of page):
- Large overall score in a circular gauge/ring (120px diameter):
  - The ring is an SVG circle that fills based on score (0-100)
  - Color: green if ≥70, yellow if 40-69, red if <40
  - Score number in center: large monospace "73"
  - Label below: "Overall Performance"
- Call metadata row below: Duration "04:32" | Mode "Live Coaching" | Date "Feb 23, 2026"

SECTION 1 — "CALL SUMMARY" (card):
- AI-generated 2-3 sentence summary of the call
- Outcome badge: "Meeting Booked" (green), "Follow-up Needed" (yellow), "No Interest" (red), "Needs Info" (blue)
- Next steps: bulleted list of 3-4 action items

SECTION 2 — "SCORE BREAKDOWN" (card, 2x2 grid):
- 4 metric cards in a 2x2 grid:
  - Discovery Score: circular mini-gauge (60px) + score + one-line feedback
  - Rapport Score: same
  - Objection Handling: same
  - Next Steps: same
- Each has a brief AI-generated comment: "Good probing questions but missed 2 pain points"

SECTION 3 — "TALK TIME ANALYSIS" (card):
- Large horizontal bar showing rep vs prospect ratio
- "You: 58% | Prospect: 42%" labels
- Ideal range indicator (35-45% for rep is ideal)
- Verdict: "Good balance" or "You dominated the conversation" etc.

SECTION 4 — "OBJECTIONS FACED" (card):
- Table/list of all objections raised:
  - Type | What they said | How you responded | Coach's suggestion | Score (handled well?)
- Each row color-coded: green = handled well, red = missed opportunity

SECTION 5 — "KEY MOMENTS TIMELINE" (card):
- Horizontal timeline visualization showing the entire call
- Dots placed at timestamps where key moments happened
- Green/yellow/red dots with hover-to-see-details
- This creates a visual narrative of how the call flowed

SECTION 6 — "RECOMMENDATIONS" (card):
- 3-5 bullet points of what to improve next time
- Each with an icon: target (focus area), book (read this), practice (try this drill)

BOTTOM ACTIONS:
- "Start New Call" button (indigo, primary)
- "Download Report" button (outline style)
- "Share Results" button (outline style)

IMPORTANT:
- This page should feel REWARDING — like getting results after a test
- The circular score gauge at top should be the hero element
- Dense with data but well-organized — not overwhelming
- Professional enough that a sales manager could review this
- Should screenshot beautifully for the hackathon demo video
```

---

## USAGE INSTRUCTIONS

1. Paste the **MASTER PROMPT** first into UX Pilot
2. Then paste each **PAGE PROMPT** one at a time
3. UX Pilot will generate HTML/CSS for each page
4. Give the HTML back to Claude Code
5. Claude Code will convert it into React + Tailwind components that match our existing hooks and state management

### Component Mapping (what Claude Code needs to wire up):

| UX Pilot Section | React Component | Data Source |
|-----------------|-----------------|-------------|
| Coaching Tips panel | `CoachingPanel.tsx` | `state.coachingTips` |
| Live Transcript | `TranscriptPanel.tsx` | `state.transcript` |
| Objection Tracker | `ObjectionTracker.tsx` | `state.objections` |
| Key Moments | `KeyMoments.tsx` | `state.keyMoments` |
| Call Controls | `CallControls.tsx` | `isConnected, isRecording, isSharing` |
| Call Vitals | `SentimentGauge.tsx` | `state.sentiment, state.talkRatio, state.callDuration` |
| Performance Scores | `ScoreCard.tsx` | `state.scores` |
| Post-Call Report | NEW `PostCallReport.tsx` | `state` (full dashboard state) |
| Pre-Call Landing | NEW `LandingScreen.tsx` | mode selection + persona picker |
