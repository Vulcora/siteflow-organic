# Siteflow Design System

Detta dokument beskriver designsystemet för Siteflow landing page.

---

## Färgpalett

### Primära färger (Blå)
| Token | Hex | Användning |
|-------|-----|------------|
| `blue-50` | `#eff6ff` | Bakgrunder, badges |
| `blue-100` | `#dbeafe` | Icon boxes, hover states |
| `blue-200` | `#bfdbfe` | Borders |
| `blue-400` | `#60a5fa` | Gradient start |
| `blue-500` | `#3b82f6` | Accent |
| `blue-600` | `#2563eb` | Primary action, links |
| `blue-700` | `#1d4ed8` | Hover states |

### Sekundära färger (Teal)
| Token | Hex | Användning |
|-------|-----|------------|
| `teal-100` | `#ccfbf1` | Badges, icon boxes |
| `teal-300` | `#5eead4` | Gradient end |
| `teal-400` | `#2dd4bf` | Accents |
| `teal-500` | `#14b8a6` | Focus rings |
| `teal-600` | `#0d9488` | Icons |

### Accent färger (Cyan)
| Token | Hex | Användning |
|-------|-----|------------|
| `cyan-300` | `#67e8f9` | Gradient mitt |
| `cyan-400` | `#22d3ee` | Highlights |

### Neutrala färger (Slate)
| Token | Hex | Användning |
|-------|-----|------------|
| `slate-50` | `#f8fafc` | Page background |
| `slate-100` | `#f1f5f9` | Card borders, skeleton |
| `slate-200` | `#e2e8f0` | Input borders |
| `slate-400` | `#94a3b8` | Placeholder text |
| `slate-500` | `#64748b` | Muted text |
| `slate-600` | `#475569` | Body text |
| `slate-800` | `#1e293b` | Button hover |
| `slate-900` | `#0f172a` | Headings, primary buttons, dark bg |

---

## Typografi

### Fonter
```css
/* Body text */
font-family: 'Inter', sans-serif;

/* Headings */
font-family: 'Playfair Display', serif;
```

### Storlekar
| Element | Desktop | Mobile | Klass |
|---------|---------|--------|-------|
| H1 (Hero) | `text-5xl` (48px) | `text-4xl` (36px) | `font-serif` |
| H2 (Section) | `text-5xl` (48px) | `text-4xl` (36px) | `section-title` |
| Subtitle | `text-xl` (20px) | `text-lg` (18px) | `section-subtitle` |
| Body | `text-base` (16px) | `text-base` | - |
| Small | `text-sm` (14px) | - | - |
| Badge | `text-xs` (12px) | - | `tracking-widest uppercase` |

### Text färger
```
Primary:   text-slate-900  (#0f172a)
Secondary: text-slate-600  (#475569)
Muted:     text-slate-500  (#64748b)
Light:     text-slate-400  (#94a3b8)
Link:      text-blue-600   (#2563eb)
```

---

## Spacing

### Container
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Sections
```
py-20 md:py-32  (vertikalt)
```

### Grid gaps
```
gap-6   (cards, small items)
gap-8   (medium spacing)
gap-12  (large sections)
```

---

## Komponenter

### Buttons

#### Primary Button
```html
<button class="btn-primary">
  Text
</button>
```
```css
.btn-primary {
  @apply inline-flex items-center justify-center gap-2
         px-6 py-3 rounded-full font-semibold
         bg-slate-900 text-white
         hover:bg-slate-800
         transition-all duration-300;
}
```

#### Secondary Button
```html
<button class="btn-secondary">
  Text
</button>
```
```css
.btn-secondary {
  @apply inline-flex items-center justify-center gap-2
         px-6 py-3 rounded-full font-semibold
         bg-white text-slate-900
         border border-slate-200
         hover:border-slate-300 hover:shadow-md
         transition-all duration-300;
}
```

#### Gradient Button (CTA)
```html
<button class="btn-gradient">
  Text
</button>
```
```css
.btn-gradient {
  @apply inline-flex items-center justify-center gap-2
         px-6 py-3 rounded-full font-semibold
         bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300
         text-slate-900
         hover:shadow-lg hover:scale-105
         transition-all duration-300;
}
```

---

### Cards

#### Base Card
```html
<div class="card">
  Content
</div>
```
```css
.card {
  @apply bg-white rounded-2xl shadow-sm
         border border-slate-100
         transition-all duration-300;
}
```

#### Hoverable Card
```html
<div class="card card-hover">
  Content
</div>
```
```css
.card-hover {
  @apply hover:shadow-xl hover:-translate-y-1;
}
```

#### Card med padding
```html
<div class="card p-6">
  Content
</div>
```

---

### Badges

#### Primary Badge
```html
<span class="badge-primary">Label</span>
```
```css
.badge-primary {
  @apply inline-block py-1 px-3 rounded-full
         text-xs font-medium tracking-widest uppercase
         bg-blue-50 text-blue-600 border border-blue-100;
}
```

#### Secondary Badge
```html
<span class="badge-secondary">Label</span>
```
```css
.badge-secondary {
  @apply inline-block py-1 px-3 rounded-full
         text-xs font-medium tracking-widest uppercase
         bg-teal-100 text-teal-700 border border-teal-200;
}
```

#### Dark Badge (för mörka bakgrunder)
```html
<span class="badge-dark">Label</span>
```
```css
.badge-dark {
  @apply inline-block py-1 px-3 rounded-full
         text-xs font-medium tracking-widest uppercase
         bg-blue-500/20 text-blue-300 border border-blue-500/20;
}
```

---

### Section Headers

