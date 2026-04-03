```markdown
# Design System Document: The Luminous Atelier

## 1. Overview & Creative North Star
**Creative North Star: "The Neon Tailor"**
This design system moves away from the rigid, boxed-in layouts of traditional e-commerce. It treats the interface as a high-end digital showroom—a place where tech-savvy fashion meets cinematic depth. We achieve this through "Organic Layouts" that prioritize breathability, soft-edged glassmorphism, and a luminous cyan energy that guides the user’s eye like a spotlight on a dark stage. 

By leveraging **Plus Jakarta Sans**, we maintain a geometric but approachable tone, while the deep charcoal palette ensures that high-quality apparel mockups are the undisputed protagonists of the experience.

---

## 2. Colors & Surface Philosophy
The palette is built on a foundation of "True Deep" backgrounds to allow the Cyan accents to achieve maximum vibrance.

### The Palette
*   **Background (`#0e0e0e`):** The canvas. Never pure black, but a rich charcoal that feels infinite.
*   **Primary/Accent (`#3ddaff` / `#13c8ec`):** The "Neon Pulse." Used for the most critical actions and brand markers.
*   **Surfaces:** 
    *   `surface-container-low`: `#131313` (Base sections)
    *   `surface-container-highest`: `#262626` (Active cards/Glass panels)

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for layout sectioning. Separation is achieved through **Tonal Transitions**. A section change is marked by moving from `surface` to `surface-container-low`. The UI should feel like a single, continuous fabric rather than a collection of tiles.

### Signature Textures: The Cyan Glow
To provide "visual soul," use a 20% opacity `primary` glow behind key product mockups or CTA buttons. This creates a halo effect that mimics high-end retail lighting.

---

## 3. Typography: Editorial Geometry
**Plus Jakarta Sans** is our voice. It is modern, wide, and clean, perfectly suited for a tech-savvy female demographic.

*   **Display (Editorial Impact):** Use `display-lg` (3.5rem) for hero statements. Apply -2% letter spacing to create a compact, high-fashion look.
*   **Headlines (Navigation & Discovery):** Use `headline-md` (1.75rem) for category titles. 
*   **Body (Utility):** `body-lg` (1rem) for product descriptions. Maintain a line-height of 1.6 to ensure readability against the dark background.
*   **Labels:** `label-md` (0.75rem) in all-caps with 0.05rem tracking for technical specs or small buttons to provide a "tech" aesthetic.

---

## 4. Elevation, Depth & Glassmorphism
We do not use drop shadows to indicate height; we use **Refraction and Light**.

*   **The Layering Principle:** Nested containers must always climb the tier scale. A card (`surface-container-highest`) sits on a section (`surface-container-low`), which sits on the `background`.
*   **Glassmorphism Specs:** For floating navigation or modal overlays, use:
    *   **Background:** `surface-container-highest` at 60% opacity.
    *   **Blur:** 20px - 40px Backdrop Blur.
    *   **The Ghost Border:** A 1px stroke using `outline-variant` (`#484847`) at 15% opacity to catch the "edge" of the light.
*   **Ambient Shadows:** If a shadow is required for a floating CTA, use the `primary` color at 10% opacity with a 40px blur to create a "glow lift" rather than a dark shadow.

---

## 5. Components & UI Elements

### Buttons
*   **Primary:** Solid `primary-container` (`#0cc7eb`) with `on-primary` text. Radius: `full`. Include a soft `primary` outer glow on hover.
*   **Secondary (Glass):** `surface-variant` at 40% opacity with a `primary` ghost border (15% opacity).
*   **Tertiary:** Ghost button using `primary` text and no background.

### Cards & Product Grids
*   **Construction:** Use `md` (1.5rem) or `lg` (2rem) corner radius.
*   **No Dividers:** Prohibit the use of lines between product info and images. Use `spacing-4` (1.4rem) to create clear content grouping.
*   **Interaction:** On hover, the card background should shift from `surface-container-low` to `surface-container-high`.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use a `surface-container-highest` background with a `sm` (0.5rem) radius.
*   **Focus State:** The border transitions from transparent to a 1px `primary_dim` (`#20ccf0`) line with a subtle inner glow.

### Apparel-Specific Components
*   **Fabric Swatch Chips:** Circular (`full`) chips with a 2px `outline` gap between the color and the border to denote selection.
*   **Interactive Mockup Container:** A `xl` (3rem) rounded container with a deep `surface-container-lowest` background to let the apparel colors pop.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place product mockups slightly off-center or overlapping container edges to break the "template" feel.
*   **Embrace the Glow:** Use the Cyan accent as a light source, not just a color.
*   **Prioritize Negative Space:** Use `spacing-12` (4rem) and `spacing-16` (5.5rem) between sections to maintain a premium feel.

### Don’t:
*   **No High-Contrast Borders:** Never use white or 100% opaque cyan borders. It breaks the "glass" illusion.
*   **No Pure Grey Shadows:** Traditional shadows look "dirty" on charcoal backgrounds. Always tint shadows with the background or accent color.
*   **Don't Overcrowd:** If the UI feels busy, increase the corner radius and the padding. Premium is defined by what you leave out.

---

## 7. Spacing & Rhythm
Strict adherence to the spacing scale ensures the "Editorial" look remains disciplined.
*   **Section Padding:** Always use `spacing-16` (5.5rem) or `spacing-20` (7rem).
*   **Content Grouping:** Use `spacing-4` (1.4rem) for related items (e.g., Title and Price).
*   **Component Internal Padding:** Use `spacing-6` (2rem) for card internals to allow the typography to breathe.