---
name: Passline
description: AI front desk for restaurants (portfolio demo). A calm assistant that shows its steps and opens its sources.
colors:
  background: "#F7F8F9"
  card: "#FFFFFF"
  sidebar: "#F0F2F4"
  foreground: "#16191D"
  muted-foreground: "#5A626B"
  faint: "#9AA1A9"
  border: "#E2E5E8"
  primary: "#0F6E66"
  primary-foreground: "#FFFFFF"
  primary-soft: "#E2F0EE"
  success: "#1D9A60"
  warning: "#8F5208"
  warning-dot: "#D48A22"
  warning-soft: "#FBF0E0"
  highlight: "#FFE8A3"
  highlight-foreground: "#2A2000"
  background-dark: "#111315"
  card-dark: "#181B1E"
  sidebar-dark: "#15181B"
  foreground-dark: "#E7EAED"
  muted-foreground-dark: "#A2AAB2"
  faint-dark: "#6F7780"
  border-dark: "#2A2F34"
  primary-dark: "#4FC1B4"
  primary-foreground-dark: "#06201D"
  primary-soft-dark: "#163330"
  success-dark: "#3CC384"
  warning-dark: "#E5A54B"
  warning-dot-dark: "#E5A54B"
  warning-soft-dark: "#33261A"
  highlight-dark: "#5C4A12"
  highlight-foreground-dark: "#FFF2CC"
typography:
  display:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(30px, 4.6vw, 44px)"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    letterSpacing: "-0.015em"
  title-sm:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  body:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-answer:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  small:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  caption:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  mono:
    fontFamily: "Geist Mono, ui-monospace, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    fontFeature: "\"tnum\" 1"
  citation:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
rounded:
  mark: "3px"
  ref: "5px"
  md: "8px"
  button: "9px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  full: "999px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  step: "14px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "7px 13px"
  button-primary-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "7px 13px"
  button-disabled:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.button}"
  button-toolbar:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "6px 11px"
  button-icon:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    size: "32px"
  composer-send:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    size: "36px"
  composer-send-stop:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.lg}"
    size: "36px"
  composer-send-disabled:
    backgroundColor: "{colors.border}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    size: "36px"
  composer:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-answer}"
    rounded: "{rounded.2xl}"
    padding: "8px 8px 8px 14px"
  model-switcher:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
    padding: "5px 8px"
  model-menu:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "6px"
  suggestion-pill:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.full}"
    padding: "4px 11px"
  source-chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  citation-ref:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.citation}"
    rounded: "{rounded.ref}"
    padding: "2px 5px"
  citation-ref-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
  message-user:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    padding: "10px 14px"
  assistant-mark:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    size: "28px"
  step-timeline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.xl}"
    padding: "9px 12px"
  staff-notice:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "12px 14px"
  source-page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    padding: "20px"
  passage-highlight:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.highlight-foreground}"
    rounded: "{rounded.mark}"
    padding: "1px 2px"
  sidebar-item:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  sidebar-item-active:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  tab:
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  tab-active:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  starter-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "12px 14px"
---

# Design System: Passline

## Overview

**Creative North Star: "The Glass Pass"**

Passline is a working AI assistant, not a brochure about one. The kitchen pass is where finished work is handed over in full view; this system does the same with an answer. The visitor sees the question go in, watches each step of the work run on a vertical timeline, reads the answer as it streams, and can open the exact page it came from beside the chat. Everything else stays quiet so that trail is the loudest thing on screen.

The world is a neutral, near-white workspace (mirrored in a near-black dark theme) with one teal accent for anything you can act on, and a small set of status dots that carry all the meaning colour is allowed to carry. Density is comfortable-compact: 15px body, 13 to 14px secondary text, hairline borders instead of boxes on boxes, and generous gaps between turns of the conversation. It reads as a familiar assistant layout (sidebar, conversation, composer at the bottom, source panel to the right) but under its own brand: the Passline name and its pass-line mark, never Claude or Anthropic marks, colours or wording.

It rejects dashboard chrome (metric tiles, charts, KPI headers) and decorative theming. Depth comes from tone and borders; motion is limited to state: a running ring, a blinking caret, a chevron turning, drawers sliding.

**Key Characteristics:**
- Three-column assistant shell: 252px sidebar, centred conversation at a 760px measure, 420px source panel that opens beside it.
- A per-answer step timeline whose dots are the only colour language.
- One teal accent for actions, citations and live state.
- Geist for everything; Geist Mono only for match scores and code paths.
- Light and dark themes defined token for token.
- Streaming answer with a teal caret, and a Stop control in the send button's place.

