# Talxify Design System

This document outlines the core design principles, color palette, typography, and component philosophy for the Talxify web application.

## Overall Philosophy

The design aims for a modern, clean, and developer-centric aesthetic. The interface is dark-themed by default to reduce eye strain, with a focus on clarity, accessibility, and intuitive user experience. The key principles are:

-   **Clarity Over Clutter**: Every element should have a clear purpose. White space (or "dark space") is used generously to create a breathable and focused layout.
-   **Performance-Driven**: The design choices support a fast, responsive user experience. Components and styles are optimized for quick rendering.
-   **Consistency is Key**: A consistent visual language is used across the application to ensure users feel familiar and confident navigating the interface.

---

## Color Palette

The color system is built using HSL values in CSS variables for easy theming and consistency. This allows us to maintain a cohesive look in both dark and light modes. The palette is defined in `src/app/globals.css`.

### Primary Colors

-   **Primary (`--primary`)**: `hsl(21 99% 54%)` - A vibrant, energetic orange. Used for primary calls-to-action, active states, and key highlights to draw user attention.
-   **Background (`--background`)**: `hsl(0 0% 0%)` - A pure black. This provides a high-contrast canvas for content, making text easily readable.
-   **Foreground (`--foreground`)**: `hsl(60 67% 92%)` - A warm, off-white (Beige). Used for all primary body text for comfortable reading against the dark background.

### Secondary & Accent Colors

-   **Card (`--card`)**: `hsl(208 33% 12%)` - A deep, dark blue. Used as the base for cards and surfaced components to differentiate them from the main background.
-   **Secondary (`--secondary`)**: `hsl(208 33% 15%)` - A slightly lighter dark blue. Used for secondary UI elements and backgrounds.
-   **Muted (`--muted-foreground`)**: `hsl(39 44% 83%)` - A desaturated, warm tone. Used for secondary text, descriptions, and placeholders to de-emphasize them.
-   **Border (`--border`)**: `hsl(208 33% 18%)` - A subtle border color that is slightly lighter than the secondary color, used to define component boundaries without being distracting.
-   **Accent (`--accent`)**: `hsl(21 99% 48%)` - A slightly darker orange. Used for hover states and secondary highlights.

---

## Typography

The typography is chosen to be clean, readable, and professional, befitting a developer tool. Fonts are managed via `next/font` in `src/app/layout.tsx` and configured in `tailwind.config.ts`.

-   **Headline Font (`--font-syne`)**: **Syne**
    -   **Usage**: Used for all major headings (`<h1>`, `<h2>`, etc.) and prominent titles.
    -   **Why**: Syne provides a modern, slightly geometric feel that is distinctive and adds personality without sacrificing readability. It's used to make key information stand out.

-   **Body Font (`--font-outfit`)**: **Outfit**
    -   **Usage**: Used for all body text, paragraphs, labels, and general UI content.
    -   **Why**: Outfit is a clean, neutral sans-serif that is exceptionally readable at various sizes. Its clarity makes it perfect for user interfaces.

-   **Code Font (`font-code`)**: **Source Code Pro**
    -   **Usage**: Used for displaying code snippets and monospaced text.
    -   **Why**: As a developer-focused application, having a clear, legible monospaced font is essential. Source Code Pro is designed for coding environments and offers excellent clarity.

---

## Component Strategy

-   **Base Components**: The application is built using **ShadCN UI**. This provides a set of unstyled, accessible, and composable base components that can be fully customized.
-   **Styling**: **Tailwind CSS** is used for all styling. This utility-first approach allows for rapid development and ensures consistency by using a predefined design token system (e.g., `p-4` for padding).
-   **Icons**: Icons are provided by the **Lucide React** library, which offers a wide range of clean, modern, and consistent icons.
-   **Layout**: The main application layout is managed via a persistent sidebar (`src/components/layout/app-sidebar.tsx`) for navigation within the authenticated part of the app.