```html
<div class="text-center mb-16">
  <span class="section-badge">Kategori</span>
  <h2 class="section-title">Rubrik här</h2>
  <p class="section-subtitle">
    Beskrivande text som förklarar sektionen.
  </p>
</div>
```
```css
.section-badge {
  @apply text-blue-600 font-bold tracking-wider
         text-sm uppercase mb-3 block;
}

.section-title {
  @apply text-4xl md:text-5xl font-serif text-slate-900 mb-6;
}

.section-subtitle {
  @apply text-lg md:text-xl text-slate-600
         max-w-2xl mx-auto leading-relaxed;
}
```

---

### Icon Boxes

```html
<div class="icon-box-primary">
  <svg>...</svg>
</div>
```
```css
.icon-box {
  @apply w-12 h-12 rounded-2xl flex items-center justify-center;
}

.icon-box-primary {
  @apply icon-box bg-blue-100 text-blue-600;
}

.icon-box-secondary {
  @apply icon-box bg-teal-100 text-teal-600;
}
```

---

### Form Inputs

```html
<input type="text" class="input-field" placeholder="Placeholder..." />
```
```css
.input-field {
  @apply w-full border border-slate-200 rounded-lg
         px-4 py-3 text-slate-800 placeholder-slate-400
         focus:ring-2 focus:ring-teal-500 focus:border-transparent
         transition-all bg-white;
}
```

---

## Effekter

### Glass Panel (Glasmorfism)
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### Text Gradient
```html
<span class="text-gradient">Gradient text</span>
```
```css
.text-gradient {
  background-image: linear-gradient(to right, #0ea5e9, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Animationer

### Scroll-triggered Animations
Lägg till klass på element, trigga `.is-visible` med JavaScript.

```html
<div class="animate-on-scroll">Fade up</div>
<div class="animate-fade-in">Fade in</div>
<div class="animate-slide-left">Slide from left</div>
<div class="animate-slide-right">Slide from right</div>
<div class="animate-scale-in">Scale in</div>
```

| Klass | Effekt | Duration |
|-------|--------|----------|
| `animate-on-scroll` | Fade + translateY(20px) | 0.6s |
| `animate-fade-in` | Opacity only | 0.6s |
| `animate-slide-left` | Fade + translateX(-30px) | 0.6s |
| `animate-slide-right` | Fade + translateX(30px) | 0.6s |
| `animate-scale-in` | Fade + scale(0.95) | 0.5s |

### Stagger Delays
```html
<div class="animate-on-scroll stagger-1">Item 1</div>
<div class="animate-on-scroll stagger-2">Item 2</div>
<div class="animate-on-scroll stagger-3">Item 3</div>
<div class="animate-on-scroll stagger-4">Item 4</div>
```
```css
.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
```

### Page Transitions
```css
.page-fade-in {
  animation: pageFadeIn 0.4s ease-out forwards;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Skeleton Loading
```html
<div class="h-4 w-32 rounded skeleton-pulse"></div>
```

### Infinite Scroll (Carousel)
```html
<div class="animate-scroll-infinite">
  <!-- Content duplicated 3x -->
</div>
```
Pausas vid hover.

---

## Accessibility

### Reduced Motion
Alla animationer respekterar `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll,
  .animate-fade-in,
  /* ... alla animation-klasser */ {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }
}
```

### Selection Colors
```css
selection:bg-blue-100 selection:text-blue-900
```

---

## Layout Patterns

### Hero Section
```html
<section class="relative min-h-screen flex items-center">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <!-- Content -->
  </div>
</section>
```

### Standard Section
```html
<section class="py-20 md:py-32 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section header -->
    <div class="text-center mb-16">
      <span class="section-badge">Badge</span>
      <h2 class="section-title">Title</h2>
      <p class="section-subtitle">Subtitle</p>
    </div>

    <!-- Content grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Cards -->
    </div>
  </div>
</section>
```

### Alternating Background
```
Section 1: bg-white
Section 2: bg-slate-50
Section 3: bg-white
Section 4: bg-slate-900 (dark CTA)
```

### Dark Section
```html
<section class="py-20 bg-slate-900 text-white relative overflow-hidden">
  <div class="wave-bg">
    <div class="wave"></div>
    <div class="wave"></div>
  </div>
  <!-- Content -->
</section>
```

---

## Responsive Breakpoints

```
sm:  640px   (mobil landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
2xl: 1536px  (extra large)
```

### Common Patterns
```css
/* Typography */
text-4xl md:text-5xl

/* Grid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Spacing */
py-20 md:py-32
px-4 sm:px-6 lg:px-8

/* Visibility */
hidden md:block
md:hidden
```

---

## Gradienter

### CTA Button Gradient
```css
bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300
```

### Text Gradient
```css
background: linear-gradient(to right, #0ea5e9, #2563eb);
```

### Water Background
```css
background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
```

---

## Shadows

| Klass | Användning |
|-------|------------|
| `shadow-sm` | Cards (default) |
| `shadow-md` | Button hover |
| `shadow-lg` | Gradient button hover |
| `shadow-xl` | Card hover |

---

## Border Radius

| Klass | Storlek | Användning |
|-------|---------|------------|
| `rounded-lg` | 8px | Inputs |
| `rounded-xl` | 12px | - |
| `rounded-2xl` | 16px | Cards, buttons, icon boxes |
| `rounded-full` | 9999px | Badges, avatar |

---

## Transitions

Standard: `transition-all duration-300`

| Duration | Användning |
|----------|------------|
| `duration-200` | Fast (accordion) |
| `duration-300` | Standard (buttons, cards) |
| `duration-500` | Slow (scale animations) |
| `duration-600` | Scroll animations |