## Colors

A cool grey neutral ground with one deep teal and three status hues that never leave their job.

The token names follow shadcn/ui's CSS variable vocabulary so they drop into `globals.css` as `--background`, `--card`, `--sidebar`, `--foreground`, `--muted-foreground`, `--border`, `--primary`, `--primary-foreground`, plus project additions `--faint`, `--primary-soft`, `--success`, `--warning`, `--warning-soft`, `--highlight`, `--highlight-foreground`. Each `-dark` key is the value of the same variable under `.dark` / `[data-theme="dark"]`; the dark theme also follows `prefers-color-scheme` unless the user pinned light.

### Primary
- **Pass Teal** (`primary`; `primary-dark` in dark): the only accent. Primary buttons, the send button, the brand mark tile, citation numbers, the selected source chip border, the focus ring, the text caret, the streaming caret, the running step's ring, and code paths in the How it works panel. In dark mode it lifts to a bright aqua so it stays legible on near-black, and its foreground flips to a deep teal-black (`primary-foreground-dark`).
- **Teal Wash** (`primary-soft`): the quiet form of the accent. Background of citation refs, the assistant avatar tile and text selection.

### Status (step timeline only)
- **Passed Green** (`success`): a step that passed. Nothing else.
- **Staff Amber dot** (`warning-dot`): the dot for a step that needs staff, the "staff" promise on About, and the daily-budget bar in the model menu.
- **Staff Amber text** (`warning`): the staff-confirmation notice's icon and title, and the "1 per day" tag on the paid model. It is darker than the dot so text clears 4.5:1 on Amber Wash; the two are split so the dot stays recognisably amber.
- **Amber Wash** (`warning-soft`): the staff-confirmation notice background. It is the only tinted container in the system.
- **Stopped Grey** (`faint`): a step that stopped or is pending. Also doubles as the hover border colour across controls.

### Neutral
- **Desk Ground** (`background`): the conversation and topbar ground, and the inner page of the source viewer.
- **Paper** (`card`): raised surfaces: the source panel, timeline cards, composer box, buttons, chips, active sidebar row.
- **Rail Grey** (`sidebar`): the sidebar and the user's message bubble, so the visitor's own words sit in the same tone as their navigation.
- **Ink** (`foreground`): primary text; also the Stop button fill.
- **Slate** (`muted-foreground`): secondary text, step descriptions, captions, placeholders.
- **Hairline** (`border`): every border and divider, the timeline spine and the disabled send fill.

### Highlight
- **Marker Yellow** (`highlight` on `highlight-foreground`): only the exact sentence in the source page that the answer was built from.

### Named Rules
**The Dot Language Rule.** Green, amber and grey mean step state and nothing else: green passed, amber staff needed, grey stopped, hollow grey ring skipped or not yet released, teal ring running. Any list that reuses the dot must keep those meanings.

**The One Teal Rule.** Teal marks what you can act on or what is live: buttons, citations, focus, caret, running ring. No second accent, and no teal on decoration.

**The Highlighter Rule.** Marker Yellow appears only on the passage an answer used. One highlight per page view.

## Typography

**Display Font:** Geist (with Segoe UI, system-ui, sans-serif)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace, Consolas, monospace)

**Character:** One workhorse grotesk carries the whole interface, with tight negative tracking on headings for a product, not editorial, voice. Mono is a measuring instrument, not a style.

In Next.js load both through the `geist` package (`GeistSans`, `GeistMono`) and expose them as `--font-sans` and `--font-mono`.

### Hierarchy
- **Display** (650, clamp(30px, 4.6vw, 44px), 1.08, -0.03em): the About page headline only.
- **Headline** (600, 26px): empty-state heading.
- **Title** (600, 17px): About section headings and the lead paragraph size (lead at 400 in Slate, max 58ch). The brand name uses 17px at 700 with -0.02em.
- **Title Small** (600, 15px): topbar title, source panel title, source page title.
- **Body** (400, 15px, 1.6): base text and user messages.
- **Body Answer** (400, 15.5px, 1.65): assistant answers and the composer input, a half step larger so the answer is the most readable text on screen.
- **Label** (500, 14px): sidebar rows, step titles, starter titles (600).
- **Small** (400, 13 to 13.5px): step descriptions, chips, pills, buttons (600 at 13.5px), panel notes.
- **Caption** (400 to 600, 12px): subtitles, sidebar group label, fine print, run facts. Sentence case, never uppercase.
- **Mono** (400, 12px, tabular figures): match scores and file paths only.
- **Citation** (600, 11px, line-height 1): the numbered ref inside answer text.

