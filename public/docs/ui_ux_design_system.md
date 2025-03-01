# Sanicle AI UI/UX Design System

<div align="center">
  <img src="/images/sanicle-logo.svg" alt="Sanicle AI Logo" width="150" />
  <h3>Modern, Accessible, and Consistent Design Language</h3>
</div>

## Table of Contents

- [Introduction](#introduction)
- [Design Principles](#design-principles)
- [Color System](#color-system)
- [Typography](#typography)
- [Components](#components)
- [Layout & Spacing](#layout--spacing)
- [Accessibility](#accessibility)
- [Dark Mode](#dark-mode)
- [Animation & Interaction](#animation--interaction)
- [Icons & Imagery](#icons--imagery)

## Introduction

The Sanicle AI design system provides a unified set of principles, components, and patterns that enable teams to design and build consistent, accessible, and user-friendly interfaces. This document outlines the core elements of our design system and how they should be applied across the platform.

## Design Principles

<div class="design-principles">
  <div class="principle">
    <h3>Clarity</h3>
    <p>Eliminate ambiguity. Enable users to see, understand, and act with confidence.</p>
  </div>
  <div class="principle">
    <h3>Efficiency</h3>
    <p>Streamline and optimize workflows. Respect users' time and attention.</p>
  </div>
  <div class="principle">
    <h3>Consistency</h3>
    <p>Create familiarity and strengthen intuition by applying the same solution to the same problem.</p>
  </div>
  <div class="principle">
    <h3>Inclusivity</h3>
    <p>Design for a diverse range of users with varying abilities and circumstances.</p>
  </div>
</div>

## Color System

Our color system is built around a primary teal palette, complemented by an accent orange, and a range of neutrals. The system supports both light and dark modes, ensuring proper contrast and accessibility.

### Primary Colors

<div class="color-palette">
  <div class="color-swatch primary">
    <div class="swatch" style="background-color: hsl(187, 100%, 26%)"></div>
    <div class="details">
      <h4>Primary</h4>
      <p>--primary: 187 100% 26%</p>
      <p>Used for primary actions, key UI elements</p>
    </div>
  </div>
  <div class="color-swatch accent">
    <div class="swatch" style="background-color: hsl(13, 85%, 53%)"></div>
    <div class="details">
      <h4>Accent</h4>
      <p>--accent: 13 85% 53%</p>
      <p>Used for emphasis, highlighting, calls to action</p>
    </div>
  </div>
  <div class="color-swatch secondary">
    <div class="swatch" style="background-color: hsl(18, 75%, 95%)"></div>
    <div class="details">
      <h4>Secondary</h4>
      <p>--secondary: 18 75% 95%</p>
      <p>Used for secondary actions and backgrounds</p>
    </div>
  </div>
</div>

### Semantic Colors

<div class="color-palette">
  <div class="color-swatch destructive">
    <div class="swatch" style="background-color: hsl(0, 84.2%, 60.2%)"></div>
    <div class="details">
      <h4>Destructive</h4>
      <p>--destructive: 0 84.2% 60.2%</p>
      <p>Used for errors, destructive actions</p>
    </div>
  </div>
  <div class="color-swatch muted">
    <div class="swatch" style="background-color: hsl(240, 4.8%, 95.9%)"></div>
    <div class="details">
      <h4>Muted</h4>
      <p>--muted: 240 4.8% 95.9%</p>
      <p>Used for subtle backgrounds, low-emphasis text</p>
    </div>
  </div>
</div>

### Chart Colors

Our data visualization colors have been carefully selected to provide clear distinctions while maintaining harmony with the overall color system.

<div class="color-palette">
  <div class="color-swatch chart-1">
    <div class="swatch" style="background-color: hsl(187, 100%, 26%)"></div>
    <p>--chart-1</p>
  </div>
  <div class="color-swatch chart-2">
    <div class="swatch" style="background-color: hsl(13, 85%, 53%)"></div>
    <p>--chart-2</p>
  </div>
  <div class="color-swatch chart-3">
    <div class="swatch" style="background-color: hsl(18, 75%, 95%)"></div>
    <p>--chart-3</p>
  </div>
  <div class="color-swatch chart-4">
    <div class="swatch" style="background-color: hsl(187, 60%, 40%)"></div>
    <p>--chart-4</p>
  </div>
  <div class="color-swatch chart-5">
    <div class="swatch" style="background-color: hsl(187, 40%, 60%)"></div>
    <p>--chart-5</p>
  </div>
</div>

## Typography

We use the Geist font family throughout our interface, which provides excellent readability and a modern aesthetic.

### Font Family

- **Primary Font**: Geist (sans-serif)
- **Monospace Font**: Geist Mono

### Type Scale

```
h1: 2.25rem (36px)
h2: 1.875rem (30px)
h3: 1.5rem (24px)
h4: 1.25rem (20px)
body: 1rem (16px)
small: 0.875rem (14px)
```

### Type Styles

- **Card Title**: 2xl, font-semibold, tracking-tight, text-primary
- **Card Description**: text-sm, text-muted-foreground
- **Button Text**: text-sm, font-medium

## Components

Our component system is built on Shadcn UI customized to match our design language. All components adhere to our design principles and accessibility standards.

### Core Components

<div class="component-grid">
  <div class="component">
    <h4>Button</h4>
    <p>Used for actions within the UI</p>
    <div class="variants">
      <span>default</span>
      <span>destructive</span>
      <span>outline</span>
      <span>secondary</span>
      <span>accent</span>
      <span>ghost</span>
      <span>link</span>
    </div>
  </div>
  
  <div class="component">
    <h4>Card</h4>
    <p>Container for organizing related content</p>
    <div class="parts">
      <span>Card</span>
      <span>CardHeader</span>
      <span>CardTitle</span>
      <span>CardDescription</span>
      <span>CardContent</span>
      <span>CardFooter</span>
    </div>
  </div>
  
  <div class="component">
    <h4>Form Elements</h4>
    <p>Input controls for user interaction</p>
    <div class="elements">
      <span>Input</span>
      <span>Checkbox</span>
      <span>Select</span>
      <span>Textarea</span>
      <span>Label</span>
    </div>
  </div>
</div>

### Component Anatomy

#### Button Component

```tsx
<Button variant="default" size="default">
  Button Text
</Button>
```

Variants:
- default (primary background)
- destructive (red background)
- outline (transparent with border)
- secondary (secondary background)
- accent (accent background)
- ghost (transparent, shows background on hover)
- link (appears as a text link)

Sizes:
- default: h-10 px-4 py-2
- sm: h-9 rounded-md px-3
- lg: h-11 rounded-md px-8
- icon: h-10 w-10

#### Card Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

## Layout & Spacing

Our layout system is based on a flexible grid system using Tailwind CSS's spacing utilities.

### Spacing Scale

We use Tailwind's default spacing scale with values from 0.5 to 64.

```
space-1: 0.25rem (4px)
space-2: 0.5rem (8px)
space-3: 0.75rem (12px)
space-4: 1rem (16px)
space-6: 1.5rem (24px)
space-8: 2rem (32px)
space-12: 3rem (48px)
space-16: 4rem (64px)
```

### Container Widths

- **Small**: max-w-sm (640px)
- **Medium**: max-w-md (768px)
- **Large**: max-w-lg (1024px)
- **Extra Large**: max-w-xl (1280px)
- **2X Large**: max-w-2xl (1536px)

### Layout Pattern Examples

<div class="mermaid">
graph TD
    A[Page Container] --> B[Header]
    A --> C[Main Content]
    A --> D[Footer]
    C --> E[Sidebar]
    C --> F[Content Area]
    F --> G[Card Grid/List]
    G --> H[Individual Cards]
</div>

## Accessibility

Our design system prioritizes accessibility, ensuring usability for all users regardless of abilities.

### Contrast Ratios

- **Normal Text**: 4.5:1 minimum contrast ratio
- **Large Text**: 3:1 minimum contrast ratio
- **UI Components/Graphics**: 3:1 minimum contrast ratio

### Focus States

All interactive elements have visible focus states with a distinctive ring color (--ring: 187 100% 26%) to aid keyboard navigation.

### Semantic HTML

Components are built using semantically appropriate HTML elements to ensure proper interpretation by assistive technologies.

## Dark Mode

Our design system fully supports dark mode with carefully adjusted color values to maintain readability and reduce eye strain.

<div class="dark-mode-comparison">
  <div class="light-mode">
    <h4>Light Mode</h4>
    <div style="background-color: hsl(0, 0%, 100%); color: hsl(240, 10%, 3.9%); padding: 16px; border-radius: 8px;">
      <p>Background: 0 0% 100%</p>
      <p>Foreground: 240 10% 3.9%</p>
    </div>
  </div>
  <div class="dark-mode">
    <h4>Dark Mode</h4>
    <div style="background-color: hsl(240, 10%, 3.9%); color: hsl(0, 0%, 98%); padding: 16px; border-radius: 8px;">
      <p>Background: 240 10% 3.9%</p>
      <p>Foreground: 0 0% 98%</p>
    </div>
  </div>
</div>

### Dark Mode Implementation

The theme toggling is implemented using the `next-themes` package, with a `theme-provider.tsx` component managing the theme state.

## Animation & Interaction

Subtle animations are used throughout the UI to enhance user experience and provide feedback.

### Transition Principles

- **Purpose**: Animations should serve a purpose, such as providing feedback or guiding attention
- **Subtlety**: Animations should be subtle and not distract from the content
- **Performance**: Animations should be performant and not cause layout shifts

### Common Transitions

- Button hover effects
- Card hover shadow transitions
- Modal entrances and exits
- Form input focus states

## Icons & Imagery

Our UI uses a consistent icon system to enhance visual communication and reinforce our brand identity.

### Icon System

Icons are implemented as React components for easy integration and styling. The icons follow a consistent visual language with a clean, minimal style.

### Icon Categories

- **Navigation Icons**: Used in navigation elements
- **Action Icons**: Represent actions such as edit, delete, upload
- **Status Icons**: Convey status information
- **Brand Icons**: Represent various services and integrations

<style>
.design-principles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.principle {
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: rgba(187, 255, 255, 0.1);
  border: 1px solid rgba(187, 255, 255, 0.2);
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}

.color-swatch {
  display: flex;
  align-items: center;
  min-width: 250px;
  margin-bottom: 1rem;
}

.swatch {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  margin-right: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.details {
  flex: 1;
}

.details h4 {
  margin: 0;
  font-weight: 600;
}

.details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.component {
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: rgba(187, 255, 255, 0.05);
  border: 1px solid rgba(187, 255, 255, 0.1);
}

.component h4 {
  margin-top: 0;
  font-weight: 600;
}

.variants, .parts, .elements {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.variants span, .parts span, .elements span {
  padding: 0.25rem 0.75rem;
  background-color: rgba(187, 255, 255, 0.1);
  border-radius: 9999px;
  font-size: 0.75rem;
}

.dark-mode-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}
</style> 