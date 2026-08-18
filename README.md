# User Directory Dashboard

A premium, responsive, and high-fidelity User Directory dashboard built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and custom components styled after **shadcn/ui** patterns. It uses **Axios** to fetch realistic mock user directory information from the DummyJSON public API.

---

## ✨ Features

- 🖥️ **Overview Dashboard**: Displays high-level stats counters (Total Contacts, Departments represented, Regions represented) computed dynamically.
- 🔍 **Interactive Search & Filter**: Supports instantaneous text searching (matching names, usernames, emails, or company names) and filtering by Department dropdown.
- 🔃 **Dynamic Sorting**: Sort directory lists alphabetically by **Name**, **Company**, or **Email** with toggleable **Ascending/Descending** order.
- 🎛️ **Layout Mode Switcher**: Easily toggle between a visual **Grid Card View** and a structured **Tabular List View**. Layout choices are saved in `localStorage` to persist across page navigations.
- 👤 **Dynamic Profile Details Page**: Navigate to `/users/[id]` to inspect detailed profile cards containing:
  - Personal Details (Email, phone, university, date of birth, age, gender)
  - Professional Role & Company Address
  - Biological Metrics (Blood group, height/weight, hair & eye style)
  - Geographical Location
- 🎨 **Light Mode Optimized**: Overridden dark theme rules using Tailwind CSS v4 custom variant mapping to lock the user interface in a clean, high-contrast, premium light/white mode.
- ⏳ **Graceful UX states**: Features pulsing skeleton placeholders during API fetches and custom error retry boundaries on network connection issues.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.3.1 (App Router, Turbopack compiler)
- **Runtime & Package Manager**: Bun v1.2.15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + `@tailwindcss/postcss`
- **API Client**: Axios (used exclusively; no fetch)
- **Icons**: Lucide React
- **Utility Libraries**: `clsx` and `tailwind-merge` (for standard shadcn/ui style dynamic class concatenation)

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites

Make sure you have [Bun](https://bun.sh) (v1.2.0 or newer) installed.

### 1. Install Dependencies

Clone this repository, navigate to the project directory, and install the package dependencies:

```bash
bun install
```

### 2. Run the Development Server

Start the Next.js development server in Turbopack compile mode:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application dashboard.

### 3. Compile for Production

To create an optimized production build of the project:

```bash
bun run build
```

This compiles static routing layouts, runs TypeScript validations, and outputs production assets.

### 4. Code Quality & Linting

To run ESLint syntax and formatting validations:

```bash
bun run lint
```

---

## 📂 Project Structure

```text
├── app/
│   ├── layout.tsx            # Global app shell (header, footer, font variables)
│   ├── page.tsx              # Main Directory Dashboard (search, sort, filters, layout toggle)
│   ├── globals.css           # Global CSS variables & Tailwind v4 dark-mode override
│   └── users/
│       └── [id]/
│           └── page.tsx      # Dynamic User Profile Page (React 19 dynamic param resolution)
├── components/
│   └── ui/                   # Reusable components styled like shadcn/ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── skeleton.tsx
│       └── table.tsx
├── lib/
│   └── utils.ts              # classnames merging helper (cn utility)
├── package.json              # Script tasks and version dependencies
├── tsconfig.json             # TypeScript rules and alias path mapping
└── README.md
```

---

## 📡 API Integration

The project integrates with the **DummyJSON Users API**:
- **Directory List**: Fetches 100 profiles from `https://dummyjson.com/users?limit=100` via Axios.
- **Profile Detail**: Fetches a single user record from `https://dummyjson.com/users/${id}` on demand.