### Named Rules
**The Mono-for-Measurements Rule.** Geist Mono appears only on match scores and code paths. Labels, captions and numbers in prose stay in Geist.

**The Sentence Case Rule.** Every label, heading and group header is sentence case. There are no uppercase eyebrows or kickers above headings.

## Layout

The shell is a three-column grid: sidebar (252px) | conversation (fluid) | source panel (420px, 360px under 1180px), each separated by a Hairline rule. In Tailwind terms: `grid-cols-[252px_minmax(0,1fr)_auto]`.

The conversation column stacks a topbar (12px 20px padding, Hairline bottom rule), a scrolling thread, and a composer pinned at the bottom. The thread and composer share a centred 760px measure with 24px side padding; turns are 28px apart. User messages sit right-aligned at up to 80% width; assistant turns use a 28px avatar column with a 12px gap. The composer sits on solid Desk Ground with a Hairline top rule, so content scrolling behind it never shows through. The app shell is exactly one viewport tall (`grid-template-rows: minmax(0, 1fr)` with `min-height: 0` on each column); only the thread, sidebar and source panel scroll.

Spacing rhythm is 4/8/12/14/16/20/24/28, with 14px as the inner step of timelines, notices and starter cards, and 48px as the About page's top padding.

Responsive behaviour:
- **Under 980px:** one column. The sidebar becomes a 280px off-canvas drawer over a 40% black scrim; the source panel becomes a full-screen sheet with a close button and Escape to dismiss; a 36px menu button appears in the topbar; toolbar buttons drop their text labels; side padding respects safe-area insets (16px floor, 12px for the composer).
- **Under 560px:** the assistant avatar hides, starter cards go to one column, the two suggestion groups stack (each still one row that scrolls sideways), the first answer's timeline starts collapsed so the answer shows on the first screen, user bubbles widen to 90%, and the composer placeholder shortens.

The source panel opens automatically beside the first answer on desktop; on small screens it waits to be asked.

## Elevation & Depth

Flat by default. Surfaces separate by tone (Desk Ground, Rail Grey, Paper) and Hairline borders. There is one shadow token, and it marks the composer as the place you act.

### Shadow Vocabulary
- **Composer lift** (`box-shadow: 0 1px 2px rgba(22, 25, 29, .06), 0 8px 24px -12px rgba(22, 25, 29, .18)`; dark: `0 1px 2px rgba(0,0,0,.3), 0 8px 24px -12px rgba(0,0,0,.6)`): the composer box at rest, and starter cards on hover.
- **Active row hairline** (`box-shadow: 0 1px 2px rgba(22,25,29,.06)`): the current sidebar nav row.
- **Dot halo** (`box-shadow: 0 0 0 3px <card>`): a 3px ring in the card colour around each timeline dot so it cuts through the spine line. Structural, not elevation.

### Named Rules
**The One Lift Rule.** Only the composer floats at rest. Everything else is a bordered or tonal plane; hover may borrow the composer lift for starter cards and nothing else.

## Shapes

Soft rounded rectangles throughout, scaled to the element: 3px on the passage highlight, 5px on citation refs, 8px on rows, chips, tabs, icon buttons and the brand tile, 9px on text buttons, 10px on the send button, new-conversation button and source page, 12px on timeline cards, notices and starter cards, 16px on the composer box. Pills are fully rounded.

The user message bubble is the one asymmetric shape: 16px corners with the bottom-right tucked to 4px, pointing toward the speaker. Status dots are 11px circles on the timeline and 6px in the collapsed summary; the cited-document marker is a small neutral "cited" text pill, not a dot. Borders are always 1px Hairline; the only dashed border is the "Break it" pill.

## Components

All map to shadcn/ui primitives; restyle the primitive rather than building a parallel one.

