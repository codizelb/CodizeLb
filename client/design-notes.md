# Codize — design refresh notes

## What the first pass got wrong
The original build leaned on generic "AI agency site" defaults: tracked-out
ALL-CAPS eyebrow labels above every heading, a monospace font for tags and
pills, "→" appended to every button, a middle-dot-joined tag line
("Web Development • UI/UX • E-Commerce"), identical rounded cards with the
same soft shadow for services/projects/testimonials, and a decorative dot-grid
background behind the hero and project thumbnails. None of that is wrong on
its own, but stacked together it reads as templated rather than designed for
a code-focused studio.

## Plan
**Color** (kept green, from the logo, but recalibrated so mint is a rare
accent, not the default text color):
- `bg` #0a1712, `surface` #10241b, `surface2` #142e22
- `emerald` #12a97e (primary), `moss` #1f4d3a (support/border), `mint` #7ee8c4 (accent only)
- `text` #e9f5ef, `muted` #7fa895

**Type**: Space Grotesk for display/headings (geometric, a little technical,
not the default Inter-everywhere look) + Inter for body/UI. One scale, tight
tracking on display sizes only.

**Layout**: left-aligned section headers instead of centered; kickers are
sentence case with a small square marker instead of tracked caps. Services
became a bordered list (rows, numbered — it reads better as an inventory than
a card grid) instead of three identical shadowed cards. Testimonials became
quote blocks with a rule instead of avatar-in-gradient-circle cards. Project
thumbnails use a plain duotone diagonal instead of the grid pattern. Process
keeps numbering because it's an actual sequence. Buttons say what they do
("Start a project") with no arrow glyph.

## What's still a deliberate default
The portfolio grid stays a card grid — that's the right pattern for browsable
project thumbnails, not a generic tell. The FAQ accordion and the process
timeline are also kept as-is for the same reason: the content actually is a
sequence / a list of independent Q&As.