### Buttons
Quiet, compact and confident; the teal fill is reserved for the one action that matters in a block.
- **Shape:** gently rounded (9px).
- **Primary** (shadcn `Button` default): Pass Teal fill and border, white text, 13.5px semibold, 7px 13px padding; the About page uses a larger 10px 16px, 14.5px size.
- **Hover / Focus:** primary brightens slightly (`filter: brightness(1.08)`); every control shows a 2px teal outline at 2px offset on keyboard focus.
- **Outline** (shadcn `outline`): Paper fill, Ink text, Hairline border that darkens to Stopped Grey on hover. Used for "Ask staff" outside a safety notice and secondary About actions.
- **Toolbar** (shadcn `outline`, size `sm`): 13px text, 8px radius, 6px 11px padding, leading 16px icon (Source panel toggle).
- **Icon** (shadcn `outline`, size `icon`): 32px square, 8px radius; disabled at 40% opacity (pager, close).
- **Disabled:** Paper fill, Slate text, Hairline border; a recorded handoff swaps its label to "Handoff recorded".

### Send / Stop
The composer's single action changes role with state: a 36px, 10px-radius teal square with an up-arrow; Hairline fill with Slate arrow while the input is empty; an Ink square with a filled stop glyph while an answer runs. Enter sends, Shift+Enter breaks a line.

### Chips
- **Suggestion pill** (shadcn `Badge` as button): fully rounded, Paper, Hairline border, 13px, 4px 11px. Two groups, each a caption ("Try", "Break it") followed by its pills on one non-wrapping row that scrolls sideways, so a label never separates from its pills; failure probes use a dashed border.
- **Source chip:** 8px radius, Paper, Hairline border, 6px 10px; a teal semibold number, a 16px document icon, then "Document · p.N". Hover or the currently open source turns the border teal.
- **Citation ref:** an 11px semibold number on Teal Wash, 5px radius, raised 2px into the line and glued to the preceding word; hover fills it teal. Clicking opens that page in the source panel.

### Cards / Containers
- **Corner Style:** 12px for timeline cards, notices and starter cards; 10px for the source page.
- **Background:** Paper on Desk Ground; the source page inverts to Desk Ground inside the Paper panel.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** 1px Hairline; the staff notice has no border, only Amber Wash.
- **Internal Padding:** 12px to 14px; 20px for the source page.

### Inputs / Fields
- **Style:** the composer (shadcn `Textarea` in a form box): Paper, Hairline border, 16px radius, Composer lift, 8px 8px 8px 14px padding. The textarea sits on top (borderless, 15.5px, grows to 160px, Slate placeholder, teal caret); below it a bar holds the model switcher on the left and Send/Stop on the right.
- **Focus:** via `:focus-within` the border turns teal and a 3px Teal Wash ring appears around the box (0.2s).

### Navigation
- **Sidebar** (shadcn `Sidebar`): Rail Grey, 16px 14px padding, 18px between groups. Brand row (28px teal tile with the pass-line mark, 17px bold name, 12px subtitle), a full-width outline "New conversation" button (10px radius), nav rows, a "Documents on file" group, and a footer above a Hairline rule.
- **Rows:** 14px Ink with a 16px line icon, 8px 10px padding, 8px radius; hover and active fill with Paper; active adds weight 600 and the hairline shadow. Document rows end with a neutral "cited" pill (11px Slate text, Hairline border, full radius) once cited in the conversation.
- **Tabs** (shadcn `Tabs`, How it works panel): text tabs at 13.5px Slate; the selected tab fills Rail Grey with Ink semibold text.
- **Mobile:** sidebar slides in as a drawer (shadcn `Sheet`, side left) at 0.3s on the shared ease.

### Step Timeline (signature)
The answer's audit trail and the system's only colour language (shadcn `Collapsible`).
- **Summary row:** a 12px-radius Paper card with a Hairline border. The header shows the step dots in miniature (6px), a semibold outcome ("Found it in Booking policy", "Allergy topic · staff must confirm", "Working · step 2 of 4", "Stopped") and the model that answered as plain Slate text ("· Gemini Flash-Lite", or "· no model needed"; no dot, so it never reads as a fifth step state), then a chevron that rotates 90° when open (0.25s).
- **Steps:** an ordered list on a 1px Hairline spine. Each step is an 11px dot with a 3px card-colour halo, a 14px medium title and a 13px Slate description. States: passed (green fill), staff (amber fill), stopped (grey fill, Slate title), skipped (hollow 1.5px grey ring, Slate title), running (hollow 1.5px teal ring that pulses to 4px each second, title ends in an ellipsis).
- **Search results:** under the search step, the top three passages with right-aligned mono scores; the used passage is Ink 500, others Slate; a 12px note says the score is match strength, not the chance the answer is right.
- **Run facts:** a Hairline-topped strip of 12px Slate facts: the model and provider, tokens, and cost ("free tier" for free models). The "Wrote the answer" step names the model too. In the prototype every model line says "Simulated" and tokens and costs are marked as examples. Never claim a model wrote something it didn't.
- **Behaviour:** the newest answer opens expanded and every earlier timeline collapses; while running, steps appear one at a time.

The same dot-and-spine list renders the About page promises and the release roadmap (teal ring = in progress, hollow = not yet released). The How it works pipeline uses neutral hollow dots, because it describes steps rather than reporting passed checks.

### Model Switcher
The composer's left control (shadcn `Popover` with a listbox). The trigger is plain 13px Slate text: model name, then "· free" or "· N left today", then a chevron. It has no colour dot. Hovering or opening fills it Rail Grey.
- **Menu:** a Paper popover above the trigger, 12px radius, Composer lift, up to 320px wide. Each option is a radio-style row: a hollow ring (filled teal when selected), the model name in 13.5px semibold with a small tag ("Free" in Teal Wash, "1 per day" in Amber Wash with amber text), the provider ("Groq · free tier"), and a one-line note.
- **Models:** Gemini Flash-Lite (free, the default), Llama 3.3 70B on Groq (free), Claude Haiku (paid).
- **Limits:**
  - **Claude:** 1 question per visitor per day. After it is used, the option is disabled with "Used today. Free models are still available", the switcher returns to the default free model, and the footnote under the composer says so.
  - **App-wide:** the whole app may spend at most $1 a day. At the cap the paid option reads "Back tomorrow" and the free models keep working.
- **Budget footer:** "Demo spend today: $X of $1.00" with a 4px bar in the amber dot colour, plus one line explaining the cap. Escape or an outside click closes the menu.

### Streaming Answer
Words arrive one at a time with a 7 by 15px teal block caret blinking at 1s; citations and source chips attach only when the answer finishes. Stopping keeps the partial text and appends an italic Slate "Stopped."

### Source Panel
A Paper column with a 12px 16px header (15px semibold document name, 12px Slate "Page 2 of 3 · passage the answer used", 32px close button). The body shows the page as an inset Desk Ground sheet: document title, section headings at 13.5px semibold, paragraphs at 14px Slate, the used paragraph in Ink with its key sentence in Marker Yellow, and a right-aligned page number. Below sit a pager (two icon buttons and "Page N of M") and a 13px Slate note. The same panel hosts How it works with tabs for Steps, Evaluations (a 13px table with Hairline rows) and Code (teal mono paths with Slate descriptions).

### Staff Notice
Shown on safety answers (shadcn `Alert`): Amber Wash, 12px radius, 12px 14px padding, no border; a warning triangle and semibold amber title ("Staff confirmation required"), 13.5px Ink body, then a primary "Ask staff" button with a 13px Slate demo note.

## Do's and Don'ts

### Do:
- **Do** keep the layout sidebar | conversation with the composer at the bottom | source panel beside the chat, and collapse to drawer plus full-screen sheet under 980px.
- **Do** show a step timeline on every assistant answer, using only the five dot states: green passed, amber staff needed, grey stopped, hollow skipped, teal ring running.
- **Do** attach a numbered citation ref and a source chip to every sourced answer, and open the cited page with its passage in Marker Yellow.
- **Do** define every colour as a CSS variable with a light value and a dark value, and switch themes by variable, never by per-component overrides.
- **Do** hold the conversation and composer to the 760px measure.
- **Do** use 1px Hairline borders and tonal steps for structure, and keep the composer lift as the only resting shadow.
- **Do** honour `prefers-reduced-motion` by removing the running pulse, the caret blink and all transitions.

### Don't:
- **Don't** use green, amber or grey for decoration, charts, tags or emphasis; they are step states.
- **Don't** add a second accent colour or use teal on non-interactive decoration.
- **Don't** use Claude or Anthropic branding, marks, colours or wording anywhere in the Passline interface.
- **Don't** add dashboard chrome (metric tiles, KPI headers, charts) or decorative themes to the assistant surfaces.
- **Don't** set labels, body or numbers-in-prose in Geist Mono; mono is for scores and code paths.
- **Don't** put uppercase eyebrows or kickers above headings.
- **Don't** use gradients; the composer sits on solid Desk Ground.
- **Don't** put a colour dot on model names, budgets or tags; dots are step states.
- **Don't** claim a model, a deployment or an eval result exists when it doesn't. The prototype says "Simulated", "(example)", "In progress" and "not run yet".
- **Don't** use hard offset shadows or heavy drop shadows on cards.
